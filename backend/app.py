from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask.json import JSONEncoder
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
from config import Config
import pymongo
import os
from dotenv import load_dotenv
from serpapi import GoogleSearch
from convlab2.dialog_agent.pipeline import Pipeline
from convlab2.util.crosswoz.state import default_state
from opencc import OpenCC

class MongoJSONEncoder(JSONEncoder):
    def default(self, obj): 
        return json_util.default(obj)

app = Flask(__name__)
cors = CORS(app)
app.json_encoder = MongoJSONEncoder
load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')
client = pymongo.MongoClient(MONGO_URI)
db = client.TourBot

# initial pipeline model
pipeline = Pipeline()

def googleSearchLink(query):
    try:
        params = {
            "q": query,
            "api_key": os.getenv('API_KEY'),
            "location": "Beijing,China",
            "num": 4
        }
        search = GoogleSearch(params)
        results = search.get_dict()
        links = []
        for result in results["organic_results"]:
            item = {
              "text": result['title'],
              "url": result['link']
            }
            links.append(item)
            if(len(links) == 3) :
                break
        return links
    except:
        print("No page found.")

def googleSearchImg(query):
    try:
        params = {
            "q": query,
            "api_key": os.getenv('API_KEY'),
            "tbm": "isch",
            "num": 1
        }
        search = GoogleSearch(params)
        results = search.get_dict()
        return results['images_results'][0]["original"]
    except:
        print("No image found.")

def sp2tw(dict):
    try:
        result = {}
        for key in dict:
            new_key = OpenCC('s2twp').convert(key)
            if dict[key] is None:
                new = "無"
            elif type(dict[key]) == int or type(dict[key]) == float :
                new = dict[key]
            elif type(dict[key]) == list:
                new = [OpenCC('s2twp').convert(i) for i in dict[key]]
            else:
                new = OpenCC('s2twp').convert(dict[key])
            result.update({new_key:new})
        return result
    except:
        print("Fail to turn simplified chinese to mandarin.")

@app.route('/submitUserInfo', methods=['POST'])
def submitUserInfo():
    try:
        userInfo = request.get_json(force=True)
        user_dict = {
            'purpose':userInfo['purpose'],
            'gender':userInfo['gender'],
            'age':userInfo['age']
        }
        new_user = db.users.insert(user_dict)
        return jsonify({'message':'ok', 'data':{'user_id': str(new_user)}}), 200
    except:
        return jsonify({'message':'Failed to submit user info.'}), 400

@app.route('/getUserState', methods=['GET'])
def getUserState():
    user_id = request.args.get("user_id")
    
    if user_id is None:
        return jsonify({'message': 'Fail to get request parameter.'}), 400
    # test
    # print("user_id: ", user_id)
    try:
        state = db.states.find_one({"user_id": ObjectId(user_id)},{"_id": 0, "belief_state": 1})
    except:
        return jsonify({'message': 'Fail to get state with user id {}.'.format(user_id)}), 400

    if state is None :
        return jsonify({'message':'User state not exists.'}), 200

    belief_state = state['belief_state']

    user_state = {}
    domain_set_en = ['hotel', 'site', 'rest']
    domain_set_zh = ['酒店', '景点', '餐馆']
    trans_set_en = ['taxi', 'sub']
    trans_set_zh = ['出租', '地铁']

    for i, domain in enumerate(domain_set_en):
        name = belief_state[domain_set_zh[i]]['名称']

        if name == "":
            user_state[domain] = {'name': "", 'addr': ""}
            continue
    
        name_to_tw = OpenCC('s2twp').convert(name)

        if i == 0:
            try:
                addr = db.hotels.find_one({'名称':name}, {"_id": 0, "地址": 1})
            except:
                return jsonify({'message': 'Fail to get hotel address with hotel name {}.'.format(name_to_tw)}), 400
        elif i == 1:
            try:
                addr = db.attractions.find_one({'名称':name}, {"_id": 0, "地址": 1})
            except:
                return jsonify({'message': 'Fail to get site address with site name {}.'.format(name_to_tw)}), 400
        else:
            try:
                addr = db.restaurants.find_one({'名称':name}, {"_id": 0, "地址": 1})
            except:
                return jsonify({'message': 'Fail to get restaurant address with restaurant name {}.'.format(name_to_tw)}), 400
    
        addr_to_tw = OpenCC('s2twp').convert(addr['地址'])
        user_state[domain] = {'name': name_to_tw, 'addr': addr_to_tw}

    for i, trans in enumerate(trans_set_en):
        start = belief_state[trans_set_zh[i]]['出发地']
        end = belief_state[trans_set_zh[i]]['目的地']
        user_state[trans] = [OpenCC('s2twp').convert(start), OpenCC('s2twp').convert(end)]
    
    return jsonify({'message':'ok', 'data': user_state}), 200

@app.route('/getHotelInfo', methods=['GET'])
def getHotelInfo():
    result = []
    show = {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '酒店设施': 1, '地铁': 1, '价格': 1}

    user_id = request.args.get("user_id")

    if user_id is None:
        return jsonify({'message': 'Fail to get request parameter.'}), 400

    # get current state hotel info
    try:
        belief_state = db.states.find_one({"user_id": ObjectId(user_id)},{"_id": 0, "belief_state": 1})
        # check if user state exists
        if belief_state is None:
            return jsonify({'message': 'User state not exists.'}), 200
    except:
        return jsonify({'message': 'Fail to find state with user id {}.'.format(user_id)}), 400

    name = belief_state['belief_state']['酒店']['名称']

    # find hotel with hotel name in state
    try: 
        hotel = db.hotels.find_one({"名称": name}, show)
        # if hotel is None :
        #     return jsonify({'message':'Hotel name not exists.'}), 200
        if hotel is not None :
            result.append(hotel)
    except:
        return jsonify({'message': 'Fail to find hotel with hotel name {}.'.formet(name)}), 400

    # get history hotel info
    try:
        select = db.select.find_one({"user_id": ObjectId(user_id), "expired": False})
    except:
        return jsonify({'message': 'Fail to get history hotels with user id {}.'.format(user_id)}), 400

    if select is not None:
        history = select['content']
        hotels = [x['name'] for x in history if x['domain'] == '酒店']
        # get unique values of hotel names
        hotels = sorted(set(hotels), key=hotels.index)

        for n in hotels:
            try:
                # check if the hotel exists in current state
                if n != name:
                    temp = db.hotels.find_one({"名称": n}, show)
                    if temp is not None:
                        result.append(temp)
            except:
                return jsonify({'message': 'Fail to find hotel with hotel name {}.'.formet(n)}), 400

    if len(result) == 0:
        return jsonify({'message': 'No hotel exists in user state and history.'}), 200

    result_to_tw = []

    for obj in result:

        # simplified chinese to mandarin
        obj_to_tw = sp2tw(obj)
        
        # google search result
        links = googleSearchLink(obj['名称'])
        img = googleSearchImg(obj['名称'])
        obj_to_tw.update({"img": img, "search_results": links})

        result_to_tw.append(obj_to_tw)

    return jsonify({'message': 'ok',  'data': result_to_tw}), 200

@app.route('/getSiteInfo', methods=['GET'])
def getSiteInfo():
    result = []
    show = {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '地铁': 1, '游玩时间': 1, '门票': 1}

    user_id = request.args.get("user_id")

    if user_id is None:
        return jsonify({'message': 'Fail to get request parameter.'}), 400

    # get current state site info
    try:
        belief_state = db.states.find_one({"user_id": ObjectId(user_id)},{"_id": 0, "belief_state": 1})
        # check if user state exists
        if belief_state is None:
            return jsonify({'message': 'User state not exists.'}), 200
    except:
        return jsonify({'message': 'Fail to find state with user id {}.'.format(user_id)}), 400
    
    name = belief_state['belief_state']['景点']['名称']
    
    # find site with site name in state
    try: 
        site = db.attractions.find_one({"名称": name}, show)
        # if site is None :
        #     return jsonify({'message':'Site name not exists.'}), 200
        if site is not None :
            result.append(site)
    except:
        return jsonify({'message': 'Fail to find sites with site name {}.'.formet(name)}), 400

    # get history site info
    try:
        select = db.select.find_one({"user_id": ObjectId(user_id), "expired": False})
    except:
        return jsonify({'message': 'Fail to get history site with user id {}.'.format(user_id)}), 400

    if select is not None:
        history = select['content']
        sites = [x['name'] for x in history if x['domain'] == '景点']

        # get unique values of site names
        sites = sorted(set(sites), key=sites.index)

        for n in sites:
            # check if the site exists in current state
            if n != name:
                try:
                    temp = db.attractions.find_one({"名称": n}, show)
                    if temp is not None:
                        result.append(temp)
                except:
                    return jsonify({'message': 'Fail to find site with site name {}.'.formet(n)}), 400

    if len(result) == 0:
        return jsonify({'message': 'No site exists in user state and history.'}), 200

    result_to_tw = []

    for obj in result:

        # simplified chinese to mandarin
        obj_to_tw = sp2tw(obj)
        
        # google search result
        links = googleSearchLink(obj['名称'])
        img = googleSearchImg(obj['名称'])
        obj_to_tw.update({"img": img, "search_results":links})

        result_to_tw.append(obj_to_tw)

    return jsonify({'message':'ok',  'data':result_to_tw}), 200

@app.route('/getRestInfo', methods=['GET'])
def getRestInfo():
    result = []
    show = {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '地铁': 1, '营业时间': 1, '人均消费': 1}

    user_id = request.args.get("user_id")

    if user_id is None:
        return jsonify({'message': 'Fail to get request parameter.'}), 400

    # get current state rest info
    try:
        belief_state = db.states.find_one({"user_id": ObjectId(user_id)},{"_id": 0, "belief_state": 1})
        # check if user state exists
        if belief_state is None:
            return jsonify({'message': 'User state not exists.'}), 200
    except:
        return jsonify({'message': 'Fail to find state with user id {}.'.format(user_id)}), 400
    
    name = belief_state['belief_state']['餐馆']['名称']

    # find rest with rest name in state
    try: 
        rest = db.restaurants.find_one({"名称": name}, show)
        # if rest is None :
        #     return jsonify({'message':'Restaurant name not exists.'}), 200
        if rest is not None :
            result.append(rest)
    except:
        return jsonify({'message': 'Fail to find restaurant with restaurant name {}.'.formet(name)}), 400

    # get history rest info
    try:
        select = db.select.find_one({"user_id": ObjectId(user_id), "expired": False})
    except:
        return jsonify({'message': 'Fail to get history restaurants with user id {}.'.format(user_id)}), 400

    if select is not None:
        history = select['content']
        rests = [x['name'] for x in history if x['domain'] == '餐馆']

        # get unique values of rest names
        rests = sorted(set(rests), key=rests.index)

        for n in rests:
            # check if the rest exists in current state
            if n != name:
                try:
                    temp = db.restaurants.find_one({"名称": n}, show)
                    if temp is not None:
                        result.append(temp)
                except:
                    return jsonify({'message': 'Fail to find restaurant with restaurant name {}.'.formet(n)}), 400

    if len(result) == 0:
        return jsonify({'message': 'No restaurant exists in user state and history.'}), 200

    result_to_tw = []

    for obj in result:

        # simplified chinese to mandarin
        obj_to_tw = sp2tw(obj)
        
        # google search result
        links = googleSearchLink(obj['名称'])
        img = googleSearchImg(obj['名称'])
        obj_to_tw.update({"img": img, "search_results":links})

        result_to_tw.append(obj_to_tw)

    return jsonify({'message': 'ok',  'data': result_to_tw}), 200


commonWord = {}
commonWord['飯店'] = "酒店"

@app.route('/sendUserUtter', methods=['POST'])
def sendMsg2Pipeline():
    user_id = request.get_json(force=True)['user_id']
    user_utter = request.get_json(force=True)['msg']

    # key phrase transfer
    for key in commonWord:
        if key in user_utter:
            user_utter = user_utter.replace(key, commonWord[key])

    user_utter = OpenCC('tw2sp').convert(user_utter)
    print("簡問:", user_utter)
    try:
        result = db.users.find_one({ "_id": ObjectId(user_id) })
    except:
        return jsonify({'message':'Finding user failed.'}), 400
    if result is None:
        return jsonify({'message':'User not found.'}), 400

    # get user current state from db
    try: 
        current_state = db.states.find_one({ "user_id": ObjectId(user_id) })
    except: 
        return jsonify({'message':'Finding user state failed.'}), 400
    if current_state != None:
        current_id = current_state.pop('_id', None)
        current_state.pop('user_id', None)

    # pipeline
    sys_utter, next_state, recommend, select, taxi, hotel, site, rest = pipeline.reply(user_utter, current_state = current_state)

    # store state in db
    next_state['user_id'] = ObjectId(user_id)
    if current_state == None:
        try:
            state_id = db.states.insert_one(next_state)
        except: 
            return jsonify({'message':'Insert user state failed.'}), 400
    else:
        myquery = { "_id": ObjectId(current_id) }
        newvalues = { "$set": next_state }
        try:
            db.states.update_one(myquery, newvalues)
        except:
            return jsonify({'message':'Update user state failed.'}), 400

    # store recommend, select in db
    if len(recommend) != 0:
        try:
            result = db.recommend.find_one({ "user_id": ObjectId(user_id), "expired": False })
        except:
            return jsonify({'message':'Finding user recommend failed.'}), 400
        if result is None:
            newRecommend = {}
            newRecommend['user_id'] = ObjectId(user_id)
            newRecommend['expired'] = False
            newRecommend['content'] = recommend
            try:
                db.recommend.insert_one(newRecommend)
            except:
                return jsonify({'message':'Insert user recommend failed.'}), 400
        else:
            contentNow = result['content'] 
            contentNow += recommend
            try:
                db.recommend.update_one({ "user_id": ObjectId(user_id), "expired": False }, { "$set": { "content": contentNow } })
            except:
                return jsonify({'message':'Update user recommend failed.'}), 400
    if len(select) != 0:
        try:
            result = db.select.find_one({ "user_id": ObjectId(user_id), "expired": False })
        except:
            return jsonify({'message':'Finding user select failed.'}), 400
        if result is None:
            newSelect = {}
            newSelect['user_id'] = ObjectId(user_id)
            newSelect['expired'] = False
            newSelect['content'] = select 
            try:
                db.select.insert_one(newSelect)
            except:
                return jsonify({'message':'Insert user select failed.'}), 400
        else:
            contentNow = result['content'] 
            contentNow += select
            try:
                db.select.update_one({ "user_id": ObjectId(user_id), "expired": False }, { "$set": { "content": contentNow } })
            except:
                return jsonify({'message':'Update user select failed.'}), 400

    data = {}
    for domain in ['taxi', 'rest', 'hotel', 'site']:
        exec(f"data[domain] = ({domain})")
    data['utter'] = sys_utter
    # after save utter to db, translate the sys utter to traditional chinese
    print("簡答:", sys_utter)
    data['utter'] = OpenCC('s2twp').convert(sys_utter)
    
    return jsonify({'message':'ok', 'data': data}), 200

@app.route('/restartSession', methods=['POST'])
def restartSession():
    user_id = request.get_json(force=True)['user_id']
    result = db.users.find_one({ "_id": ObjectId(user_id) })
    if result is None:
        return jsonify({'message':'User not found.'}), 400
    
    # clear user state (update to default state)
    try: 
        result = db.states.update_one({ "user_id": ObjectId(user_id) }, { "$set": default_state() })
        print("state update count:", result.modified_count)
    except:
        return jsonify({'message': 'state update failed.'}), 400
    # replace user id of recommend as null
    try: 
        result = db.recommend.update_one({ "user_id": ObjectId(user_id) }, { "$set": { "expired": True } })
        print("recommend update count:", result.modified_count)
    except: 
        return jsonify({'message': 'recommend update failed.'}), 400
    # replace user id of select as null
    try: 
        result = db.select.update_one({ "user_id": ObjectId(user_id) }, { "$set": { "expired": True } })
        print("select update count:", result.modified_count)
    except: 
        return jsonify({'message': 'select update failed.'}), 400
    return jsonify({'message':'ok'}), 200

if __name__ == '__main__':
    app.run()
