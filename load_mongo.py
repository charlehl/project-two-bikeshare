import pandas as pd
import pymongo
import requests
import json
from datetime import datetime
import calendar

def load_mongo_db():
    print("Load csv data into mongo db...")
    bike_data_csv = "data/metro-bike-share-trips-2018-q3.csv"
    bike_data_df = pd.read_csv(bike_data_csv)
    # Calculate the day of week
    bike_data_df['weekday'] = bike_data_df.apply(lambda row: calendar.day_name[
                                datetime.strptime(row.start_time, '%Y-%m-%d %H:%M:%S').weekday()
                                ] , axis=1)
    # Convert to datetime format
    bike_data_df['start_day'] = bike_data_df.apply(lambda row: datetime.strptime(row.start_time, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d') , axis=1)
    bike_data_df['end_day'] = bike_data_df.apply(lambda row: datetime.strptime(row.end_time, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d') , axis=1)
    bike_data_df['start_time'] = bike_data_df.apply(lambda row: datetime.strptime(row.start_time, '%Y-%m-%d %H:%M:%S').strftime('%H:%M:%S') , axis=1)
    bike_data_df['end_time'] = bike_data_df.apply(lambda row: datetime.strptime(row.end_time, '%Y-%m-%d %H:%M:%S').strftime('%H:%M:%S') , axis=1)
    #bike_data_df['start_time'] = pd.to_datetime(bike_data_df['start_time'], format='%Y-%m-%d %H:%M:%S')
    #bike_data_df['end_time'] = pd.to_datetime(bike_data_df['end_time'], format='%Y-%m-%d %H:%M:%S')   
    # Drop rows with empty values
    bike_data_df = bike_data_df.dropna()
    # Export to json string
    #items = bike_data_df.to_json(orient='records', date_format='iso', date_unit='s')
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