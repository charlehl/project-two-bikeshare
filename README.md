https://bikeshare.metro.net/stations/json/

https://bikeshare.metro.net/about/data/

#Navigation
var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + API_KEY;

https://leafletjs.com/plugins.html
https://gitlab.com/IvanSanchez/Leaflet.Marker.SlideTo
https://github.com/IvanSanchez/Leaflet.Polyline.SnakeAnim

##Project Description:
#Tell a story about bike rental usage
    - Who is renting bikes
    - Where are they going
    - When are they going (weekend/weekday) (day/evening)
    - What is distance they are traveling
    - One Way/Round trip
    - Walk up vs Planned duration passholders

#How will we explore Data?
    - Graphing stations
    - Bike rides by time/day
    - Heatmap of stations where bikes are rented and bikes returned
    - Bike rental duration vs preceived navigation calculation
    - click two stations...get a route between the two (mapbox api)

## Specific Requirements
    1. Mongo DB, Python Flask, HTML/CSS, JavaScript
    2. A custom "creative" D3.js project
    3. JS library (JQuery or React)
    4. 10's of thousands of records
    5. user-driven interaction
    6. three views