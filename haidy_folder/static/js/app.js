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
	})

//For Assigning the initial default Plot
function initData(){
	var station_name = d3.select("#station_dropdownSelect").property("value");
	var defaultUrl = "/dashboard?station_name="+ station_name
	d3.json(defaultUrl).then(function defaultPlot(trace){
		var x_labels = data.map(function(d) { return d.time_slices}); 
		var y_labels = data.map(function(d) { return d.duration});
		var data = [{x: x_labels}, {y: y_labels}, {type:'bar'}];

		var layout = {title: "Customers Popular Times",
				  xaxis: "Times",
				  yaxis: "Popularity/Usage",
				  margin : {t: 30, b: 100, l: 30} };

		plotly.newPlot("graph", data, layout)
})
}
//test = d3.select("station_dropdownSelect").property("value");
initData();
//Function to read the data from the selection of user and call the API
function getData(route){
	console.log(route);
	var station_name = d3.select("#station_dropdownSelect").property("value");
	d3.json(`/dashboard?station_name=${route}`).then(function(data){
		console.log(data);
		
		var x_labels = data.map(function(d) { return d.time_slices}); 
		var y_labels = data.map(function(d) { return d.duration});
		
		Plotly.restyle("graph", "x", [x_labels]);
		Plotly.restyle("graph", "y", [y_labels]);
	})
}

