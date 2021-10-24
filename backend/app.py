from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask.json import JSONEncoder
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from bson import json_util
from config import Config
import pymongo
import os
from dotenv import load_dotenv
from googlesearch import search


class MongoJSONEncoder(JSONEncoder):
    def default(self, obj): 
        return json_util.default(obj)

app = Flask(__name__)
app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = "super-secret"
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
# app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
app.json_encoder = MongoJSONEncoder
load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')
client = pymongo.MongoClient(MONGO_URI)
db = client.TourBot
jwt = JWTManager(app)

def tokenValid(token):
    # check validation by JWT
    return True

#post /senUserUtter/<token> data: {token :}/<msg> data: {msg :}
# @app.route('/store/<string:token>/<string: msg>' , methods=['POST'])
# def sendMsg2Pipeline(token, msg):
#     return 

#post /restartSession/<token> data: {token :}
# @app.route('/restartSession/<string:token>' , methods=['POST'])
# def restartSession(token):
#     # validate token
#     isValid = tokenValid(token)
#     if (not isValid):
#         return "token expired."
#     # update user state
#     result = db.users.update_one({ "token": token }, { "$set": { "state": {} } })
#     if (result == 1):
#         return "ok"
#     else:
#         return "update failed."

#post /exit/<token> data: {token :}
# @app.route('/exit/<string:token>' , methods=['POST'])
# def exit(token):
#     # validate token
#     isValid = tokenValid(token)
#     if (not isValid):
#         return "token expired."
#     # update user state
#     result = db.users.update_one({ "token": token }, { "$set": { "state": {} } })
#     if (result == 1):
#         return "ok"
#     else:
#         return "failed to exit."

@jwt.expired_token_loader
def expiredTokenCallback(jwt_header, jwt_payload):
    return jsonify(message="token expired."), 401

@app.route('/protected', methods=['GET', 'POST'])
@jwt_required()
def protected(): 
    identity = get_jwt_identity()
    return jsonify(msg='ok'), 200

@app.route('/submitUserInfo', methods=['POST'])
def submitUserInfo():
    try:
        userInfo = request.get_json(force=True)
        user_dict = {
            'purpose':userInfo['purpose'],
            'gender':userInfo['gender'],
            'age':userInfo['age']
        }
        new_user = db.users.insert_one(user_dict).inserted_id

        # create jwt token
        accesstoken = create_access_token(identity=new_user)
        return jsonify({'message':'ok', 'data':{'accesstoken': accesstoken}}), 200
    except:
        return jsonify({'message':'Failed to submit user info.'}), 400

@app.route('/getUserState', methods=['GET'])
@jwt_required()
def getUserState():
    try:
        token = request.get_json()['token']
        user = db.users.find({"token": token})
        state = db.states.find({"user_id": user._id.str})
        if state is None :
            return jsonify({'message':'State not exists.'}), 400
        return jsonify({'message':'ok', 'data': state}), 200
    except BulkWriteError as e:
        return jsonify({'message':'Failed to get user state.'}), 400

@app.route('/getHotelInfo', methods=['GET'])
@jwt_required()
def getHotelInfo():
    try:
        # query by state
        # token = request.get_json()['token']
        # user = db.users.findOne({"token": token})
        # state = db.states.findOne({"user_id": user._id.str})
        # hotel = db.hotels.findOne({"name": state.hotel})

        # query by hotel name
        name = request.get_json(force=True)['hotel']
        hotel = db.hotels.find_one({"名称": name}, 
        {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '酒店设施': 1, '地铁': 1, '价格': 1})
        if hotel is None :
            return jsonify({'message':'Hotel name not exists.'}), 400

        # Todo: google search result
        query = name
        for j in search(query, tld="co.in", num=3, stop=3, pause=2):
            print(j)

        return jsonify({'message':'ok', "data": hotel}), 200
    except:
        return jsonify({'message':'Failed to get hotel info.'}), 400

@app.route('/getSiteInfo', methods=['GET'])
@jwt_required()
def getSiteInfo():
    try:
        # query by state
        # user = db.users.findOne({"token": token})
        # state = db.states.findOne({"user_id": user._id.str})
        # site = db.sites.findOne({"name": state.site})

        # query by site name
        name = request.get_json(force=True)['site']
        site = db.attractions.find_one({"名称": name}, 
        {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '地铁': 1, '游玩时间': 1, '门票': 1})
        if site is None :
            return jsonify({'message':'Site name not exists.'}), 400

        # Todo: google search result
        return jsonify({'message':'ok',  'data':site}), 200
    except:
        return jsonify({'message':'Failed to get site info.'}), 400

@app.route('/getRestInfo', methods=['GET'])
# @jwt_required()
def getRestInfo():
    try:
        # query by state
        # user = db.users.findOne({"token": token})
        # state = db.states.findOne({"user_id": user._id.str})
        # rest = db.rests.findOne({"name": state.rest}), 200

        # query by rest name
        name = request.get_json(force=True)['rest']
        rest = db.restaurants.find_one({"名称": name}, 
        {'_id': 0, '名称': 1, '评分': 1, '电话': 1, '地址': 1, '地铁': 1, '营业时间': 1, '人均消费': 1})
        if rest is None :
            return jsonify({'message':'Restaurant name not exists.'}), 400

        # Todo: google search result
        return jsonify({'message':'ok',  'data':rest}), 200
    except:
        return jsonify({'message':'Failed to get rest info.'}), 400


@app.route("/")
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run()
