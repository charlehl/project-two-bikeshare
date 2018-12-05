/*Read the stations data from Flask mongodb
d3.json("/stations").then(function(element){
	//console.log(element)
	element.forEach((data) => {
		data.start_station = data.start_station;
		//console.log(data.start_station);
		var select = document.getElementById("station_dropdownSelect");

		var elem = document.createElement("option");
		var opt = data.start_station
		elem.textContent = opt;
		elem.value = opt;
		select.appendChild(elem);

	})
})
*/
//Read the stations data from the geojson & Assign the stations from the mongodb to the dropdown menu options
var url = "https://bikeshare.metro.net/stations/json/"

//For Assigning the initial default Plot
function initData(){
	var station_name = d3.select("#station_dropdownSelect").property("value");
	var defaultUrl = "/dashboard/" + station_name
	d3.json(defaultUrl).then(function defaultPlot(trace){
		console.log(trace);
		var x_labels = trace.map(function(d) { return +d.time_slices}); 
		var y_labels = trace.map(function(d) { return +d.duration});
		console.log(x_labels);
		console.log(y_labels);
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
	})


//test = d3.select("station_dropdownSelect").property("value");

//Function to read the data from the selection of user and call the API
function getData(route){
	console.log(route);
	var station_name = d3.select("#station_dropdownSelect").property("value");
	d3.json(`/dashboard/${route}`).then(function(data){
		console.log(data);
		
		var x_labels = data.map(function(d) { return +d.time_slices}); 
		var y_labels = data.map(function(d) { return +d.duration});
		
		Plotly.restyle("graph", "x", [x_labels]);
		Plotly.restyle("graph", "y", [y_labels]);
	})
}

