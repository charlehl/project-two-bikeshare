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

function filter_data() {
var pass_type = d3.select('#dropdownSelect').node().selectedOptions[0].value
//console.log(`The value of k is: ${pass_type}`)

// pass pass_type value to flask
d3.json(`/filter_data?pass_type=${pass_type}`).then((filtered_data) => {
  		console.log(filtered_data)
  		filtered_data.forEach((data) => {
  			data.weekday = data.weekday;
  			data.duration =+ data.duration;
  		});
	  // Scale the range of the data
	  x.domain(filtered_data.map(function(d) { return d.weekday; }));
	  y.domain([0, d3.max(filtered_data, function(d) { return d.duration })]);

	    // Set up the x axis
	  var xaxis = svg.append("g")
	       .attr("transform", "translate(0," + height + ")")
	       .attr("class", "x axis")
	       .call(d3.axisBottom(x)
	          //.ticks(d3.timeMonth)
	          .tickSize(0, 0)
	          //.tickFormat(d3.timeFormat("%B"))
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
	 // yaxis.select(".domain").style("display","none")
  
  // Add a label to the y axis
  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Rental Duration (minutes)")
        .attr("class", "y axis label");
  
  // Draw the bars
  svg.selectAll(".rect")
      .data(filtered_data)
      .enter()
      .append("rect")
      	  .attr("class", "bar")
	      .attr("x", function(d) { return x(d.weekday); })
	      .attr("y", function(d) { return y(d.duration); })
	      .attr("width", x.bandwidth())
	      .attr("height", function(d) { return height - y(d.duration); });
	

});

}
function selectionChange () {

}
