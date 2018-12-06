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

// var myMap = L.map("map", {
//   center: [34.02217769764528, -118.35858285427095],
//   zoom: 10,
//   layers: [streets]
// });

var stationIcon = L.icon({
  iconUrl: 'https://www.colourbox.com/preview/21987592-bike-icon-black.jpg',
  
  iconSize:     [32, 32], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var heat;
// Use the list of sample names to populate the select options
// d3.json("/heat_plot").then((plotData) => {
//   // console.log(plotData)
//   //   plotData.forEach((data) => {
//   //   data.trip_id = data.trip_id;
//   //   data.duration =+ data.duration;
//   //   data.plan_duration =+ data.plan_duration;
//   //   data.passholder_type = data.passholder_type;
//   //   data.weekday = data.weekday
//   //     });

// });

link = "https://bikeshare.metro.net/stations/json/";
d3.json(link).then(function(data) {
  //console.log(myMap.getBounds().getSouthWest());
  //console.log(myMap.getBounds().getNorthEast());
  //console.log(data);
  // Creating a geoJSON layer with the retrieved data
  var bikeStations = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {icon: stationIcon});
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
       // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h3>" + feature.properties.name + "<br>" +
                               feature.properties.addressStreet + "<br>" + 
                               feature.properties.addressCity + ", " + feature.properties.addressState + " " +feature.properties.addressZipCode +
                      "</h3>"
                       + "<hr> <h3>Bikes Available: " + feature.properties.bikesAvailable + "</h3>");
    }
  }).addTo(myMap);

  var overlayMaps = {
    BikeStations: bikeStations
  };
  var controlLayers = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
});

// myMap.on('click', function(e) {
//   //console.log(e);
// });
function init() {
  //console.log($("#start-date")["0"].attributes[5].nodeValue);
  //console.log($("#end-date")["0"].attributes[5].nodeValue);
  
  // Grab a reference to the dropdown select element
  //var selector = d3.select("#selDataset");
  d3.json("/heatplots").then((data) => {
    //console.log(data);
    var heatArray = [];
    data.forEach(function(element) {
      
      heatArray.push([(element.start_lat + element.end_lat)/2, (element.start_lon+element.end_lon)/2]);
    });
    // heat = L.heatLayer(heatArray, {
    //   radius: 20,
    //   blur: 35
    // }).addTo(myMap);
  });

}  

// Monitor the 
$('#heat-form-submit').on('click', function(e){
  e.preventDefault();
  //console.log("Why");
  var start = $('input#start-date').val(),
       end = $('input#end-date').val();
  
  //console.log(start);
  //     comments = $('textarea#comments').val(),
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
          //item.properties.rental_count = stationCount[item.properties.kioskId];
        });
        return testData;
        //console.log(results);
       });
       //console.log(stationData);

       stationData.then(data => {
        console.log(data);
        myMap.removeLayer(heatmapLayer);
        // var heatmapLayer = new HeatmapOverlay(cfg);
        heatmapLayer.setData(data);
        heatmapLayer.addTo(myMap);
       });

     }
   });
});

var cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 10,
  "maxOpacity": .8, 
  // scales the radius based on map zoom
  "scaleRadius": false, 
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries 
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": false,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count'
};


var heatmapLayer = new HeatmapOverlay(cfg);

var myMap = L.map("map", {
  center: [34.02217769764528, -118.35858285427095],
  zoom: 10,
  layers: [streets, heatmapLayer]
});
// Initialize the dashboard
init();
