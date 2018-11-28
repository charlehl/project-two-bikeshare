var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("bike_data_db")
  console_log(dbo)
})



// var svgWidth = 1000;
// var svgHeight = 500;


// var margin = {
// 	top: 20,
// 	right: 40,
// 	bottom: 80,
// 	left: 100
// }

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// var svg = d3.select("#scatter")
// 	.append("svg")
// 	.attr("width", svgWidth)
// 	.attr("height", svgHeight);

// var chartGroup = svg.append("g")
// 	.attr("transform", `translate(${margin.left}, ${margin.top})`);

// var chosenXAxis = "income";
// var chosenYAxis = "healthcare";


// function xScale(censusData, chosenXAxis) {
// 	var xLinearScale = d3.scaleLinear()
// 		.domain([d3.min(censusData, d => d[chosenXAxis])*.9, d3.max(censusData, d => d[chosenXAxis])*1.1])
// 		.range([0, width]);
//  	return xLinearScale;
// }
// function yScale(censusData, chosenYAxis) {
// 	var yLinearScale = d3.scaleLinear()
// 		.domain([0, d3.max(censusData, d => d[chosenYAxis])])
// 		.range([height,0]);
//  	return yLinearScale;
//  }

// function renderXAxes(newXScale, xAxis) {
// 	var bottomAxis = d3.axisBottom(newXScale);
// 	xAxis.transition()
// 		.duration(500)
// 		.call(bottomAxis);
// 	return xAxis;
// }
// function renderYAxes(newYScale, yAxis) {
// 	var leftAxis = d3.axisLeft(newYScale);
// 	yAxis.transition()
// 		.duration(500)
// 		.call(leftAxis);
// 	return yAxis;
// }
// function updateXValuesText(circleGroup,newXScale, chosenXAxis, attr) {
// 	circleGroup.transition()
// 	.duration(500)
// 	.attr(attr, d => newXScale(d[chosenXAxis]))
// 	return circleGroup;
// }
// function updateYValuesText(circleGroup, newYScale, chosenYAxis, attr) {
// 	circleGroup.transition()
// 	.duration(500)
// 	.attr(attr, d => newYScale(d[chosenYAxis]))
// 	return circleGroup;
// }
// function xUpdateToolTip(chosenXAxis,xCircleGroup) {
// 	if (chosenXAxis ==="poverty") {
// 		var xlabel = "In Poverty(%)";
// 	}
// 	else if (chosenXAxis === "income") {
// 		var xlabel = "Household Income(Median)";
// 	}
// 	else{
// 		var xlabel = "Age(Median)";
// 	};

// 	if (chosenYAxis === "healthcare") {
// 		var ylabel = "Lacks Healthcare(%)";
// 	}
// 	else if (chosenYAxis === "obesity") {
// 		var ylabel = "Obesity(%)";
// 	}
// 	else  {
// 		var ylabel = "Smokes(%)";
// 	};
	
// var toolTip = d3.tip()
// 	.attr("class", "d3-tip")
// 	.offset([80, -60])
// 	.html(function(d){
// 		return (`<strong>${d.state}:</strong><br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
// 	});
// 	xCircleGroup.call(toolTip);

// 	xCircleGroup.on("mouseover", function(data) {
// 		toolTip.show(data);
// 	})
// 	xCircleGroup.on("mouseout", function(data, index) {
// 			toolTip.hide(data);
// 		});
// 	return xCircleGroup;
// }

// function yUpdateToolTip(chosenYAxis, yCircleGroup) {

// 	if (chosenYAxis === "healthcare") {
// 		var ylabel = "Lacks Healthcare(%)";
// 	}
// 	else if (chosenYAxis === "obesity") {
// 		var ylabel = "Obesity(%)";
// 	}
// 	else  {
// 		var ylabel = "Smokes(%)";
// 	};
// 		if (chosenXAxis ==="poverty") {
// 		var xlabel = "In Poverty(%)";
// 	}
// 	else if (chosenXAxis === "income") {
// 		var xlabel = "Household Income(Median)";
// 	}
// 	else{
// 		var xlabel = "Age(Median)";
// 	};
	
// var toolTip = d3.tip()
// 	.attr("class", "d3-tip")
// 	.offset([80, -60])
// 	.html(function(d){
// 		return (`<strong>${d.state}:</strong><br> ${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
// 	});
// 	yCircleGroup.call(toolTip);

// 	yCircleGroup.on("mouseover", function(data) {
// 		toolTip.show(data);
// 	})
// 	yCircleGroup.on("mouseout", function(data, index) {
// 			toolTip.hide(data);
// 		});
// 	return yCircleGroup;
// }

// d3.csv("assets/data/data.csv", function(err, censusData) {
// 	if (err) throw err;
// 	console.log(censusData);

// censusData.forEach(function (data) {
// 	data.poverty = +data.poverty;
// 	data.povertyMoe = +data.povertyMoe;
// 	data.income = +data.income;
// 	data.incomeMoe = +data.incomeMoe;
// 	data.age = +data.age;
// 	data.ageMoe = +data.ageMoe;
// 	data.state = data.state;
// 	data.abbr = data.abbr;
// 	data.povertyMoe = +data.povertyMoe;
// 	data.healthcare = +data.healthcare;
// 	data.healthcareLow = +data.healthcareLow;
// 	data.healthcareHigh = +data.healthcareHigh;
// 	data.obesity = +data.obesity;
// 	data.obesityLow = +data.obesityLow;
// 	data.obesityHigh = +data.obesityHigh;
// 	data.smokes = +data.smokes;
// 	data.smokesLow = +data.smokesLow;
// 	data.smokesHigh = +data.smokesHigh;
//   });

// var xLinearScale = xScale(censusData, chosenXAxis);
// var yLinearScale = yScale(censusData, chosenYAxis);

// var bottomAxis = d3.axisBottom(xLinearScale);
// var leftAxis = d3.axisLeft(yLinearScale);

// var xAxis = chartGroup.append("g")
// 	.classed("x-axis", true)
// 	.attr("transform", `translate(0, ${height})`)
// 	.call(bottomAxis);

// var yAxis = chartGroup.append("g")
// 	.call(leftAxis);


// var circleGroup = chartGroup.selectAll("circle")
// 	.data(censusData)
// 	.enter()
// 	.append("circle")
// 	.classed("stateCircle",true)
// 	.attr("cx", d => xLinearScale(d[chosenXAxis]))
// 	.attr("cy", d => yLinearScale(d[chosenYAxis]))
// 	.attr("r", 15);


// var textGroup = chartGroup.selectAll("stateText")
// 	.data(censusData)
// 	.enter()
// 	.append("text")
// 	.classed("stateText", true)
//  	.attr("text-anchor", "middle")
// 	.attr("x", d => xLinearScale(d[chosenXAxis]))
// 	.attr("y", d => yLinearScale(d[chosenYAxis])+6)
// 	.text(d => d.abbr);

// var xLabelsGroup = chartGroup.append("g")
// 	.attr("transform", `translate(${width/2}, ${height + 20})`);

// var incomeLabel = xLabelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "income") // value to grab for event listener
//     .classed("active", true)
//     .text("Household Income(Median)");

// var povertyLabel = xLabelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "poverty") // value to grab for event listener
//     .classed("inactive", true)
//     .text("In Poverty(%)");

// var ageLabel = xLabelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 60)
//     .attr("value", "age") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Age(Median)");

//   // append y axis
//  var yLabelsGroup = chartGroup.append("g")
//  	.attr("transform", "rotate(-90)");

//  var healthcareLabel = yLabelsGroup.append("text")	
//     .attr("y", 0 - 40)
//     .attr("x", 0 - (height/2))
//     .attr("value", "healthcare")
//     .classed("active", true)
//     .text("Lacks Healthcare(%)");

//  var obesityLabel = yLabelsGroup.append("text")	
//     .attr("y", 0 - 60)
//     .attr("x", 0 - (height/2))
//     .attr("value", "obesity")
//     .classed("inactive", true)
//     .text("Obesity(%)");

//  var smokesLabel = yLabelsGroup.append("text")	
//     .attr("y", 0 - 80)
//     .attr("x", 0 - (height/2))
//     .attr("value", "smokes")
//     .classed("inactive", true)
//     .text("Smokes(%)");




// //updateToolTip function above csv import
// var xCircleGroup = xUpdateToolTip(chosenXAxis, circleGroup);
// var xTextGroup = xUpdateToolTip(chosenXAxis, textGroup);

//  //x axis labels event listener
//  xLabelsGroup.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//    var xValue = d3.select(this).attr("value");
//       if (xValue !== chosenXAxis) {

//         // replaces chosenXAxis with value
//         chosenXAxis = xValue;
//         console.log(chosenXAxis)
//         // functions here found above csv import
 
//         // updates x scale for new data
//         xLinearScale = xScale(censusData, chosenXAxis);
//         // updates x axis with transition
//         xAxis = renderXAxes(xLinearScale, xAxis);
//        // updates circles with new x values
//         circleGroup = updateXValuesText(xCircleGroup, xLinearScale, chosenXAxis, 'cx');
//         textGroup = updateXValuesText(xTextGroup,xLinearScale,chosenXAxis, 'x');
        
//         // updates tooltips with new info
//         circleGroup = xUpdateToolTip(chosenXAxis, xCircleGroup);
//         textGroup = xUpdateToolTip(chosenXAxis, xTextGroup);

//         // changes classes to change bold text
//         if (chosenXAxis === "poverty") {
//           povertyLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           incomeLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           ageLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else if (chosenXAxis === "income"){ 
//           povertyLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           incomeLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           ageLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else {
//           povertyLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           incomeLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           ageLabel
//             .classed("active", true)
//             .classed("inactive", false);
//         }
//       }
// });

// var yCircleGroup = yUpdateToolTip(chosenYAxis, circleGroup);
// var yTextGroup = xUpdateToolTip(chosenXAxis, textGroup);

// yLabelsGroup.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//    var yValue = d3.select(this).attr("value");
//       if (yValue !== chosenYAxis) {

//         // replaces chosenYAxis with value
//         chosenYAxis = yValue;

//         console.log(chosenYAxis)
       
//         // functions here found above csv import
        
//         // updates y scale for new data
//         yLinearScale = yScale(censusData, chosenYAxis);

//         // updates y axis with transition
//         yAxis = renderYAxes(yLinearScale, yAxis);

//         // updates circles with new y values
//         circleGroup = updateYValuesText(yCircleGroup, yLinearScale, chosenYAxis, 'cy');
//         textGroup = updateYValuesText(yTextGroup, yLinearScale, chosenYAxis, 'y');

//         // updates tooltips with new info
//         circleGroup = yUpdateToolTip(chosenYAxis, yCircleGroup);
//         textGroup = yUpdateToolTip(chosenYAxis, yTextGroup);

//         // changes classes to change bold text
//         if (chosenYAxis === "healthcare") {
//           healthcareLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           smokesLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           obesityLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else if (chosenYAxis === "smokes") {
//           healthcareLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           smokesLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           obesityLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else  {
//           healthcareLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           smokesLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           obesityLabel
//             .classed("active", true)
//             .classed("inactive", false);
//         		}
//       		}
//     });
// });












