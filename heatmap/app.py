import os

import pymongo
import pandas as pd 
from pymongo import MongoClient
# from flask_pymongo import PyMongo
import pprint
from datetime import datetime
import time
import calendar
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

app = Flask(__name__)

# uri="mongodb://localhost:27017/bike_data_db"
# mongo = PyMongo(app, uri)
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)


start_date = "2018-07-01"
end_date = "2018-07-02"
start_time = "12:00:00"
end_time = "23:59:59"

@app.route("/")
def index():
	db = client.bike_data_db
	"""Return the homepage."""
	rentals = db.bike_trip.find({"start_day": {'$gte': start_date, '$lt': end_date}})
	return render_template("index.html", myrentals=rentals)


@app.route("/heatplots")
def plots():
	print(start_date)
	print(end_date)
	# db = client.bike_data_db
	# rentals = db.bike_trip.find({"start_day": {'$gte': start_date, '$lt': end_date}})

	# full_dict = []
	# for trip in rentals:
	# 	full_dict.append(trip)
	# df = pd.DataFrame(full_dict)
	# data_dict = df.to_dict('records')
	# print(full_dict.length())

	db = client.bike_data_db

	# bike_trip = db.bike_trip.find({"start_day": {'$gte': start_date, '$lt': end_date}, 
	# 							   "start_time": {'$gte': start_time, '$lt': end_time}
	# 							  })

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
def newplots(sd, ed):
	start_date = sd
	end_date = ed
	print(start_date)
	print(end_date)
	# db = client.bike_data_db
	# rentals = db.bike_trip.find({"start_day": {'$gte': start_date, '$lt': end_date}})

	# full_dict = []
	# for trip in rentals:
	# 	full_dict.append(trip)
	# df = pd.DataFrame(full_dict)
	# data_dict = df.to_dict('records')
	# print(full_dict.length())

	db = client.bike_data_db

	# bike_trip = db.bike_trip.find({"start_day": {'$gte': start_date, '$lt': end_date}, 
	# 							   "start_time": {'$gte': start_time, '$lt': end_time}
	# 							  })

	bike_trip = db.bike_trip.find({"start_day": {'$gte': start_date, '$lt': end_date}})
	bike_list = list(bike_trip)
	print(len(bike_list))
	
	for bike in bike_list:
		bike.pop('_id', None)
	# full_dict = []
	# for trip in bike_trip:
	#     full_dict.append(trip)
	# df = pd.DataFrame(full_dict)
	# data_for_plots = df[["trip_id","duration", "plan_duration", "passholder_type","start_time","start_day", "end_time", "end_day", "start_lat", "start_lon", "end_lat", "end_lon"]]
	
	# data_dict = data_for_plots.to_dict('records')

	return(jsonify(bike_list))
	#return jsonify(data_dict)
#########################################

@app.route("/api/getHeatData", methods=["GET", "POST"])
def stations():
	if request.method == "POST":
		print("Hello")
		start_date = request.form["start-date"]
		end_date = request.form["end-date"]
		#print(request.form["start-date"])
		#print(request.form["end-date"])
		#request.form["start-date"]
        # name = request.form["petName"]
        # lat = request.form["petLat"]
        # lon = request.form["petLon"]

        # pet = Pet(name=name, lat=lat, lon=lon)
        # db.session.add(pet)
        # db.session.commit()
		#return redirect("/", code=302)
		return(newplots(start_date, end_date))
		
	return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
