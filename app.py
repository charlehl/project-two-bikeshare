from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo

app = Flask(__name__)

app.config["MONGO_URI"] = "http://mongodb/27017/bike_share"
mongo = PyMongo(app)

@app.route('/')
def index():
	bike_rides = mongo.db.bike_trip.find_all()
	return render_template('index.html', bike_rides= bike_rides)




if __name__ == "__main__" :
	app.run(debug=True)

