import os

import pymongo
import pandas as pd 
from pymongo import MongoClient
import pprint
from datetime import datetime
import time
import calendar
import json
from flask import Flask,jsonify, render_template

app = Flask(__name__)

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
url = "https://bikeshare.metro.net/stations/json/"

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/stations")
def stations():
    """Return a list of stations."""
    """data = json.loads(url)"""
    return jsonify(list(df.columns)[2:])

@app.route("/plots")
def plots():

	db = client.bike_data_db

	bike_trip = db.bike_trip.find()

	full_dict = []
	for trip in bike_trip:
	    full_dict.append(trip)
	df = pd.DataFrame(full_dict)

	one_way_df = df.loc[df["trip_route_category"] == "One Way", :]
	data_for_plots = one_way_df[["trip_id","duration", "plan_duration", "passholder_type","start_time"]]
	data_for_plots["passholder_type"] = data_for_plots["passholder_type"].replace({'Walk-up': 'One Day Pass'})

	dates = data_for_plots["start_time"]
	for date in dates:
	    datetime_object = datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
	    
	    weekday = calendar.day_name[datetime_object.weekday()] 
	data_for_plots["weekday"] = weekday

	data_dict = data_for_plots.to_dict('records')

	return jsonify(data_dict)
if __name__ == "__main__":
    app.run(debug=True)
