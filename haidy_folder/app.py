import pandas as pd 
import pymongo 
import json
import requests

from datetime import datetime
from flask import Flask,jsonify, render_template, request

app = Flask(__name__)

conn='mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
url = "https://bikeshare.metro.net/stations/json/"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}

'''
@app.route("/stations")
def stations():
	db = client.bike_data_db
	collection = db.bike_trip.find()
	trips=[]
	for trip in collection:
		trips.append(trip)
	df = pd.DataFrame(trips)
	return jsonify(list(df)[13:14])
'''
@app.route("/")
def dashboard_data():
	return render_template("dashboard.html")

@app.route("/dashboard?station_name=<station_name>")
def dashboard(station_name):
	db = client.bike_data_db
	collection = db.bike_trip.find()
	trips = []
	for trip in collection:
		trips.append(trip)
	df_users = pd.DataFrame(trips)

	response = requests.get(url, headers= headers)
	data = (json.loads(response.text))["features"]
	data_list = []
	for row in data:
		data_list.append(
    		{"start_station": row["properties"]["kioskId"],
    		"Station_name": row["properties"]["name"],
    		"Latitude" : row["properties"]["latitude"],
    		"Longitude": row["properties"]["longitude"],
    		"KioskPublicStatus" : row["properties"]["kioskPublicStatus"],
    		"KioskStatus" : row["properties"]["kioskStatus"],
    		"BikesAvailable" : row["properties"]["bikesAvailable"],
    		"DocksAvailable" : row["properties"]["docksAvailable"],
    		"TotalDocks" : row["properties"]["totalDocks"],
    		"CloseTime" : row["properties"]["closeTime"],
    		"OpenTime" : row["properties"]["openTime"],
    		"TimeZone" : row["properties"]["timeZone"],
    		"Address" : row["properties"]["addressStreet"],
    		"City" : row["properties"]["addressCity"],
    		"State" : row["properties"]["addressState"],
    		"ZipCode" : row["properties"]["addressZipCode"]
    		})
	df_stations = pd.DataFrame(data_list)

	df_merged = df_users.merge(df_stations, on="start_station", how="inner")
    ## Get the station name from the javascript through a flask request 
	station_name = request.args.get('station_name') 
	
	df_filtered = df_merged.loc[df_merged["station_name"]== station_name, :]

	df_filtered["time_slices"] = [datetime.strptime(time_sl, "%H:%M:%S").strftime("%H") for time_sl in df_filtered["start_time"]]
	df_grouped = df_filtered.groupby("time_slices")["duration"].sum()
	df_grouped = df_grouped.reset_index()
	df_grouped = df_grouped.sort_values("time_slices")

	return df_grouped.to_json(orient='records')


if (__name__ == "__main__"):
	app.run(debug=True)

