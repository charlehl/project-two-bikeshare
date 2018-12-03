var startCoords = [34.05223, -118.24368];
var mapZoomLevel = 12;
var routeLayer;
var stationArray= [];
var myLocation;
var myLocationCoords = [];
var startendLocation = [];

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});
    
var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
  Light: light,
  Dark: dark,
  Street: streets
};

// Create the map object with options
var myMap = L.map("map-id", {
  center: startCoords,
  zoom: mapZoomLevel,
  // layers: [light, bikeStations]
  layers: [light]
});

var stationIcon = L.icon({
  iconUrl: 'https://www.colourbox.com/preview/21987592-bike-icon-black.jpg',
  
  iconSize:     [32, 32], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var myLocationIcon = L.icon({
  iconUrl: 'http://icons.iconarchive.com/icons/icons8/windows-8/64/Maps-Center-Direction-icon.png',
  
  iconSize:     [32, 32], // size of the icon
  iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

function updateLocationBox(){
  if(startendLocation.length == 1) {
    // set start
    $("#start-location").val(startendLocation[0]);
    $("#end-location").val("");
  }
  else if(startendLocation.length == 2){
    // set start/stop
    $("#start-location").val(startendLocation[1]);
    $("#end-location").val(startendLocation[0]);
  }
  else{
    // adjust array and set start/stop
    startendLocation.shift();
    $("#start-location").val(startendLocation[1]);
    $("#end-location").val(startendLocation[0]);
  }
}
function clearLocations(value) {
  stationArray = [];
  myLocationCoords = [];
  startendLocation = [];
  $("#start-location").val("");
  $("#end-location").val("");
  if(value) {
    if(myLocation) {
      myMap.removeLayer(myLocation);
    }
    if(routeLayer){
      myMap.removeLayer(routeLayer);
      //$("#navDirections").html("");
    }
  }
}
myMap.on('click', function(e) {
  //console.log(e);
  if(myLocation) {
    myMap.removeLayer(myLocation);
  }
  if(routeLayer){
    myMap.removeLayer(routeLayer);
    //$("#navDirections").html("");
  }
  myLocationCoords = [e.latlng.lng, e.latlng.lat];
  startendLocation.push([e.latlng.lat.toFixed(2), e.latlng.lng.toFixed(2)]);
  updateLocationBox();
  myLocation = L.marker(e.latlng, {icon: myLocationIcon}).addTo(myMap)
  //console.log(myLocation);
});

// Create the createMap function
// var bikeMarkers = [];
link = "https://bikeshare.metro.net/stations/json/";
d3.json(link, function(data) {
  //console.log(myMap.getBounds().getSouthWest());
  //console.log(myMap.getBounds().getNorthEast());
  // Creating a geoJSON layer with the retrieved data
  var bikeStations = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {icon: stationIcon});
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      //console.log(feature);
      layer.on({
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          //console.log(this.feature.geometry.coordinates);
          stationArray.push(this.feature.geometry.coordinates);
          startendLocation.push([this.feature.geometry.coordinates[1].toFixed(2), this.feature.geometry.coordinates[0].toFixed(2)]);
          updateLocationBox();
        }
      });
       // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h3>" + feature.properties.name + "<br>" +
                               feature.properties.addressStreet + "<br>" + 
                               feature.properties.addressCity + ", " + feature.properties.addressState + " " +feature.properties.addressZipCode +
                      "</h3>"
                       + "<hr> <h3>Bikes Available: " + feature.properties.bikesAvailable + "</h3>");
    }
  }).addTo(myMap);

//county_link = "http://boundaries.latimes.com/1.0/boundary-set/la-county-neighborhoods-v5/?format=geojson"
  newlink ="http://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/1.0/boundary-set/la-county-neighborhoods-v5.geojson"
  d3.json(newlink, function(request){
    //console.log(request);
    var boundaries = L.geoJson(request, {
      // Style each feature (in this case a neighborhood)
      style: function(feature) {
        return {
          color: "black",
          // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
          fillColor: "lightblue",
          fillOpacity: 0.2,
          weight: 1.5
        };
      },
      // Called on each feature
      onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
          click: function(event) {
            //console.log(event);
            myMap.fitBounds(event.target.getBounds());
            // if(myLocation) {
            //   myMap.removeLayer(myLocation);
            // }
            // myLocationCoords = [event.latlng.lng, event.latlng.lat];
            // myLocation = L.marker(event.latlng, {icon: myLocationIcon}).addTo(myMap)
          }
        });
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup("<h1>" + feature.properties.name + "</h1>");

      }
    }).addTo(myMap);
  var overlayMaps = {
    Boundaries: boundaries,
    BikeStations: bikeStations
  };
  var controlLayers = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  });
});
// duration is seconds
// distance is meters

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

function getLocation() {
  myMap.locate({setView: true, maxZoom: 16});
}

function onLocationFound(e) {
  var radius = e.accuracy / 2;

  if(myLocation) {
    myMap.removeLayer(myLocation);
  }
  if(routeLayer){
    myMap.removeLayer(routeLayer);
    //$("#navDirections").html("");
  }
  myLocationCoords = [e.latlng.lng, e.latlng.lat];
  startendLocation.push([e.latlng.lat.toFixed(2), e.latlng.lng.toFixed(2)]);
  updateLocationBox();

  myLocation = L.marker(e.latlng, {icon: myLocationIcon}).addTo(myMap)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();

  //L.circle(e.latlng, radius).addTo(myMap);
}
myMap.on('locationfound', onLocationFound);

function goToBikeLocation() {
  myMap.fitBounds([[
      33.99575015925125,
      -118.50162506103517
  ], [
      34.10867772256663,
      -117.98561096191408
  ]]);
}
