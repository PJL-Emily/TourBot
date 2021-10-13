import os
from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))

class Config:
	USE_RELOADER = True
	MONGO_URI = os.environ.get('MONGO_URI')
			 
	@classmethod
	def init_app(cls, app):
		for key in dir(cls):
			if key.isupper():
				app.config[key] = getattr(cls, key)