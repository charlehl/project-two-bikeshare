var url = "https://bikeshare.metro.net/stations/json/";

d3.json(url, function(error, response) {

  // Log an error if one exists
  if (error) return console.warn(error);

  // check the data
  // console.log(response);

  var availableBikes = [];
  var availableDocks = [];
  var status = [];
  var addresses = [];

  for (var i = 0; i < response.features.length; i++) {
    var p = response.features[i].properties;

    if (p) {
      availableBikes.push(p.bikesAvailable);
      availableDocks.push(p.docksAvailable);
      status.push(p.kioskConnectionStatus);
      addresses.push(p.addressStreet);
    }
  }

  // check the data
  console.log(availableBikes);
  console.log(availableDocks);
  console.log(status);
  console.log(addresses);

  // Define SVG area dimensions
  var svgWidth = 960;
  var svgHeight = 660;

  // Define the chart's margins as an object
  var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  };

  // Define dimensions of the chart area
  var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

  // Select body, append SVG area to it, and set the dimensions
  var svg = d3
    .select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append a group to the SVG area and shift ('translate') it to the right and down to adhere
  // to the margins set in the "chartMargin" object.
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  // Parse our data
  response.features.forEach(function(data) {
    data.availableBikes = +data.availableBikes;
    data.availableDocks = +data.availableDocks;
  });

  var barSpacing = 1; // desired space between each bar
  var scaleY = 10; // 10x scale on rect height

  // @TODO
  // Create a 'barWidth' variable so that the bar chart spans the entire chartWidth.
  var barWidth = (chartWidth - (barSpacing * (response.features.length - 1))) / response.features.length;

  // Create code to build the bar chart using the response.features.
  chartGroup.selectAll(".bar")
    .data(response.features)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", d => barWidth)
    .attr("height", d => d.properties.bikesAvailable * scaleY)
    .attr("x", (d, i) => i * (barWidth + barSpacing))
    .attr("y", d => chartHeight - d.properties.bikesAvailable * scaleY);
});


