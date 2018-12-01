import os

import pymongo
import pandas as pd 
from pymongo import MongoClient
import pprint
from datetime import datetime
import time
import calendar
<<<<<<< HEAD
import json
from flask import Flask,jsonify, render_template
=======
from flask import Flask,jsonify, render_template, request
>>>>>>> e33e0cb85662043062fac5524788f127ca81726d

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

@app.route("/filter_data")
def filter_data():
	db = client.bike_data_db

	bike_trip = db.bike_trip.find()

	full_dict = []
	for trip in bike_trip:
	    full_dict.append(trip)
	df = pd.DataFrame(full_dict)

	# use k to filter dataframe based on passholder type
	# group by day of week and pass info back into d3
	
	pass_type = request.args.get('pass_type')
	print(pass_type)

	selection = df.loc[df['passholder_type'] == pass_type, :]    
	grouped_df = selection[['weekday','duration']].groupby('weekday').sum()
	index_reset = grouped_df.reset_index()
	index_reset['weekday'] = pd.Categorical(index_reset['weekday'], categories=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'], ordered=True)
	weekday_df = index_reset.sort_values('weekday')


	return weekday_df.to_json(orient='records')

@app.route("/plots")
def plots():

	db = client.bike_data_db

	bike_trip = db.bike_trip.find()

	full_dict = []
	for trip in bike_trip:
	    full_dict.append(trip)
	df = pd.DataFrame(full_dict)

	one_way_df = df.loc[df["trip_route_category"] == "One Way", :]
	data_for_plots = one_way_df[["trip_id","duration", "start_day","weekday","start_station","end_station", "passholder_type"]]
	data_for_plots["passholder_type"] = data_for_plots["passholder_type"].replace({'Walk-up': 'One Day Pass'})

	# dates = data_for_plots["start_time"]
	# weekday_list = []

	# for date in dates:
	#     datetime_object = datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
	#     #print(datetime_object)
	    
	#     weekday = calendar.day_name[datetime_object.weekday()] 
	#     weekday_list.append(weekday)
	# data_for_plots["weekday"] = weekday_list  

	data_dict = data_for_plots.to_dict('records')

	return jsonify(data_dict)
if __name__ == "__main__":
    app.run(debug=True)
