from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo

app = Flask(__name__)

app.config["MONGO_URI"] = "http://mongodb/27017/bike_share"
mongo = PyMongo(app)

@app.route('/')
def index():
	bike_rides = mongo.db.rides.find_all()
	return render_template('index.html', bike_rides= bike_rides)


@app.route('/visualizations')
def summary():
	return render_template('')


if __name__ == "__main__" :
	app.run(debug=True)

