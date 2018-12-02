var url = "https://bikeshare.metro.net/stations/json/";

d3.json(url, function(error, response) {

  // Log an error if one exists
  if (error) return console.warn(error);

  // check the data
  // console.log(response);

  // var availableBikes = [];
  // var availableDocks = [];
  // var status = [];
  // var addresses = [];

  // for (var i = 0; i < response.features.length; i++) {
  //   var p = response.features[i].properties;

  //   if (p) {
  //     availableBikes.push(p.bikesAvailable);
  //     availableDocks.push(p.docksAvailable);
  //     status.push(p.kioskConnectionStatus);
  //     addresses.push(p.addressStreet);
  //   }
  // }

  // console.log(availableBikes);
  // console.log(availableDocks);
  // console.log(status);
  // console.log(addresses);

  // Define SVG area dimensions
  var svgWidth = 1100;
  var svgHeight = 530;

  // Define the chart's margins as an object
  var chartMargin = {
    top: 50,
    right: 90,
    bottom: 50,
    left: 50
  };

  // Define dimensions of the chart area
  var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

  // Select body, append SVG area to it, and set the dimensions

  var svg = d3
  .select("#svg-area")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  // Append a group to the SVG area and shift ('translate') it to the right and down to adhere
  // to the margins set in the "chartMargin" object.
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, 0)`);
    // .attr("transform", `translate(${chartMargin.left}, ${chartMargin.bottom})`);

  // Parse our data
  response.features.forEach(function(data) {
    data.properties.bikesAvailable = +data.properties.bikesAvailable;
    data.properties.docksAvailable = +data.properties.docksAvailable;
  });

  // define the horizontal scales with a padding of 0.1 (10%) for x axis
  var xBandScale = d3.scaleBand()
    .domain(response.features.map(d => d.properties.kioskId))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(response.features, d => d.properties.bikesAvailable)])
    .range([chartHeight, 0]);

    // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-90)");

  // Tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, 120])
    .style("color", "#083b47")
    .html(function(d) {
      // console.log(d);
      return (`Station Name: ${d.properties.name}
        <br>ID: ${d.properties.kioskId}
        <br>Station Address: ${d.properties.addressStreet}
        <br>Available Bikes: ${d.properties.bikesAvailable}
        <br>Available Docks: ${d.properties.docksAvailable}
        <br>Status: ${d.properties.kioskPublicStatus}
        <br>Opens @: ${d.properties.openTime}
        <br>Closes @: ${d.properties.closeTime}`);
    });

  // Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

  chartGroup.selectAll(".bar")
    .data(response.features)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.properties.kioskId))
    .attr("y", d => yLinearScale(d.properties.bikesAvailable))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d.properties.bikesAvailable))
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -20 - chartMargin.left + 20)
    .attr("x", -60 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Available Bikes");

  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2 - 50}, ${chartHeight + chartMargin.top})`)
    .text("Stations Names")

});


