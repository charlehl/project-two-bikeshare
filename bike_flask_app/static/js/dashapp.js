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
	createBarStacked();	
}
//Read the stations data from the geojson & Assign the stations from the mongodb to the dropdown menu options
var url = "https://bikeshare.metro.net/stations/json/"

tick_vals = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
//For Assigning the initial default Plot
function initData(){
	var url = "https://bikeshare.metro.net/stations/json/"

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
		xaxis:{title:"Time Slices(Hourly)",
				tickvals: tick_vals},
		yaxis:{title: "Popularity/Usage"}
				}

		Plotly.plot('graph', data, layout);
		
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
function getData(station_name){
	//console.log(route);
	var station_name = d3.select("#station_dropdownSelect").property("value");
	var week_day = d3.select("#day_dropdownSelect").property("value");
	//Added by Haidy
		d3.json(`/dashboard/${station_name}/${week_day}`).then(function(data){
		//console.log(data);
		
			var x_labels = data.map(function(d) { return +d.time_slices}); 
			var y_labels = data.map(function(d) { return +d.duration});
		
			Plotly.restyle("graph", "x", [x_labels]);
			Plotly.restyle("graph", "y", [y_labels]);
	})

	buildLiveStatus();
}

function WeekDayData(week_day){
	//console.log(route);
	var station_name = d3.select("#station_dropdownSelect").property("value");
	var week_day = d3.select("#day_dropdownSelect").property("value");
	//Added by Haidy
		d3.json(`/dashboard/${station_name}/${week_day}`).then(function(data){
		//console.log(data);
		
			var x_labels = data.map(function(d) { return +d.time_slices}); 
			var y_labels = data.map(function(d) { return +d.duration});
		
			Plotly.restyle("graph", "x", [x_labels]);
			Plotly.restyle("graph", "y", [y_labels]);
		});
	
}

//function
function createBarStacked(){
	//console.log("hi");
	var station_name = d3.select("#station_dropdownSelect").property("value");
	d3.json(`/stacked/${station_name}`).then(function(data){
		//console.log(data[0]);
		var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
		Object.keys(data[0]).forEach(function(key, idx){
			//console.log(data[0][key]);
			data[0][key] = data[0][key].sort(function sortByDay(a, b) {
				a.start_station = +a.start_station;
				b.start_station = +b.start_station;
				return days.indexOf(a.weekday) > days.indexOf(b.weekday);
			});
		});
		Object.keys(data[1]).forEach(function(key, idx){
			//console.log(data[0][key]);
			data[1][key] = data[1][key].sort(function sortByDay(a, b) {
				a.end_station = +a.end_station;
				b.end_station = +b.end_station;
				return days.indexOf(a.weekday) > days.indexOf(b.weekday);
			});
		});
		//console.log(data[1]);
		//console.log(data[0]['Flex Pass'].map(function (item){ return item.weekday}));
		//console.log(data[0]['Flex Pass'].map(function (item){ return item.start_station}));
		var trace1 = {
			x: data[0]['Flex Pass'].map(function (item){ return item.weekday}),
			y: data[0]['Flex Pass'].map(function (item){ return item.start_station}),
			name: 'Flex Pass',
			type: 'bar'
		};
		var trace2 = {
			x: data[0]['Monthly Pass'].map(function (item){ return item.weekday}),
			y: data[0]['Monthly Pass'].map(function (item){ return item.start_station}),
			name: 'Monthly Pass',
			type: 'bar'
		};
		var trace3 = {
			x: data[0]['One Day Pass'].map(function (item){ return item.weekday}),
			y: data[0]['One Day Pass'].map(function (item){ return item.start_station}),
			name: 'One Day Pass',
			type: 'bar'
		};
		var trace4 = {
			x: data[0]['Walk-up'].map(function (item){ return item.weekday}),
			y: data[0]['Walk-up'].map(function (item){ return item.start_station}),
			name: 'Walk-Up',
			type: 'bar'
		};
		var bardata = [trace1, trace2, trace3, trace4];
	  
		var layout = {
			title: `Station: ${station_name} Pick-Ups`,
			barmode: 'stack'
		};
		Plotly.newPlot('bar-stack-start', bardata, layout);

		//console.log(data[1]['Flex Pass'].map(function (item){ return item.weekday}));
		//console.log(data[1]['Flex Pass'].map(function (item){ return item.end_station}));
		var trace1 = {
			x: data[1]['Flex Pass'].map(function (item){ return item.weekday}),
			y: data[1]['Flex Pass'].map(function (item){ return item.end_station}),
			name: 'Flex Pass',
			type: 'bar'
		};
		var trace2 = {
			x: data[1]['Monthly Pass'].map(function (item){ return item.weekday}),
			y: data[1]['Monthly Pass'].map(function (item){ return item.end_station}),
			name: 'Monthly Pass',
			type: 'bar'
		};
		var trace3 = {
			x: data[1]['One Day Pass'].map(function (item){ return item.weekday}),
			y: data[1]['One Day Pass'].map(function (item){ return item.end_station}),
			name: 'One Day Pass',
			type: 'bar'
		};
		var trace4 = {
			x: data[1]['Walk-up'].map(function (item){ return item.weekday}),
			y: data[1]['Walk-up'].map(function (item){ return item.end_station}),
			name: 'Walk-Up',
			type: 'bar'
		};
		var bardata = [trace1, trace2, trace3, trace4];
	  
		var layout = {
			title: `Station: ${station_name} Drop-Offs`,
			barmode: 'stack'
		};		
		Plotly.newPlot('bar-stack-end', bardata, layout);
	});
}