import pandas as pd
import pymongo
import requests
import json


def load_mongo_db():
    print("Load csv data into mongo db...")
    bike_data_csv = "data/metro-bike-share-trips-2018-q3.csv"
    bike_data_df = pd.read_csv(bike_data_csv)
    # Drop rows with empty values
    bike_data_df = bike_data_df.dropna()
    # Export to json string
    items = bike_data_df.to_json(orient='records')
    # Initialize PyMongo to work with MongoDBs
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)
    db = client.bike_data_db
    collection = db.bike_trip
    # Drop everything before insertion    
    collection.drop()
    # load json string
    items_db = json.loads(items)
    print("Inserting records into db...")
    db.bike_trip.insert_many(items_db)
    item_count = collection.count_documents({})
    print(f"{item_count} records inserted into db!")
    # Close mongo db client
    client.close()

load_mongo_db()