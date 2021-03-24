// @TODO: YOUR CODE HERE!
//Initialize variables for svg

var svgWidth = 800;
var svgHeight = 450;

// Initialize margin varible
var margin ={
    top: 20,
    bottom: 60,
    right: 40,
    left: 60
};

var Width = svgWidth - margin.left - margin.right;
var Height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Append an SVG group
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

//Select xAxis text
var selectXAxis = "income";

// Update x-scale depending on the attribute
function xScale(dataj, selectXAxis){
    //create scales
    var xLinearScale = d3.scaleLinear().domain([d3.min(dataj, d=>d[selectXAxis]) * 0.8, 
                    d3.max(dataj, d=> d[selectXAxis]) * 1.2
    ]).range([0,Width]);

    console.log(xLinearScale);
    return xLinearScale;
}

// Update x-scale depending on the attribute
function yScale(dataj, selectYAxis){
    //create scales
    var yLinearScale = d3.scaleLinear().domain([d3.min(dataj, d=>d[selectYAxis]) * 0.8, 
                    d3.max(dataj, d=> d[selectYAxis]) * 1.2
    ]).range([0,Width]);
    console.log(xLinearScale);
    return xLinearScale;
}

function renderAxes(NewXscale, xAxis){
    var bottomAxis = d3.axisBottom(NewXscale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}

// render circles this function will update the circles
function renderCircles(circlesGroup, NewXscale, selectXAxis){

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d=> NewXscale(d[selectXAxis]));

    return circlesGroup;
}

// Update ToolTip Income, Obesity, healthcare
function upToolTip(selectXAxis, circlesGroup) {
    var label;
    if (selectXAxis === "income"){
        label = "Income";
    }
    else if (selectXAxis === "obesity"){
        label = "Obesity";
    }
    else {
        label ="healthcare";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0, 0])
        .html(function(d){
            return(`${d.state}<br>${label} ${d[selectXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(dataj){
        toolTip.show(dataj);

    })
        .on("mouseout", function(dataj, index){
            toolTip.hide(dataj);
        });
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
   //     datacsv.obesityHigh = +datacsv.obesityHigh;
    //    stabbr.push(datacsv.abbr)
    });

    var xLinearScale = xScale(dataj, selectXAxis);

    // var xLinearScale = d3.scaleLinear()
    //     .domain([25, d3.max(dataj, x => x.age)])
    //     .range([0, Width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(dataj, x => x.age)])
        .range([Height,0]);

     // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

     // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${Height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis); 

    var circlesGroup = chartGroup.selectAll("circle")
        .data(dataj)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[selectXAxis]))
        .attr("cy", d => yLinearScale(d.age))
        .attr("r", "15")
        .attr("class", "stateCircle")
        .attr("fill","blue")
        .attr("opacity", ".5");

    var labelsGroup = chartGroup.append("g")
        .append("text")
        .attr("transform", `translate(${Width / 2}, ${Height + 30})`)
        .text("Avg. Age by State");

    var IncomeLabel = labelsGroup.append("text")
        .attr("x",0)
        .attr("y",20)
        .attr("value", "income")
        .classed("active",true);
        //.text("Income by age");

    var ObesityLabel = labelsGroup.append("text")
        .attr("x",0)
        .attr("y",20)
        .attr("value", "obesity")
        .classed("active",true);
        //.text("obesity by age");    

    var HealthcareLabel = labelsGroup.append("text")
        .attr("x",0)
        .attr("y",20)
        .attr("value", "healthcare")
        .classed("active",true);
        //.text("healthcare by age");    

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (Height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Age by State");
    
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
      circlesGroup = updateToolTip(selectXAxis, circlesGroup);

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