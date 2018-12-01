// Set the margins
var margin = {top: 60, right: 100, bottom: 20, left: 80},
  width = 850 - margin.left - margin.right,
  height = 370 - margin.top - margin.bottom;

// Parse the month variable
var parseWeekday = d3.timeParse("%A");
var formatWeekday= d3.timeFormat("%A");

// Set the ranges
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1) 
var y = d3.scaleLinear().range([height, 0]);


// Create the svg canvas in the "graph" div
var svg = d3.select("#graph")
        .append("svg")
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + margin.top + margin.bottom + "px")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svg");

function filter_data () {
var pass_type = d3.select('#dropdownSelect').node().selectedOptions[0].value
//console.log(`The value of k is: ${pass_type}`)

// pass pass_type value to flask
d3.json(`/filter_data?pass_type=${pass_type}`).then((filter_data) => {
  		console.log(filter_data)
  		filter_data.forEach((data) => {
  			data.weekday = data.weekday;
  			data.duration =+ data.duration;
  		});
});
}
filter_data("Monthly Pass");
