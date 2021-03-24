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
                    d3.max(dataj, d=> d[chosenXAxis]) * 1.2
    ]).range([0,Width]);

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

    var ToolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d){
            return(`${d.state}<br>${label} ${d[selectXAxis]}`);
        });

    circlesGroup.call(ToolTip);

    circlesGroup.on("mouseover", function(dataj){
        ToolTip.show(dataj);

    })
        .on("mouseout", function(dataj, index){
            ToolTip.hide(data);
        });
    return circlesGroup;
}


//read data.csv file and run all code below
d3.csv("assets/data/data.csv").then(function(dataj){
   
    console.log(dataj);
// state abbr 
// Add the state abbrebiation for chart
    stabbr = []

// MOE: margin of error
// current data set includes data on poverty,povertyMoe,age,ageMoe,
// income,incomeMoe,healthcare,healthcareLow,healthcareHigh,
// obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh
    dataj.forEach(function(datacsv){
        datacsv.age = +datacsv.age;
        datacsv.income = +datacsv.income;
   //     datacsv.obesity = +datacsv.obesity;
   //     datacsv.obesityLow = +datacsv.obesityLow;
   //     datacsv.obesityHigh = +datacsv.obesityHigh;
        stabbr.push(datacsv.abbr)
    });

    var xLinearScale = d3.scaleLinear()
        .domain([25, d3.max(dataj, x => x.age)])
        .range([0, Width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(dataj, x => x.o)])
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
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.income))
        //.attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("class", "stateCircle")
        .attr("opacity", ".5")

    circlesGroup.append("text")
        .attr("class", "stateText")
        .text(function(d){return d.stabbr})

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (Height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Avg. Obesity by State")

    chartGroup.append("text")
        .attr("transform", `translate(${Width / 2}, ${Height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Avg. Age by State");
}).catch(function(error){
    console.log(error);
});