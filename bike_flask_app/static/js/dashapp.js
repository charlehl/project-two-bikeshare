// Function to build live status
function buildLiveStatus() {

	var url = "https://bikeshare.metro.net/stations/json/"

	d3.json(url).then((data) => {
		var selection = document.getElementById("station_dropdownSelect").value
		//console.log(selection)
		//console.log(data);
		
		for(var i=0; i<data.features.length; i++){
			if(data.features[i].properties.kioskId === +selection) {
				var index = i;
				break;
			}
			//console.log(data.features[i].properties.kioskId);
		}
		var filteredStation = data.features[index];
		//console.log(filteredStation);
		var data = d3.select("#panel-status");
		data.html("");
		var stationInfo = 
				{Id: filteredStation.properties.kioskId,
				Name: filteredStation.properties.name,
				Street: filteredStation.properties.addressStreet,
				Status: filteredStation.properties.kioskConnectionStatus,
				openTime: filteredStation.properties.openTime,
				closeTime: filteredStation.properties.closeTime,
				bikesAvailable: filteredStation.properties.bikesAvailable,
				docksAvailable: filteredStation.properties.docksAvailable};
		//console.log(stationInfo)
		Object.entries(stationInfo).forEach(([key,value]) =>{
		data.append("h6").text(`${key}: ${value}`);
		});
	});	
}
//Read the stations data from the geojson & Assign the stations from the mongodb to the dropdown menu options
var url = "https://bikeshare.metro.net/stations/json/"


//For Assigning the initial default Plot
function initData(){
	var station_name = d3.select("#station_dropdownSelect").property("value");
	// Added/changed by Haidy//
	var week_day = d3.select("#day_dropdownSelect").property("value");
	var defaultUrl = "/dashboard/" + station_name + "/" + week_day
	//End added by Haidy
	//buildLiveStatus(arr[0]);
	d3.json(defaultUrl).then(function defaultPlot(trace){
		//console.log(trace);
		var x_labels = trace.map(function(d) { return +d.time_slices}); 
		var y_labels = trace.map(function(d) { return +d.duration});
		//console.log(x_labels);
		//console.log(y_labels);
		var data = [{x: x_labels, y: y_labels, type:'bar'}];

		var layout = {title: "Customers Popular Times",
				  xaxis: "Times",
				  yaxis: "Popularity/Usage",
				  margin : {t: 30, b: 100, l: 30} };

		Plotly.newPlot('graph', data);
		
});
}

d3.json(url).then(function(data) {
		var select = document.getElementById("station_dropdownSelect");
		select.innerHTML = "";
		data.features.forEach(data => {
			//console.log(data)
			select.innerHTML += "<option value=\"" + data.properties.kioskId + "\">" + data.properties.name + "</option>";
		});
		//console.log("Hi");
		initData();
		buildLiveStatus(data.features[0].kioskId);
	});

//Function to read the data from the selection of user and call the API
function getData(route){
	//console.log(route);
	var station_name = d3.select("#station_dropdownSelect").property("value");
	//Added by Haidy
	function WeekDayData(new_route) {
		var week_day = d3.select("#day_dropdownSelect").property("value");
		d3.json(`/dashboard/${route}/${new_route}`).then(function(data){
		//console.log(data);
		
			var x_labels = data.map(function(d) { return +d.time_slices}); 
			var y_labels = data.map(function(d) { return +d.duration});
		
			Plotly.restyle("graph", "x", [x_labels]);
			Plotly.restyle("graph", "y", [y_labels]);
	})
	//added by Haidy
	}
	//end added
	/**///Haidy

	buildLiveStatus();
}

//removed by Haidy
//Function to read the data from the selection of user and call the API
/*
function dayData(route){
	console.log(route);
	var station_name = d3.select("#station_dropdownSelect").property("value");
	var day = d3.select("#weekday_dropdownSelect").property("value");
	d3.json(`/dashboard/${station_name}/${route}`).then(function(data){
		console.log(data);
		
		var x_labels = data.map(function(d) { return +d.time_slices}); 
		var y_labels = data.map(function(d) { return +d.duration});
		
		Plotly.restyle("graph", "x", [x_labels]);
		Plotly.restyle("graph", "y", [y_labels]);
	})
	buildLiveStatus();
}
*/
//end removed