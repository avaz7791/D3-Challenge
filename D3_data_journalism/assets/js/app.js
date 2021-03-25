// @TODO: YOUR CODE HERE!
//Initialize variables for svg

var svgWidth = 800;
var svgHeight = 450;

// Initialize margin varible
var margin ={
    top: 20,
    bottom: 35,
    right: 40,
    left: 80
};

var Width = svgWidth - margin.left - margin.right;
var Height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight +25);

//Append an SVG group
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

//Axis selection
var selectXAxis = "age";
var selectYAxis = "income";

// Update x-scale depending on the attribute
function xScale(dataj, selectXAxis){
    //create scales for x axis with extra room
    var xLinearScale = d3.scaleLinear().domain([d3.min(dataj, d=>d[selectXAxis]) * 0.8, 
                    d3.max(dataj, d=> d[selectXAxis]) * 1.2
    ]).range([0, Width]);

    console.log(xLinearScale);
    return xLinearScale;
}

// Update y-scale depending on the attribute
function yScale(dataj, selectYAxis){
    //create scales for y axis with extra room
    var yLinearScale = d3.scaleLinear().domain([d3.min(dataj, d=>d[selectYAxis]) * 0.8, 
                    d3.max(dataj, d=> d[selectYAxis]) * 1.2
    ]).range([Height, 0]);
    console.log(yLinearScale);
    return yLinearScale;
}


// ------------------------
//This section we will use these functions to update the X,Y Axis when they are selected. 
function XrenderAxes(NewXscale, xAxis){
    var bottomAxis = d3.axisBottom(NewXscale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}
function YrenderAxes(NewYscale, yAxis){
    var leftAxis = d3.axisBottom(NewYscale);

    yAxis.transition()
    .duration(1000)
    .call(leftAxis);

    return yAxis;
}
//------------------------

// render circles this function will update the circles
function XrenderCircles(circlesGroup, NewXscale, selectXAxis){

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d=> NewXscale(d[selectXAxis]))
        .attr("dx", d=> NewXscale(d[selectXAxis]));

    return circlesGroup;
}
function YrenderCircles(circlesGroup, NewYscale, selectYAxis){

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d=> NewXscale(d[selectYAxis]))
        .attr("dy", d=> NewXscale(d[selectYAxis]));

    return circlesGroup;
}


// Update Y ToolTip Income, Obesity, healthcare
// MOE: margin of error
// current data set includes data on poverty,povertyMoe,age,ageMoe,
// income,incomeMoe,healthcare,healthcareLow,healthcareHigh,
// obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh
function upToolTip(selectXAxis,selectYAxis, circlesGroup) {

//Add logic to update the label for the axis depending on what was selected.    
    var label_X;
    var label_Y;
// Y Axis tool tip 
    if (selectYAxis === "income"){
        label_Y = "Income ";
    }
    else if (selectYAxis === "obesity"){
        label_Y = "Obesity ";
    }
    else {
        label_Y ="Smokes ";
    }
// X Axis tool tip 
    if (selectXAxis === "age"){
        label_X = "Age ";
    }
    else if (selectXAxis === "healthcare"){
        label_X = "Healthcare ";
    }
    else {
        label_X ="Poverty ";
    }


    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -55])
        .style("color", "black")
        .style("background", 'grey')
//        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .html(function(d){
            // state for full name or abbr for abbrebiated state
            return(`${d.state}<br>${label_X} ${d[selectXAxis]}%<br>${label_Y} ${d[selectYAxis]}%`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(dataj){
        toolTip.show(dataj);

    }).on("mouseout", function(dataj, index){
    // hide the box when the mouse cursor moves
            toolTip.hide(dataj);
        });
    return circlesGroup;
}

function xTextUpdate(circlesGroup, NewXscale, selectXAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("dx", d=> NewXscale(d[selectXAxis]));
    return circlesGroup;
}
function yTextUpdate(circlesGroup, NewYscale, selectYAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("dy", d=> NewYscale(d[selectYAxis]));
    return circlesGroup;
}

//read data.csv file and run all code below
d3.csv("assets/data/data.csv").then(function(dataj, err){
    if(err) throw err;
   
    console.log(dataj);
// state abbr 
// Add the state abbrebiation for chart
   // stabbr = []

// MOE: margin of error
// current data set includes data on poverty,povertyMoe,age,ageMoe,
// income,incomeMoe,healthcare,healthcareLow,healthcareHigh,
// obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh
    dataj.forEach(function(datacsv){
        datacsv.age = +datacsv.age;
        datacsv.income = +datacsv.income;
        datacsv.obesity = +datacsv.obesity;
        datacsv.healthcare = +datacsv.healthcare;
        datacsv.smokes = +datacsv.smokes;
        datacsv.poverty = +datacsv.poverty;
        
    });

    var xLinearScale = xScale(dataj, selectXAxis);
    var yLinearScale = yScale(dataj, selectYAxis);

    // var xLinearScale = d3.scaleLinear()
    //     .domain([25, d3.max(dataj, x => x.age)])
    //     .range([0, Width]);

    // var yLinearScale = d3.scaleLinear()
    //     .domain([0, d3.max(dataj, x => x.age)])
    //     .range([Height,0]);

     // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

     // append x axis
    var xAxis = chartGroup.append("g")
        //.classed("x-axis", true)
        .attr("transform", `translate(0, ${Height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis= chartGroup.append("g")
        .call(leftAxis); 

    var circlesGrp = chartGroup.selectAll("circle")
        .data(dataj)
        .enter()
        .append("g")
        // .attr("cx", d => xLinearScale(d[selectXAxis]))
        // .attr("cy", d => yLinearScale(d[selectYAxis]))
        // .attr("r", "15")
        // .attr("class", "stateCircle")
        // .attr("fill","blue")
        // .attr("opacity", ".5");
    
    var circles = circlesGrp.append("circle")
        .attr("cx", d => xLinearScale(d[selectXAxis]))
        .attr("cy", d => yLinearScale(d[selectYAxis]))
        .attr("r", "15")
        .attr("class", "stateCircle")
        .attr("fill","blue")
        .attr("opacity", ".5");
    

    var circlesGrpTxt = circlesGrp.append("text")
        .text(d=> d.abbr) //abbribiated state
        .attr("dx", d=> xLinearScale(d[selectXAxis]))
        .attr("dy", d=> yLinearScale(d[selectYAxis])+(10/3))
        .classed('stateText', true);

        // X Label
    var xAxis_lblGrp = chartGroup.append("g")
        //.append("text")
        .attr("transform", `translate(${Width / 2}, ${Height + 30})`) ;
        //.text("age");

    var Agelbl = xAxis_lblGrp.append("text")
        .attr("x",0)
        .attr("y",15)
        .attr("value", "age")
        .classed("active",true);
        //.text("Income by age");

    var Agelbl = xAxis_lblGrp.append("text")
        .attr("x",0)
        .attr("y",35)
        .attr("value", "age")
        .classed("active",true);

        var Agelbl = xAxis_lblGrp.append("text")
        .attr("x",0)
        .attr("y",15)
        .attr("value", "age")
        .classed("active",true);
    var yAxis_lblGrp = chartGroup.append("g")
        //.append("text")
        .attr("transform", "rotate(-90") ;
        //.text("age");

    var Incomelbl = yAxis_lblGrp.append("text")
        .attr("x",0)
        .attr("y",15)
        .attr("value", "income")
        .classed("active",true);
        //.text("Income by age");

    var Obesitylbl = yAxis_lblGrp.append("text")
        .attr("x",0)
        .attr("y",35)
        .attr("value", "obesity")
        .classed("active",true);
        //.text("obesity by age");    

    var Healthcarelbl = yAxis_lblGrp.append("text")
        .attr("x",0)
        .attr("y",55)
        .attr("value", "healthcare")
        .classed("active",true);
        //.text("healthcare by age");    

    // Y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (Height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("State");
    
    var circlesGroup = upToolTip(selectXAxis, circlesGroup);

    // x axis labels event listener
  labelsGroup.selectAll("text").on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== selectXAxis) {

      // replaces chosenXAxis with value
      selectXAxis = value;

        console.log(selectXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(dataj, selectXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, selectXAxis);

      // updates tooltips with new info
      circlesGroupTT = upToolTip(selectXAxis, selectYAxis, circlesGroup);

      // changes classes to change bold text
      if (selectXAxis === "income") {
        IncomeLabel
          .classed("active", true)
          .classed("inactive", false);
        ObesityLabel
          .classed("active", false)
          .classed("inactive", true);
        HealthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (selectXAxis === "obesity") {
        IncomeLabel
          .classed("active", false)
          .classed("inactive", true);
        ObesityLabel
          .classed("active", true)
          .classed("inactive", false);
        HealthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (selectXAxis === "healthcare") {
        IncomeLabel
          .classed("active", false)
          .classed("inactive", true);
        ObesityLabel
          .classed("active", false)
          .classed("inactive", true);
        HealthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });




}).catch(function(error){
    console.log(error);
});