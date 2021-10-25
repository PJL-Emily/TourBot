from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask.json import JSONEncoder
from bson import json_util
from config import Config
import os
from dotenv import load_dotenv
from pymongo.errors import BulkWriteError


class MongoJSONEncoder(JSONEncoder):
    def default(self, obj): 
        return json_util.default(obj)

app = Flask(__name__)
app.config.from_object(Config)
app.json_encoder = MongoJSONEncoder
Config.init_app(app)
mongo = PyMongo(app)
db = mongo.TourBot
app.run()

@app.route('/protected', methods=['GET', 'POST'])
@jwt_required()
def protected(): 
    identity = get_jwt_identity()
    return jsonify(msg='ok'), 200

@app.route('/submitUserInfo', methods=['POST'])
def submitUserInfo():
    try:
        userInfo = request.get_json()
        user_dict = {
            'purpose':userInfo['purpose']
            # 'gender':userInfo['gender'],
            # 'age':userInfo['age']
        }
        new_user = db.users.insert_one(user_dict).inserted_id

        # create jwt token
        accesstoken = create_access_token(identity=new_user)
        return jsonify({'message':'ok', 'data':{'accesstoken': accesstoken}}), 200
        # return jsonify({'message':'ok', "user": new_user}), 200
    except BulkWriteError as e:
        return jsonify({'message':'Failed to submit user info.'}), 400

@app.route('/getUserState', methods=['GET'])
@jwt_required()
def getUserState():
    try:
        token = request.get_json()['token']
        user = db.users.find({"token": token})
        state = db.states.find({"user_id": user._id.str})
        return jsonify({'message':'ok', 'data':state}), 200
    except BulkWriteError as e:
        return jsonify({'message':'Failed to get user state.'}), 400

@app.route('/getHotelInfo', methods=['GET'])
@jwt_required()
def getHotelInfo():
    try:
        # token = request.get_json()['token']
        # user = db.users.findOne({"token": token})
        # state = db.states.findOne({"user_id": user._id.str})
        # hotel = db.hotels.findOne({"name": state.hotel})

        #test
        hotel = request.get_json(force=True)['hotel']
        hotel = db.hotel.find_one({"name": hotel}, {'_id': False})
        return jsonify({'message':'ok', "hotel": hotel}), 200
    except BulkWriteError as e:
        return jsonify({'message':'Failed to get hotel info.'}), 400

@app.route('/getSiteInfo', methods=['GET'])
@jwt_required()
def getSiteInfo():
    try:
        user = db.users.findOne({"token": token})
        state = db.states.findOne({"user_id": user._id.str})
        site = db.sites.findOne({"name": state.site})
        return jsonify({'message':'ok',  'data':site}), 200
    except BulkWriteError as e:
        return jsonify({'message':'Failed to get site info.'}), 400

@app.route('/getRestInfo', methods=['GET'])
@jwt_required()
def getRestInfo():
    try:
        user = db.users.findOne({"token": token})
        state = db.states.findOne({"user_id": user._id.str})
        rest = db.rests.findOne({"name": state.rest}), 200
        return jsonify({'message':'ok',  'data':rest})
    except BulkWriteError as e:
        return jsonify({'message':'Failed to get rest info.'}), 400


@app.route('/sendUserUtter' , methods=['POST'])
def sendMsg2Pipeline():
    user_id = request.get_json(force=True)['user_id']
    result = db.users.find_one({ "_id": user_id })
    if (not result):
        return jsonify({'message':'User not found.'}), 400
    # send message to pipeline
    # get returned utter
    sys_utter = "reply from pipeline. "
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
    app.run(host='0.0.0.0', port=80)
