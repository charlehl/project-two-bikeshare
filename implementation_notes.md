
# How to Pass Data between javascript and python flask
## HTML
	<form  action="" method="post">
	  <div>
	    <label for="start">Enter start date:</label>
	    <input type="date" id="start-date" name="start-date" min="2018-07-01" max="2018-08-31" value="2018-07-01">
	  </div>
	  <div>
	    <label for="end">Enter end date:</label>
	    <input type="date" id="end-date" name="end-date" min="2018-07-02" value="2018-07-31">
	  </div>
	  <div>
	    <input id="heat-form-submit" type="submit" value="Generate Heat Map" />
	  </div>
	</form> 

## Javascript
	$('#heat-form-submit').on('click', function(e){
	  e.preventDefault();
	  var start = $('input#start-date').val(),
	       end = $('input#end-date').val();

	  var formData = 'start-date=' + start + '&end-date=' + end;

	   $.ajax({
	     type: 'post',
	     url: '/api/getHeatData',
	     data: formData,
	     success: function(results) {
	       //console.log(results);
	       var stationCount = results.reduce(function (allNames, name){
		if(name.start_station in allNames) {
		  allNames[name.start_station]++;
		}
		else {
		  allNames[name.start_station]=1;
		}
		return allNames;
	       });
	       console.log(stationCount);
	       link = "https://bikeshare.metro.net/stations/json/";
	       var stationData = d3.json(link).then(async function(data) {
		var testData = {max: 8,
				data: []
			      };
		data.features.forEach((item)=> {
		  testData.data.push({lat: item.properties.latitude, lng: item.properties.longitude, count: stationCount[item.properties.kioskId]});
		});
		return testData;
		//console.log(results);
	       });
	       //console.log(stationData);

	       stationData.then(data => {
		console.log(data);
		});

## Flask portion
	@app.route("/api/getHeatData", methods=["GET", "POST"])
	def stations():
		if request.method == "POST":
			start_date = request.form["start-date"]
			end_date = request.form["end-date"]

			return(newplots(start_date, end_date))

		return render_template("index.html")

# Heroku App Deployment issues
- Populating and connecting to database
- Unable to pull json data from non-secure links
- Performance issues

## Populating and connecting to database
### How to dump and restore data to a mongodb
	mongodump -h localhost:27017 -d bike_data_db -o dump_dir
	mongorestore -h ds225294.mlab.com:25294 -d heroku_9cs4xj21 -u <user_name> -p <password> --authenticationDatabase heroku_9cs4xj21 dump_dir/*
## Unable to pull json data from non-secure links
Pre-pulled data and uploaded to mongoDB.  Used flask app to pull data instead.

## Performance issues
Too slow querying 90k+ data then aggregating and sending to javascript.  Instead pre-queried data possibilities and saved to mongoDB.

# Using mapbox API to route between two points
	function getRoute() {
	  //console.log(myLocationCoords);
	  if(myLocationCoords.length >= 1 && stationArray.length >= 1) {
	    var start = myLocationCoords;
	    var end = stationArray.pop();
	    var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&steps=true&access_token=' + API_KEY;
	    var directions = "<h3>Driving Directions:</h3>";
	  }
	  else if(stationArray.length >= 2) {
	    var end = stationArray.pop();
	    var start = stationArray.pop();
	    var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&steps=true&access_token=' + API_KEY;
	    var directions = "<h3>Cycling Directions:</h3>";
	  }
	  else {
	    return;
	  } 
	  //console.log(directionsRequest);
	  if(routeLayer){
	    myMap.removeLayer(routeLayer);
	    $("#navDirections").html("");
	  }
	  $.ajax({
	    method: 'GET',
	    url: directionsRequest,
	  }).done(function(data) {
	    var route = data.routes[0].geometry;
	    //console.log(data);

	    var myStyle = {
	      "color": "#ff7800",
	      "weight": 5,
	      "opacity": 0.65
	    };

	    routeLayer = L.geoJSON(route, {
		style: myStyle
	    }).addTo(myMap);
	    //console.log(data.routes[0].legs[0]);
	    var steps = data.routes[0].legs[0].steps;
	    directions += "Trip distance: " + (data.routes[0].legs[0].distance/1600).toFixed(2) + " miles<br>";
	    directions += "Trip duration: " + (data.routes[0].legs[0].duration/60).toFixed(2) + " minutes<hr>";
	    for(i=0; i < steps.length; i++){
	      //console.log(steps[i].maneuver.instruction + " "+ (steps[i].distance/1600).toFixed(2) + " miles");
	      directions += steps[i].maneuver.instruction + " "+ (steps[i].distance/1600).toFixed(2) + " miles<hr>";
	    }
	    $("#navDirections").html(directions);
	  });
	  // this is where the code from the next step will go
	  clearLocations();
	}

# Locating Yourself on Map
	// Function set to button on html to locate yourself
	function getLocation() {
	  myMap.locate({setView: true, maxZoom: 16});
	}

	// When location found logic to place marker
	function onLocationFound(e) {
	  var radius = e.accuracy / 2;

	  if(myLocation) {
	    myMap.removeLayer(myLocation);
	  }
	  if(routeLayer){
	    myMap.removeLayer(routeLayer);
	  }
	  myLocationCoords = [e.latlng.lng, e.latlng.lat];
	  startendLocation.push([e.latlng.lat.toFixed(2), e.latlng.lng.toFixed(2)]);
	  updateLocationBox();

	  myLocation = L.marker(e.latlng, {icon: myLocationIcon}).addTo(myMap)
	      .bindPopup("You are within " + radius + " meters from this point").openPopup();

	}
	// Monitor event for location found
	myMap.on('locationfound', onLocationFound);

# Bike Share Charts
### Addressing report display speed
#### Original version: Retrived MongoDB in Python Flask filtered, grouped and then sent requested information to JavaScript
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

#### Optimized version: Filtered and grouped the MongoDB and created a new collection with only necessary data points to be ploted. This new collection was then retrieved in Python Flask filtered with the request received then sent to JavaScript
	db = client.bike_data_db
	bike_trip = db.bike_rental.find()
	
	pass_type = request.args.get('pass_type')

	bike_trip = list(bike_trip)
	for item in bike_trip:
		if pass_type in item.keys():
			return(jsonify(item[pass_type]))
	
	return(jsonify(bike_trip[0][pass_type]))


# Data Structures
## Dashboard
https://bike-test.herokuapp.com/stacked/3005
https://bike-test.herokuapp.com/dashboard/3005
## Bike Chart
https://bike-test.herokuapp.com/pie_data
## Citi Bike App
https://bike-test.herokuapp.com/bike_boundary
