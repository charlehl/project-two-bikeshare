var url = "https://bikeshare.metro.net/stations/json/"

var svgWidth = 1000;
var svgHeight = 500;


var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var svg = d3.select("#bar")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "weekday";
var chosenYAxis = "duration";

function xScale(plotData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(plotData, d => d[chosenXAxis])*.9, d3.max(plotData, d => d[chosenXAxis])*1.1])
    .range([0, width]);
  return xLinearScale;
}
function yScale(plotData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(plotData, d => d[chosenYAxis])])
    .range([height,0]);
  return yLinearScale;
 }
 function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(500)
    .call(bottomAxis);
  return xAxis;
}
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(500)
    .call(leftAxis);
  return yAxis;
}
function updateXValuesText(rectGroup,newXScale, chosenXAxis, attr) {
  rectGroup.transition()
  .duration(500)
  .attr(attr, d => newXScale(d[chosenXAxis]))
  return rectGroup;
}
function updateYValuesText(rectGroup, newYScale, chosenYAxis, attr) {
  rectGroup.transition()
  .duration(500)
  .attr(attr, d => newYScale(d[chosenYAxis]))
  return rectGroup;
}

 
// Use the list of sample names to populate the select options
d3.json("/plots").then((plotData) => {
  console.log(plotData)
    plotData.forEach((data) => {
    data.trip_id = data.trip_id;
    data.duration =+ data.duration;
    data.plan_duration =+ data.plan_duration;
    data.passholder_type = data.passholder_type;
    data.weekday = data.weekday
      });

    var weekdayData = d3.nest()
      .key(function(d) {return d.weekday;})
      .rollup(function(d) {
        return d3.sum(d, function(g) {return g.duration;});
      }).entries(plotData);

    console.log(weekdayData)
  var xLinearScale = xScale(plotData, chosenXAxis);
  var yLinearScale = yScale(plotData, chosenYAxis);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    .call(leftAxis);
  var barSpacing = 10;


  var rectGroup = chartGroup.selectAll("#bar")
    .data(plotData)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", 10)
    .attr("height", d => d.duration)
    .attr("x", (d,i) => i)
    .attr("y", d => chartHeight - d.duration)



});

  


// function optionChanged(newSample) {
//   // Fetch new data each time a new sample is selected
//   buildCharts(newSample);
//   buildMetadata(newSample);
// }

// Initialize the dashboard
//init();

