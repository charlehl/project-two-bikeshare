var newYorkCoords = [34.05223, -118.24368];
var mapZoomLevel = 12;

    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
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
    Street: streets
  };

  // // Create an overlayMaps object to hold the bikeStations layer
  // var bikeStations = L.layerGroup(bikeMarkers);
  // var overlayMaps = {
  //   BikeStations: bikeStations
  // };

  // Create the map object with options
  var myMap = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    // layers: [light, bikeStations]
    layers: [light]
  });

// Create the createMap function
// var bikeMarkers = [];
link = "https://bikeshare.metro.net/stations/json/";
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Called on each feature
    onEachFeature: function(feature, layer) {
       // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h3>" + feature.properties.addressStreet + "</h3>"
                       + "<hr> <h3>" + feature.properties.bikesAvailable + "</h3>");
    }
  }).addTo(myMap);

});
//county_link = "http://boundaries.latimes.com/1.0/boundary-set/la-county-neighborhoods-v5/?format=geojson"
newlink ="http://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/1.0/boundary-set/la-county-neighborhoods-v5.geojson"
d3.json(newlink, function(request){
  console.log(request);
  L.geoJson(request, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "black",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: "lightblue",
        fillOpacity: 0.5,
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
          myMap.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.name + "</h1>");

    }
  }).addTo(myMap);
});
// myMap.on('load', function() {
//   getRoute();
// });

// function getRoute() {
//   var start = [-118.25854, 34.0485];
//   var end = [-118.27779, 33.73352];
//   var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + API_KEY;
//   console.log(directionsRequest);
//   $.ajax({
//     method: 'GET',
//     url: directionsRequest,
//   }).done(function(data) {
//     var route = data.routes[0].geometry;
//     console.log(route);
//     myMap.addLayer({
//       id: 'route',
//       type: 'line',
//       source: {
//         type: 'geojson',
//         data: {
//           type: 'Feature',
//           geometry: route
//         }
//       },
//       paint: {
//         'line-width': 2
//       }
//     });
//     // this is where the code from the next step will go
//   });
// }

// d3.json(url, function (request) {
//     console.log(request);

//     // request.data.stations.forEach(function(data){
//     //   bikeMarkers.push(
//     //     L.marker([data.lat, data.lon], 
//     //         {
//     //           draggable: true,
//     //           title: `${data.name}`
//     //         }).bindPopup(`<h3>${data.name}</h3><hr><h3>Capacity: ${data.capacity}</h3>`)
//     //   )
//     // });
//     var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//       attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//       maxZoom: 18,
//       id: "mapbox.light",
//       accessToken: API_KEY
//     });
    
//     var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//       attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//       maxZoom: 18,
//       id: "mapbox.streets",
//       accessToken: API_KEY
//     });

//       // Create a baseMaps object to hold the lightmap layer
//       var baseMaps = {
//         Light: light,
//         Street: streets
//       };
    
//       // // Create an overlayMaps object to hold the bikeStations layer
//       // var bikeStations = L.layerGroup(bikeMarkers);
//       // var overlayMaps = {
//       //   BikeStations: bikeStations
//       // };
    
//       // Create the map object with options
//       var myMap = L.map("map-id", {
//         center: newYorkCoords,
//         zoom: mapZoomLevel,
//         // layers: [light, bikeStations]
//         layers: [light]
//       });

//       // L.control.layers(baseMaps, overlayMaps, {
//       //   collapsed: false
//       // }).addTo(myMap);
// });

//console.log(bikeMarkers);
// Create the tile layer that will be the background of our map


  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map

// Create the createMarkers function

  // Pull the "stations" property off of response.data

  // Initialize an array to hold bike markers

  // Loop through the stations array
    // For each station, create a marker and bind a popup with the station's name

    // Add the marker to the bikeMarkers array

  // Create a layer group made from the bike markers array, pass it into the createMap function


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
