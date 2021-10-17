from flask import Flask
from flask_pymongo import PyMongo
from config import Config
import os

app = Flask(__name__)
app.config.from_object(Config)
Config.init_app(app)
mongo = PyMongo(app)
db = mongo.db
app.run()