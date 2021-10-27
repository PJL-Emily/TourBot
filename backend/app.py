from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask.json import JSONEncoder
from bson import json_util
from config import Config
import pymongo
import os
from dotenv import load_dotenv
from serpapi import GoogleSearch
from convlab2.dialog_agent.pipeline import Pipeline

class MongoJSONEncoder(JSONEncoder):
    def default(self, obj): 
        return json_util.default(obj)

app = Flask(__name__)
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
        state = db.states.find({"user_id": user_id})
        if state is None :
            return jsonify({'message':'State not exists.'}), 400
        return jsonify({'message':'ok', 'data': state}), 200
    except:
        return jsonify({'message':'Failed to get user state.'}), 400

@app.route('/getHotelInfo', methods=['GET'])
def getHotelInfo():
    try:
        # query by state
        # state = db.states.findOne({"user_id": user_id})
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
        # state = db.states.findOne({"user_id": user_id})
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
        # state = db.states.findOne({"user_id": user_id})
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
        rest.update({"img": img, "search_results":links})

        return jsonify({'message':'ok',  'data':rest}), 200
    except:
        return jsonify({'message':'Failed to get rest info.'}), 400

@app.route('/sendUserUtter' , methods=['POST'])
def sendMsg2Pipeline():
    user_id = request.get_json(force=True)['user_id']
    result = db.users.find_one({ "_id": user_id })
    if (not result):
        return jsonify({'message':'User not found.'}), 400
    
    # pipeline
    current_state = None # todo: get previous state from db
    sys_utter, next_state, recommend, select, taxi, hotel, site, restaurant = pipeline.reply(utterance, current_state = current_state)
    # todo: save state and data to db
    return jsonify({'message':'ok', 'data': sys_utter}), 200

@app.route('/restartSession' , methods=['POST'])
def restartSession():
    user_id = request.get_json(force=True)['user_id']
    result = db.users.find_one({ "_id": user_id })
    if (not result):
        return jsonify({'message':'User not found.'}), 400
    
    # clear user state
    result = db.users.update_one({ "_id": user_id }, { "$set": { "state": {} } })
    if (result == 1):
        return jsonify({'message':'ok'}), 200
    else:
        return jsonify({'message':'update failed.'}), 400

if __name__ == '__main__':
    app.run()
