from flask import Flask
from flask_pymongo import PyMongo
from config import Config
import os
from dotenv import load_dotenv

app = Flask(__name__)
app.config.from_object(Config)
Config.init_app(app)
mongo = PyMongo(app)
db = mongo.TourBot

def tokenValid(token):
    # check validation by JWT
    return True

#post /senUserUtter/<token> data: {token :}/<msg> data: {msg :}
@app.route('/store/<string:token>/<string: msg>' , methods=['POST'])
def sendMsg2Pipeline(token, msg):
    return 

#post /restartSession/<token> data: {token :}
@app.route('/restartSession/<string:token>' , methods=['POST'])
def restartSession(token):
    # validate token
    isValid = tokenValid(token)
    if (not isValid):
        return "token expired."
    # update user state
    result = db.users.update_one({ "token": token }, { "$set": { "state": {} } })
    if (result == 1):
        return "ok"
    else:
        return "update failed."

#post /exit/<token> data: {token :}
@app.route('/exit/<string:token>' , methods=['POST'])
def exit(token):
    # validate token
    isValid = tokenValid(token)
    if (not isValid):
        return "token expired."
    # update user state
    result = db.users.update_one({ "token": token }, { "$set": { "state": {} } })
    if (result == 1):
        return "ok"
    else:
        return "failed to exit."

app.run()