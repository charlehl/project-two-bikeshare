import os

import pymongo
import pandas as pd 
from pymongo import MongoClient

from datetime import datetime
import time
import calendar
from flask import Flask,jsonify, render_template, request
import json
import pandas as pd
import requests
import urllib


url = "http://bikeshare.metro.net/stations/json/"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
response = requests.get(url,headers = headers)

app = Flask(__name__)

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
url = "https://bikeshare.metro.net/stations/json/"

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/stations_names")
def stations_names():
	data = (json.loads(response.text))["features"]
	data_list = []
	for row in data:
		data_list.append({"Kiosk Id": row["properties"]["kioskId"],
		"Name" : row["properties"]["name"],
		"Status" : row["properties"]["kioskPublicStatus"],
		"Bikes Available" : row["properties"]["bikesAvailable"],
		"Docks Available" : row["properties"]["docksAvailable"],
		"Total Docks" : row["properties"]["totalDocks"],
		"Close Time" : row["properties"]["closeTime"],
		"Open Time" : row["properties"]["openTime"],
		"Street Name" : row["properties"]["addressStreet"]
		})
	df = pd.DataFrame(data_list)
	stations_names = df['Name']
	return stations_names.to_json(orient='records')

@app.route("/stations_status/<name>")
def station_status(name):
	data = (json.loads(response.text))["features"]
	data_list = []
	for row in data:
		data_list.append({"Kiosk Id": row["properties"]["kioskId"],
		"Name" : row["properties"]["name"],
		"Status" : row["properties"]["kioskPublicStatus"],
		"Bikes Available" : row["properties"]["bikesAvailable"],
		"Docks Available" : row["properties"]["docksAvailable"],
		"Total Docks" : row["properties"]["totalDocks"],
		"Close Time" : row["properties"]["closeTime"],
		"Open Time" : row["properties"]["openTime"],
		"Street Name" : row["properties"]["addressStreet"]
		})
	df = pd.DataFrame(data_list)

	selection = df.loc[df["Name"] == name, :]

	return selection.to_json(orient='records')

@app.route("/line_chart/<name>")
def line_chart(name,weekday):
	db = client.bike_data_db

	bike_trip = db.bike_trip.find()

	full_dict = []
	for trip in bike_trip:
		full_dict.append(trip)
	df = pd.DataFrame(full_dict)

	split = df["start_time"].str.split(":", n=1, expand=True)
	df["hour"] = split[0]
	df["minutes"] = split[1]

	peak_hour = df[["start_station","hour","weekday","trip_id"]]
	renamed = peak_hour.rename(columns={"start_station":"Station_ID"})
	# load csv file to merge and get stations names
	file = "static/data/metro-bike-share-stations-2018-10-19.csv"
	stations = pd.read_csv(file)
	# merge dataframe and clean data 
	merged_df = pd.merge(renamed, stations, on="Station_ID", how="outer")
	merged_df = merged_df.dropna(how="any")
	# grab only pertinent columns
	live_stations = merged_df[["Station_ID","Station_Name","hour","weekday","trip_id"]]
	# filter first by station
	filter_one = live_stations.loc[live_stations["Station_Name"] == name, :]
	# filter by weekday
	weekday= request.args.get('weekday')
	filter_two = filter_one.loc[filter_one["weekday"] == weekday, :]
	grouped = filter_two.groupby(["hour"]).count()
	reset_index = grouped.reset_index()
	return reset_index.to_json(orient='records')


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
