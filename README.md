# Project Two Group Five
## About
We will be analyzing data obtained from bikeshare for Los Angeles area.  We will be looking at the live json status
from bike stations as well as the customer data for Q3-2018.

## Websites
https://bikeshare.metro.net/stations/json/

https://bikeshare.metro.net/about/data/

## Navigation
var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + API_KEY;

https://leafletjs.com/plugins.html

## Project Description:
#Tell a story about bike rental usage
- Who is renting bikes
- Where are they going
- When are they going (weekend/weekday) (day/evening)
- What is duration/distance they are traveling
- One Way/Round trip
- Walk up vs Planned duration passholders

# How will we explore Data?
- Graphing stations
- Bike rides by time/day
- Bike rental duration vs preceived navigation calculation
- click two stations...get a route between the two (mapbox api)

# Specific Requirements
1. Mongo DB, Python Flask, HTML/CSS, JavaScript with Heroku deployment.
2. A custom "creative" D3.js project, dashboard page.
3. JS library (JQuery and AJAX)
4. 90,000+ data points.
5. user-driven interaction
6. Three Views(Dashboard, Bike Nav and Bike Customer Chart)
