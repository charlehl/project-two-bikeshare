import os

import pymongo
import pandas as pd 
from pymongo import MongoClient
import pprint
from datetime import datetime
import time
import calendar
from flask import Flask,jsonify, render_template, request

app = Flask(__name__)

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/stations")
def stations():
    """Return a list of stations."""

    return jsonify(list(df.columns)[2:])

@app.route("/bar_data")
def bar_data():
	db = client.bike_data_db

	bike_trip = db.bike_trip.find()

	full_dict = []
	for trip in bike_trip:
	    full_dict.append(trip)
	df = pd.DataFrame(full_dict)

	# use k to filter dataframe based on passholder type
	# group by day of week and pass info back into d3
	
	pass_type = request.args.get('pass_type')

	selection = df.loc[df['passholder_type'] == pass_type, :]    
	grouped_df = selection[['weekday','duration']].groupby('weekday').sum()
	index_reset = grouped_df.reset_index()
	index_reset['weekday'] = pd.Categorical(index_reset['weekday'], categories=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'], ordered=True)
	weekday_df = index_reset.sort_values('weekday')


	return weekday_df.to_json(orient='records')

@app.route("/pie_data")
def pie_data():

	db = client.bike_data_db

	bike_trip = db.bike_trip.find()

	full_dict = []
	for trip in bike_trip:
	    full_dict.append(trip)
	df = pd.DataFrame(full_dict)
	grouped_df = df[['passholder_type','trip_id']].groupby('passholder_type').count()
	pie_df = grouped_df.reset_index()
	


	return pie_df.to_json(orient='records')
if __name__ == "__main__":
    app.run(debug=True)
