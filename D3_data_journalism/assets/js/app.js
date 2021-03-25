// @TODO: YOUR CODE HERE!
//Initialize variables for svg

var svgWidth = 800;
var svgHeight = 550;

// Initialize margin varible
var margin ={
    top: 20,
    bottom: 50,
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
  .attr("height", svgHeight +55);

//Append an SVG group
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

//Axis selection
var selectXAxis = "age";
var selectYAxis = "healthcare";

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
    var leftAxis = d3.axisLeft(NewYscale);

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
        .attr("cy", d=> NewYscale(d[selectYAxis]))
        .attr("dy", d=> NewYscale(d[selectYAxis])+4);

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
    if (selectYAxis === "healthcare"){
        label_Y = "Healthcare";
    }
    else if (selectYAxis === "smokes"){
        label_Y = "Smokes";
    }
    else {
        label_Y ="poverty";
    }
// X Axis tool tip 
    if (selectXAxis === "age"){
        label_X = "Age ";
    }
    else if (selectXAxis === "income"){
        label_X = "Income ";
    }
    else {
        label_X ="Obesity ";
    }

    // got some errors for my tool tip but was not able to resolve
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -55])
        .style("color", "black")
        .style("background", 'grey')

        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .html(function(d){
            // state for full name or abbr for abbrebiated state
            return(`${d.state}<br>${label_X} ${d[selectXAxis]} <br>${label_Y} ${d[selectYAxis]} `);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(dataj){  
        toolTip.show(dataj);
    }).on("mouseout", function(dataj, i){
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
        //x
        datacsv.age = +datacsv.age;
        datacsv.income = +datacsv.income;
        datacsv.obesity = +datacsv.obesity;
        //y
        datacsv.healthcare = +datacsv.healthcare;
        datacsv.smokes = +datacsv.smokes;
        datacsv.poverty = +datacsv.poverty;
        
    });

    var xLinearScale = xScale(dataj, selectXAxis);
    var yLinearScale = yScale(dataj, selectYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

     // append x axis
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${Height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis= chartGroup.append("g")
        .call(leftAxis); 

    var circlesGrp = chartGroup.selectAll("circle")
        .data(dataj)
        .enter()
        .append("g")
        
    
    var circles = circlesGrp.append("circle")
        .attr("cx", d => xLinearScale(d[selectXAxis]))
        .attr("cy", d => yLinearScale(d[selectYAxis]))
        .attr("r", "15")
        .attr("fill","blue")
        .attr("opacity", ".5");
    

    var circlesGrpTxt = circlesGrp.append("text")
        .text(d=> d.abbr) //abbribiated state
        .attr("dx", d=> xLinearScale(d[selectXAxis])-10)
        .attr("dy", d=> yLinearScale(d[selectYAxis])+(4));
        
        
    // X axis general Label selector
    var xAxis_lblGrp = chartGroup.append("g")
        //.append("text")
        .attr("transform", `translate(${Width / 2}, ${Height + 10})`) ;
        

    // X Alternations
    var Agelbl = xAxis_lblGrp.append("text")
        .attr("x",0)
        .attr("y",15)
        .attr("value", "age")
        .text("Age %");
        //.text("Income by age");

    var incomelbl = xAxis_lblGrp.append("text")
        .attr("x",0)
        .attr("y",35)
        .attr("value", "income")
        .text("Income $");

    var obesitylbl = xAxis_lblGrp.append("text")
        .attr("x",0)
        .attr("y",55)
        .attr("value", "obesity")
        .text("Obesity");
        
    
    // Y axis general label selector
    var yAxis_lblGrp = chartGroup.append("g")
        //.append("text")
        .attr("transform", "rotate(-90)");
    
    // Y Alternations
    var healthcarelbl = yAxis_lblGrp.append("text")
        .attr("x",-(Height/2))
        .attr("y",-70)
        .attr("dy","1em") //1em is equal to 12pt. 
        .attr("value", "healthcare")
        .text("Healthcare");
        
    
    var smokeslbl = yAxis_lblGrp.append("text")
        .attr("y",-55)
        .attr("x",-(Height/2))
        .attr("dy","1em")
        .attr("value", "smokes")
        .text("smokes");
    
    var povertylbl = yAxis_lblGrp.append("text")
        .attr("y",-35)    
        .attr("x",-(Height/2))
        .attr("dy","1em")
        .attr("value", "poverty")
        .text("Poverty");
        
    
    circlesGrp = upToolTip(selectXAxis, selectYAxis, circlesGrp);

    // X-axis event
    xAxis_lblGrp.selectAll("text").on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== selectXAxis) {

      // replaces chosenXAxis with value
      selectXAxis = value;
      console.log(selectXAxis) // check selection

     // updates x scale
      xLinearScale = xScale(dataj, selectXAxis);

      // updates x axis with transition
      xAxis = XrenderAxes(xLinearScale, xAxis);

      circles = XrenderCircles(circles, xLinearScale, selectXAxis);

      // updates circles with new x values
      circlesTxt = xTextUpdate(circlesGrpTxt, xLinearScale, selectXAxis);

      // updates tooltips with new info
      circlesGroupTT = upToolTip(selectXAxis, selectYAxis, circlesGrp);

        //x
        // datacsv.age 
        // datacsv.income 
        // datacsv.obesity
      
      // changes classes to change bold text
      if (selectXAxis === "age") {
        Agelbl
          .classed("active", true)
          .classed("inactive", false);
        incomelbl
          .classed("active", false)
          .classed("inactive", true);
        obesitylbl
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (selectXAxis === "income") {
        Agelbl
          .classed("active", false)
          .classed("inactive", true);
        incomelbl
          .classed("active", true)
          .classed("inactive", false);
        obesitylbl
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (selectXAxis === "obesity") {
        Agelbl
          .classed("active", false)
          .classed("inactive", true);
          incomelbl
          .classed("active", false)
          .classed("inactive", true);
        obesitylbl
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

  // The Y-axis event
  yAxis_lblGrp.selectAll("text").on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== selectYAxis) {

      // replaces chosenYAxis with value
      selectYAxis = value;
      console.log(selectYAxis) // check selection

     // updates Y scale
      yLinearScale = yScale(dataj, selectYAxis);

     yAxis = YrenderAxes(yLinearScale, yAxis);

      circles = YrenderCircles(circles, yLinearScale, selectYAxis);

      // updates circles with new x values
      circlesTxt = yTextUpdate(circlesGrpTxt, yLinearScale, selectYAxis);

      // updates tooltips with new info
      circlesGroupTT = upToolTip(selectYAxis, selectYAxis, circlesGrp);

        //y
        // datacsv.healthcare
        // datacsv.smokes 
        // datacsv.poverty
      
      // changes classes to change bold text
      if (selectYAxis === "healthcare") {
        healthcarelbl
          .classed("active", true)
          .classed("inactive", false);
        smokeslbl
          .classed("active", false)
          .classed("inactive", true);
        povertylbl
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (selectXAxis === "smokes") {
        healthcarelbl
          .classed("active", false)
          .classed("inactive", true);
          smokeslbl
          .classed("active", true)
          .classed("inactive", false);
          povertylbl
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (selectXAxis === "poverty") {
        healthcarelbl
          .classed("active", false)
          .classed("inactive", true);
          smokeslbl
          .classed("active", false)
          .classed("inactive", true);
          povertylbl
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

//cought many errors isshh!
}).catch(function(error){
    console.log(error);
});