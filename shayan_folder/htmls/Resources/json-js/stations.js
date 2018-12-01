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
  var svgHeight = 330;

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
    .domain(response.features.map(d => d.properties.name))
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
    .call(bottomAxis);


//   var barSpacing = 1; // desired space between each bar
//   var scaleY = 10; // 10x scale on rect height

//   // Create a 'barWidth' variable so that the bar chart spans the entire chartWidth.
//   var barWidth = (chartWidth - (barSpacing * (response.features.length - 1))) / response.features.length;

//   // Create code to build the bar chart using the response.features.
//   chartGroup.selectAll(".bar")
//     .data(response.features)
//     .enter()
//     .append("rect")
//     .classed("bar", true)
//     .attr("width", d => barWidth)
//     .attr("height", d => d.properties.bikesAvailable * scaleY)
//     .attr("x", (d, i) => i * (barWidth + barSpacing))
//     .attr("y", d => chartHeight - d.properties.bikesAvailable * scaleY);

  chartGroup.selectAll(".bar")
    .data(response.features)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.properties.name))
    .attr("y", d => yLinearScale(d.properties.bikesAvailable))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d.properties.bikesAvailable));

      // Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      console.log(d);
      // for (var i=0; i<d.length; i++) {
      return (`Station Name: ${d.name}
        <br>Station Address: ${d.addressStreet}
        <br>Available Bikes: ${d.bikesAvailable}
        <br>Available Docks: ${d.docksAvailable}
        <br>Status: ${d.kioskPublicStatus}
        <br>Opens @: ${d.openTime}
        <br>Closes @: ${d.closeTime}`);
      // }
    });

  // Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

  // Create "mouseover" event listener to display tooltip
  chartGroup.on("mouseover", function(d) {
      d3.select(this).style("stroke", "orange")
        toolTip.show(d, this);
    })

    // Step 1: Append a div to the body to create tooltips, assign it a class
  // =======================================================
  // var toolTip = d3.select("body").append("div")
  //   .attr("class", "tooltip");

  // // Step 2: Add an onmouseover event to display a tooltip
  // // ========================================================
  // chartGroup.on("mouseover", function(d, i) {
  //   toolTip.style("display", "block");
  //   toolTip.html(`Station Name: <strong>${d[i].properites.name}</strong>`);
  //     // .style("left", d3.event.pageX + "px")
  //     // .style("top", d3.event.pageY + "px");
  //   })
    // Step 3: Add an onmouseout event to make the tooltip invisible
    .on("mouseout", function() {
      toolTip.style("display", "none");
    });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -20 - chartMargin.left + 20)
    .attr("x", -60 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Available Bikes");

  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2 - 50}, ${chartHeight + chartMargin.top})`)
    // .attr("class", "axisText")
    .attr("tickangle", "rotate(-90)")
    .text("Stations Names");

});

