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

// Retrieve database from route
d3.json("/plots").then((plotData) => {
  console.log(plotData)
    plotData.forEach((data) => {
    data.trip_id = data.trip_id;
    data.duration =+ data.duration;
    data.plan_duration =+ data.plan_duration;
    data.passholder_type = data.passholder_type;
    data.weekday = data.weekday;
      });
  
	// var nest = d3.nest()
	//   .key(function(d){
	//     return d.weekday;
	//   })
	//   .sortKeys(d3.ascending)
	//   .rollup(function(leaves){
	//  		return d3.sum(leaves, function(d) {return (d.duration)});
	// 	})
	//   .entries(plotData)
	var nest = d3.nest()
	  .key(function(d) { return d.weekday; })
	  .key(function(d) { return d.passholder_type })
	  .rollup(function(leaves){
	 	return d3.sum(leaves, function(d) { return d.duration });
	 })
	  .entries(plotData)

    console.log(nest)
    // Scale the range of the data
    x.domain(nest.map(function(d) { return d.key; }));
    y.domain([0, d3.max(nest, function(d) { return d.values.value; })]);
  
    // Set up the x axis
    var xaxis = svg.append("g")
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

    // yaxis.select(".domain").style("display","none")
  
    // Add a label to the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Duration in minutes")
        .attr("class", "y axis label");
  
    // Draw the bars
    svg.selectAll(".rect")
      .data(nest)
      .enter()
      .append("rect")
      .attr("class", "bar")
	  .attr("x", function(d) { return x(d.key); })
	  .attr("y", function(d) { return y(d.values.value); })
	  .attr("width", x.bandwidth())
	  .attr("height", function(d) { return height - y(d.values.passholder_type); });

	    var fruitMenu = d3.select("#fruitDropdown")

    PassesMenu
		.append("select")
		.selectAll("option")
        .data(nest)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d.values.passholder_type;
        })
        .text(function(d){
            return d.values.passholder_type;
        })



  
});
