	// Set the margins
	var margin = {top: 60, right: 60, bottom: 60, left: 60},
	  width = 900 - margin.left - margin.right,
	  height = 400 - margin.top - margin.bottom;

	// Parse the month variable
	var parseWeekday = d3.timeParse("%A");
	var formatWeekday= d3.timeFormat("%A");

	// Set the ranges
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1) 
	var y = d3.scaleLinear().range([height, 0]);


	// Create the svg canvas in the "graph" div
	var svg = d3.select("#passBar")
	        .append("svg")
	        .style("width", width + margin.left + margin.right + "px")
	        .style("height", height + margin.top + margin.bottom + "px")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	        .append("g")
	        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
	        .attr("class", "svg");

var pass_type = d3.select('#dropdownSelect').node().selectedOptions[0].value;
// Bar chart: weekly bike usage filtered by Pass Type
function initialBar (pass_type) {

	var pass_type = d3.select('#dropdownSelect').node().selectedOptions[0].value;
    
	d3.json(`/bar_data?pass_type=${pass_type}`).then((bar_data) => {
	console.log(bar_data)

  		bar_data.forEach((data) => {
  		data.weekday = data.weekday;
  		data.duration =+ data.duration;
  		});
  		//Scale the range of the data
		x.domain(bar_data.map(function(d) { return d.weekday; }));
		y.domain([0, d3.max(bar_data, function(d) { return d.duration })]);
		//Set up the x axis
		var xAxis = svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.attr("class", "x axis")
			.call(d3.axisBottom(x)
			.tickSize(0, 0)
			.tickSizeInner(0)
			.tickPadding(10));

		// Add the Y Axis
		var yaxis = svg.append("g")
		    .attr("class", "y axis")
		    .call(d3.axisLeft(y)
		    .ticks(5)
		    .tickSizeInner(0)
		    .tickPadding(6)
		    .tickSize(0, 0));
		// Add title   
		 
		svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text("Bike rental time filtered by Pass Type");    
	  
	    // Add a label to the y axis
	    svg.append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 0 - 60)
	        .attr("x", 0 - (height / 2))
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .text("Usage Volume (minutes)")
	        .attr("class", "y axis label");

  		var selectPassGroup = svg.selectAll(".passGroup")
            .data(bar_data)
	        .enter()
	        .append("g")
	      	.attr("class", "passGroup")

	    var initialRect= selectPassGroup.selectAll(".rect")  
	    	.data(bar_data)
	    	.enter()
	    	.append("rect")

	    initialRect	
	    	.attr("class", "bar")
		    .attr("x", function(d) { return x(d.weekday); })
		    .attr("y", function(d) { return y(d.duration); })
		    .attr("width", 100)
		    .attr("height", function(d) { return height - y(d.duration); });

	});
}	
initialBar(pass_type)  


function bar_data(pass_type) {
	
	var pass_type = d3.select('#dropdownSelect').node().selectedOptions[0].value;
	d3.json(`/bar_data?pass_type=${pass_type}`).then((bar_data) => {
	  	//console.log(bar_data)
	  	
	  	bar_data.forEach((data) => {
	  		data.weekday = data.weekday;
	  		data.duration =+ data.duration;
	  		});

	  	//x.domain(bar_data.map(function(d) { return d.weekday; }));
	  	y.domain([0, d3.max(bar_data, function(d) { return d.duration })]);

	  	var xAxis = svg.append("g")
		    .attr("transform", "translate(0," + height + ")")
		    .attr("class", "x axis")
		    .call(d3.axisBottom(x)
		    .tickSize(0, 0)
		    .tickSizeInner(0)
		    .tickPadding(10));

	  	//Add the Y Axis
		var yaxis = svg
		    .call(d3.axisLeft(y)
		    .ticks(5)
		    .tickSizeInner(0)
		    .tickPadding(6)
		    .tickSize(0, 0));

		var selectPassGroup = svg.selectAll(".passGroup")
            .data(bar_data)

	    selectPassGroup.selectAll("rect.bar")  
	    	.data(bar_data)
	    	.transition()
	    	.duration(1000)
		    .attr("x", function(d) { return x(d.weekday); })
		    .attr("y", function(d) { return y(d.duration); })
		    .attr("height", function(d) { return height - y(d.duration); });


	});
}	

//Pie Chart count of total rentals grouped by Pass Type
 d3.json("/pie_data").then((pie_data) => {
 	//console.log(pie_data)
 	pie_data.forEach((data) => {
  		data.weekday = data.weekday;
  		data.duration =+ data.duration;
  		});
	var pieLabels = pie_data.map(function(d) { return d.passholder_type});
	//console.log(pieLabels);  
	var pieValues = pie_data.map(function(d) { return d.trip_id});
	//console.log(pieValues);

	var colors = ['rgba(155, 140, 28, 0.7)','rgba(155, 77, 28, 0.7)','rgb(66, 135, 178)','rgba(28, 155, 77, 0.7)','rgb(155, 28, 43)']

	var trace1 = {
		labels: pieLabels,
		values: pieValues,
		type: "pie",
		text: pie_data.map(function(d) { return d.passholder_type}),
		marker: {
			colors: colors
		},
		text: {
			color:'#000'
		}
	};
	var data = [trace1];
	var layout = {
		height: 500,
		width: 500,
		title: "Pass Type"
	}
	Plotly.newPlot("passPie", data, layout)
	});

// Dashboard stations live status info panel

function init() {

  var url = "https://bikeshare.metro.net/stations/json/"

	d3.json(url).then(function(data) {
		//console.log(data.features)
		var arr = data.features.map(data => data.properties.name)

		for (var i=0; i< arr.length; i++) {
			//var arr = data.features.name
			//console.log(arr[i])

			var select = document.getElementById("station_dropdownSelect")
			var opt = arr[i]
			var elem = document.createElement("option");
			elem.textContent = opt;
			elem.value = opt;
			select.appendChild(elem);
		}
		buildLiveStatus(arr[0]);
	});
}

function buildLiveStatus(name) {

	var url = "https://bikeshare.metro.net/stations/json/"

	d3.json(url).then((data) => {
		var selection = document.getElementById("station_dropdownSelect").value
		console.log(selection)
		
		data.getFeaturesByProperty = function(key, value) {
			return this.features.filter(function(feature) {
				if (feature.properties[key] === value) {
					return true;
				} else {
					return false;
				}
			})
		}
		var stationStatus = data.getFeaturesByProperty('name', `${selection}`);
		var filteredStation = stationStatus[0];
		console.log(filteredStation)
		var $data = d3.select("#panel-status");
		$data.html("");
		var stationInfo = 
				{Id: filteredStation.properties.kioskId,
				Name: filteredStation.properties.name,
				Street: filteredStation.properties.addressStreet,
				Status: filteredStation.properties.kioskConnectionStatus,
				openTime: filteredStation.properties.openTime,
				closeTime: filteredStation.properties.closeTime,
				bikesAvailable: filteredStation.properties.bikesAvailable,
				docksAvailable: filteredStation.properties.docksAvailable};
		console.log(stationInfo)
		Object.entries(stationInfo).forEach(([key,value]) =>{
		$data.append("h6").text(`${key}: ${value}`);
		});
	});	
}
buildLiveStatus();

function changeStation(newStation) {
	buildLiveStatus(newStation);
}	
//starts livestation dashboard
init();









