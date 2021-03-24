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

  