import pymongo
import json
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')

client = pymongo.MongoClient(MONGO_URI)
db = client.TourBot

with open('hotel_db.json', 'r', encoding="utf-8") as f:
    data = json.load(f)
    for i in range(len(data)):
        result = db.hotels.insert_one(data[i][1])

with open('attraction_db.json', 'r', encoding="utf-8") as f:
    data = json.load(f)
    for i in range(len(data)):
        result = db.attractions.insert_one(data[i][1])

with open('metro_db.json', 'r', encoding="utf-8") as f:
    data = json.load(f)
    for i in range(len(data)):
        result = db.metros.insert_one(data[i][1])

with open('restaurant_db.json', 'r', encoding="utf-8") as f:
    data = json.load(f)
    for i in range(len(data)):
        result = db.restaurants.insert_one(data[i][1])

with open('taxi_db.json', 'r', encoding="utf-8") as f:
    data = json.load(f)
    for i in range(len(data)):
        result = db.taxies.insert_one(data[i][1])

client.close()