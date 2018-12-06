import os

import pymongo
import pandas as pd 
from pymongo import MongoClient
# from flask_pymongo import PyMongo
# import pprint
from datetime import datetime
import time
import calendar
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from flask_cors import CORS, cross_origin
import json
import requests

app = Flask(__name__)

# uri="mongodb://localhost:27017/bike_data_db"
# mongo = PyMongo(app, uri)
conn = os.environ.get('MONGODB_URI', '') or 'mongodb://localhost:27017/bike_data_db'
#conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

url = "https://bikeshare.metro.net/stations/json/"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}

start_date = "2018-07-01"
end_date = "2018-07-02"
#start_time = "12:00:00"
#end_time = "23:59:59"
#bike_data_db = heroku_9cs4xj21
@app.route("/")
def index():
	return render_template("index.html")

@app.route("/citibike.html")
def station_app():
	return render_template("citibike.html")

@app.route("/dashboard.html")
def dashboard():
	return render_template("dashboard.html")

@app.route("/bikecharts.html")
def bikecharts():
	return render_template("bikecharts.html")

@app.route("/dashboard/<station_name>")
def station_dashboard(station_name):
	#print(station_name)
	db = client.bike_data_db
	collection = db.bike_trip.find({"start_station": int(station_name)})
	#collection = list(collection)
	trips = []
	for trip in collection:
	 	trips.append(trip)
	#print(len(trips))
	df_filtered = pd.DataFrame(trips)
	#print(df_filtered.head())

	df_filtered["time_slices"] = [datetime.strptime(time_sl, "%H:%M:%S").strftime("%H") for time_sl in df_filtered["start_time"]]
	df_grouped = df_filtered.groupby("time_slices")["duration"].sum()
	df_grouped = df_grouped.reset_index()
	df_grouped = df_grouped.sort_values("time_slices")	
	return df_grouped.to_json(orient='records')

@app.route("/dashboard/<station_name>/<week_day>", methods=['GET', 'POST'])
def day_dashboard(station_name, week_day):
	#print(station_name)
	##day_filt = request.args.get("day")
	db = client.bike_data_db
	##changed by Haidy##
	collection = db.bike_trip.find({"$and":[{"start_station": int(station_name)},{"weekday": str(week_day)}]} )
	#collection = list(collection)
	##end change##
	trips = []
	for trip in collection:
	 	trips.append(trip)
	#print(len(trips))
	df_filtered = pd.DataFrame(trips)
	#print(df_filtered.head())

	df_filtered["time_slices"] = [datetime.strptime(time_sl, "%H:%M:%S").strftime("%H") for time_sl in df_filtered["start_time"]]
	df_grouped = df_filtered.groupby("time_slices")["duration"].sum()
	df_grouped = df_grouped.reset_index()
	df_grouped = df_grouped.sort_values("time_slices")	
	return df_grouped.to_json(orient='records')

@app.route("/heatplots")
def plots():
	#print(start_date)
	#print(end_date)

	db = client.bike_data_db

	bike_trip = db.bike_trip.find({"start_day": {'$gte': start_date, '$lt': end_date}})

	full_dict = []
	for trip in bike_trip:
	    full_dict.append(trip)
	df = pd.DataFrame(full_dict)
	#one_way_df = df.loc[df["trip_route_category"] == "One Way", :]
	data_for_plots = df[["trip_id","duration", "plan_duration", "passholder_type","start_time","start_day", "end_time", "end_day", "start_lat", "start_lon", "end_lat", "end_lon"]]
	#data_for_plots["passholder_type"] = data_for_plots["passholder_type"].replace({'Walk-up': 'One Day Pass'})

	data_dict = data_for_plots.to_dict('records')

	return jsonify(data_dict)
#########################################

#########################################

@app.route("/api/getHeatData", methods=["GET", "POST"])
def stations():
	if request.method == "POST":
		start_date = request.form["start-date"]
		end_date = request.form["end-date"]

		return(newplots(start_date, end_date))
		
	return render_template("index.html")

def newplots(sd, ed):
	start_date = sd
	end_date = ed
	#print(start_date)
	#print(end_date)

	db = client.bike_data_db

	bike_trip = db.bike_trip.find({"start_day": {'$gte': start_date, '$lt': end_date}})
	bike_list = list(bike_trip)
	
	for bike in bike_list:
		bike.pop('_id', None)

	return(jsonify(bike_list))

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


@app.route("/bar_data_old")
def bar_data_old():
	db = client.bike_data_db

	bike_trip = db.bike_trip.find()

	full_dict = []
	for trip in bike_trip:
	    full_dict.append(trip)
	df = pd.DataFrame(full_dict)

	# use pass type to filter dataframe based on passholder type
	# group by day of week and pass info back into d3
	
	pass_type = request.args.get('pass_type')

	selection = df.loc[df['passholder_type'] == pass_type, :]    
	grouped_df = selection[['weekday','duration']].groupby('weekday').sum()
	index_reset = grouped_df.reset_index()
	index_reset['weekday'] = pd.Categorical(index_reset['weekday'], categories=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'], ordered=True)
	weekday_df = index_reset.sort_values('weekday')


	return weekday_df.to_json(orient='records')

@app.route("/bar_data")
def bar_data():
	db = client.bike_data_db
	bike_trip = db.bike_rental.find()
	
	pass_type = request.args.get('pass_type')

	bike_trip = list(bike_trip)
	for item in bike_trip:
		if pass_type in item.keys():
			return(jsonify(item[pass_type]))
	
	return(jsonify(bike_trip[0][pass_type]))

@app.route("/pie_data_old")
def pie_data_old():

	db = client.bike_data_db

	bike_trip = db.bike_trip.find()

	full_dict = []
	for trip in bike_trip:
	    full_dict.append(trip)
	df = pd.DataFrame(full_dict)
	grouped_df = df[['passholder_type','trip_id']].groupby('passholder_type').count()
	pie_df = grouped_df.reset_index()
	


	return pie_df.to_json(orient='records')

@app.route("/pie_data")
def pie_data():

	db = client.bike_data_db
	bike_trip = db.bike_rental.find()

	pass_type = request.args.get('pass_type')

	bike_trip = list(bike_trip)
	for item in bike_trip:
		item.pop('_id', None)
		# if pass_type in item.keys():
		# 	print("Thank You Next")
		# else:
		# 	return(jsonify(item))
	
	return(jsonify(bike_trip[1]))

@app.route("/bike_boundary")
def bike_boundary():
	db = client.bike_data_db
	la_boundary = db.la_boundary.find()
	la_boundary = list(la_boundary)
	
	for i in la_boundary:
		i.pop('_id', None)

	return(jsonify(la_boundary))

@app.route("/stacked/<station_id>", methods=['GET', 'POST'])
def dashboard_stacked(station_id):
	station_id = int(station_id)
	db = client.bike_data_db
	rental_start = db.bike_trip.find({'start_station': station_id})
	rental_start = list(rental_start)
	rental_df = pd.DataFrame(rental_start)
	rental_df = rental_df[['passholder_type','weekday','start_station']].groupby(['passholder_type','weekday']).count()
	rental_df = rental_df.reset_index()
	rental_item = dict()
	for index, row in rental_df.iterrows():
		key = row['passholder_type']
		day = row['weekday']
		start_station = row['start_station']
		if (key in rental_item):
			rental_item[key].append({'weekday': day, 'start_station': start_station})
		else:
			rental_item[key] = [{'weekday': day, 'start_station': start_station}]
	rental_list = [rental_item]
	
	rental_start = db.bike_trip.find({'end_station': station_id})
	rental_start = list(rental_start)
	rental_df = pd.DataFrame(rental_start)
	rental_df = rental_df[['passholder_type','weekday','end_station']].groupby(['passholder_type','weekday']).count()
	rental_df = rental_df.reset_index()
	rental_item = dict()
	for index, row in rental_df.iterrows():
		key = row['passholder_type']
		day = row['weekday']
		end_station = row['end_station']
		if (key in rental_item):
			rental_item[key].append({'weekday': day, 'end_station': end_station})
		else:
			rental_item[key] = [{'weekday': day, 'end_station': end_station}]
	rental_list.append(rental_item)
	return(jsonify(rental_list))

if __name__ == "__main__":
    app.run(debug=True)
