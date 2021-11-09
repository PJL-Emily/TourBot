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
    try:
        user_id = request.args.get("user_id")
        # test
        # print("user_id: ", user_id)
        state = db.states.find_one({"user_id": ObjectId(user_id)},{"_id": 0, "belief_state": 1})

        if state is None :
            return jsonify({'message':'User belief state not exists.'}), 400

        belief_state = state['belief_state']

        user_state = {}
        domain_set_en = ['hotel', 'site', 'rest']
        domain_set_zh = ['酒店', '景点', '餐馆']
        trans_set_en = ['taxi', 'sub']
        trans_set_zh = ['出租', '地铁']

        for i, domain in enumerate(domain_set_en):
            value = belief_state[domain_set_zh[i]]['名称']
            user_state[domain] = OpenCC('s2twp').convert(value)

        for i, trans in enumerate(trans_set_en):
            start = belief_state[trans_set_zh[i]]['出发地']
            end = belief_state[trans_set_zh[i]]['目的地']
            user_state[trans] = [OpenCC('s2twp').convert(start), OpenCC('s2twp').convert(end)]
        
        return jsonify({'message':'ok', 'data': user_state}), 200
    except:
        return jsonify({'message':'Failed to get user state.'}), 400

@app.route('/getHotelInfo', methods=['GET'])
def getHotelInfo():
    try:
        user_id = request.args.get("user_id")
        belief_state = db.states.find_one({"user_id": ObjectId(user_id)},{"_id": 0, "belief_state": 1})

        if belief_state is None:
            return jsonify({'message':'User belief state not exists.'}), 400

        name = belief_state['belief_state']['酒店']['名称']
        hotel = db.hotels.find_one({"名称": name}, 
        {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '酒店设施': 1, '地铁': 1, '价格': 1})
        if hotel is None :
            return jsonify({'message':'Hotel name not exists.'}), 400
        
        # 簡轉繁
        hotel_to_tw = {}
        for key in hotel:
            new_key = OpenCC('s2twp').convert(key)
            if hotel[key] is None:
                hotel_to_tw.update({new_key:"無"})
            elif type(hotel[key]) == int or type(hotel[key]) == float :
                new = hotel[key]
            elif type(hotel[key]) == list:
                new = [OpenCC('s2twp').convert(i) for i in hotel[key]]
            else:
                new = OpenCC('s2twp').convert(hotel[key])
            hotel_to_tw.update({new_key:new})

        # google search result
        links = googleSearchLink(name)
        img = googleSearchImg(name)
        hotel_to_tw.update({"img": img, "search_results":links})

        return jsonify({'message':'ok', "data": hotel_to_tw}), 200
    except:
        return jsonify({'message':'Failed to get hotel info.'}), 400

@app.route('/getSiteInfo', methods=['GET'])
def getSiteInfo():
    try:
        user_id = request.args.get("user_id")
        belief_state = db.states.find_one({"user_id": ObjectId(user_id)},{"_id": 0, "belief_state": 1})
        if belief_state is None:
            return jsonify({'message':'User belief state not exists.'}), 400
    
        name = belief_state['belief_state']['景点']['名称']
        site = db.attractions.find_one({"名称": name}, 
        {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '地铁': 1, '游玩时间': 1, '门票': 1})

        if site is None :
            return jsonify({'message':'Site name not exists.'}), 400
        
        # 簡轉繁
        site_to_tw = {}
        for key in site:
            new_key = OpenCC('s2twp').convert(key)
            if site[key] is None:
                site_to_tw.update({new_key:"無"})
            elif type(site[key]) == int or type(site[key]) == float :
                site_to_tw.update({new_key:site[key]})
            else:
                new = OpenCC('s2twp').convert(site[key])
                site_to_tw.update({new_key:new})

        # google search result
        links = googleSearchLink(name)
        img = googleSearchImg(name)
        site_to_tw.update({"img": img, "search_results":links})

        return jsonify({'message':'ok',  'data':site_to_tw}), 200
    except:
        return jsonify({'message':'Failed to get site info.'}), 400

@app.route('/getRestInfo', methods=['GET'])
def getRestInfo():
    try:
        user_id = request.args.get("user_id")
        belief_state = db.states.find_one({"user_id": ObjectId(user_id)},{"_id": 0, "belief_state": 1})
        if belief_state is None:
            return jsonify({'message':'User belief state not exists.'}), 400

        name = belief_state['belief_state']['餐馆']['名称']
        rest = db.restaurants.find_one({"名称": name}, 
        {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '地铁': 1, '营业时间': 1, '人均消费': 1})

        if rest is None :
            return jsonify({'message': 'Restaurant name not exists.'}), 400
        
        # 簡轉繁
        rest_to_tw = {}
        for key in rest:
            new_key = OpenCC('s2twp').convert(key)
            if rest[key] is None:
                rest_to_tw.update({new_key:"無"})
            elif type(rest[key]) == int or type(rest[key]) == float :
                rest_to_tw.update({new_key:rest[key]})
            else:
                new = OpenCC('s2twp').convert(rest[key])
                rest_to_tw.update({new_key:new})

        # google search result
        links = googleSearchLink(name)
        img = googleSearchImg(name)
        rest_to_tw.update({"img": img, "search_results": links})

        return jsonify({'message':'ok', 'data':rest_to_tw}), 200
    except:
        return jsonify({'message':'Failed to get rest info.'}), 400

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
