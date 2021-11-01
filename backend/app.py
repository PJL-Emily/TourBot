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
        user_id = request.get_json(force=True) ["user_id"]
        state = db.states.find({"user_id": ObjectId(user_id)})
        if state is None :
            return jsonify({'message':'State not exists.'}), 400
        return jsonify({'message':'ok', 'data': state}), 200
    except:
        return jsonify({'message':'Failed to get user state.'}), 400

@app.route('/getHotelInfo', methods=['GET'])
def getHotelInfo():
    try:
        # query by state
        # state = db.states.findOne({"user_id": ObjectId(user_id)})
        # name = state.hotel

        # query by hotel name
        name = request.get_json(force=True)['hotel']
        hotel = db.hotels.find_one({"名称": name}, 
        {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '酒店设施': 1, '地铁': 1, '价格': 1})
        if hotel is None :
            return jsonify({'message':'Hotel name not exists.'}), 400

        # google search result
        links = googleSearchLink(name)
        img = googleSearchImg(name)
        hotel.update({"img": img, "search_results":links})

        return jsonify({'message':'ok', "data": hotel}), 200
    except:
        return jsonify({'message':'Failed to get hotel info.'}), 400

@app.route('/getSiteInfo', methods=['GET'])
def getSiteInfo():
    try:
        # query by state
        # state = db.states.findOne({"user_id": ObjectId(user_id)})
        # name = state.site

        # query by site name
        name = request.get_json(force=True)['site']
        site = db.attractions.find_one({"名称": name}, 
        {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '地铁': 1, '游玩时间': 1, '门票': 1})
        if site is None :
            return jsonify({'message':'Site name not exists.'}), 400

        # google search result
        links = googleSearchLink(name)
        img = googleSearchImg(name)
        site.update({"img": img, "search_results":links})

        return jsonify({'message':'ok',  'data':site}), 200
    except:
        return jsonify({'message':'Failed to get site info.'}), 400

@app.route('/getRestInfo', methods=['GET'])
def getRestInfo():
    try:
        # query by state
        # state = db.states.findOne({"user_id": ObjectId(user_id)})
        # name = state.rest

        # query by rest name
        name = request.get_json(force=True)['rest']
        rest = db.restaurants.find_one({"名称": name}, 
        {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '地铁': 1, '营业时间': 1, '人均消费': 1})
        if rest is None :
            return jsonify({'message':'Restaurant name not exists.'}), 400

        # google search result
        links = googleSearchLink(name)
        img = googleSearchImg(name)
        rest.update({"img": img, "search_results": links})

        return jsonify({'message':'ok',  'data':rest}), 200
    except:
        return jsonify({'message':'Failed to get rest info.'}), 400

@app.route('/sendUserUtter' , methods=['POST'])
def sendMsg2Pipeline():
    user_id = request.get_json(force=True)['user_id']
    # print(user_id, type(user_id))
    user_utter = request.get_json(force=True)['msg']
    user_utter = OpenCC('t2s').convert(user_utter)
    # result = db.users.find({ "_id": user_id })
    # print(result)
    result = db.users.find_one({ "_id": ObjectId(user_id) })
    print(result)
    if result is None:
        return jsonify({'message':'User not found.'}), 400

    # get user current state from db
    current_state = db.states.find_one({ "user_id": ObjectId(user_id) })
    # print(type(current_state))
    if current_state is not None:
        current_id = current_state.pop('_id', None)
        current_state.pop('user_id', None)

    # pipeline
    sys_utter, next_state, recommend, select, taxi, hotel, site, restaurant = pipeline.reply(user_utter, current_state = current_state)

    # store state in db
    next_state['user_id'] = ObjectId(user_id)
    if current_state == None:
        state_id = db.states.insert_one(next_state)
    else:
        myquery = { "_id": ObjectId(current_id) }
        newvalues = { "$set": next_state }
        db.states.update_one(myquery, newvalues)

    # store recommend, select in db
    for item in recommend:
        item['user_id'] = ObjectId(user_id)
        db.recommend.insert_one(item) 
    for item in select:
        item['user_id'] = ObjectId(user_id)
        db.select.insert_one(item) 
    
    data = {}
    for domain in ['taxi', 'rest', 'hotel', 'site']:
        exec(f"data[domain] = ({domain})")
    data['utter'] = sys_utter
    
    # todo: save state and data to db

    # after save utter to db, translate the sys utter to traditional chinese
    data['utter'] = OpenCC('s2t').convert(sys_utter)
    
    return jsonify({'message':'ok', 'data': data}), 200

@app.route('/restartSession' , methods=['POST'])
def restartSession():
    user_id = request.get_json(force=True)['user_id']
    result = db.users.find_one({ "_id": ObjectId(user_id) })
    if result is None:
        return jsonify({'message':'User not found.'}), 400
    
    # clear user state
    result = db.users.update_one({ "_id": ObjectId(user_id) }, { "$set": { "state": {} } })
    if (result == 1):
        return jsonify({'message':'ok'}), 200
    else:
        return jsonify({'message':'update failed.'}), 400

# state = {'belief_state': {'出租': {'出发地': '', '目的地': ''},
#                 '地铁': {'出发地': '', '目的地': ''},
#                 '景点': {'名称': '',
#                         '周边景点': '',
#                         '周边酒店': '',
#                         '周边餐馆': '',
#                         '游玩时间': '',
#                         '评分': '',
#                         '门票': ''},
#                 '酒店': {'价格': '',
#                         '名称': '',
#                         '周边景点': '',
#                         '周边酒店': '',
#                         '周边餐馆': '',
#                         '评分': '',
#                         '酒店类型': '',
#                         '酒店设施': ''},
#                 '餐馆': {'人均消费': '50-100元',
#                         '名称': '',
#                         '周边景点': '',
#                         '周边酒店': '',
#                         '周边餐馆': '',
#                         '推荐菜': '美食街',
#                         '评分': ''}},
# 'cur_domain': '餐馆',
# 'history': [],
# 'request_slots': [['餐馆', '名称']],
# 'system_action': [],
# 'terminated': False,
# 'user_action': [['General', 'greet', 'none', 'none'],
#                 ['General', 'thank', 'none', 'none'],
#                 ['Request', '餐馆', '名称', ''],
#                 ['Inform', '餐馆', '推荐菜', '美食街'],
#                 ['Inform', '餐馆', '人均消费', '50-100元']]}

# state_id = db.states.insert_one(state)
# print(state_id)

# a = db.states.find_one({ "cur_domain": "餐馆" })
# print(a)


    

if __name__ == '__main__':
    app.run()
