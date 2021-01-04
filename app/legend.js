function drawLegend(legendValues, legendDivElementName) {
    

    // select the svg area
    let legendSVG = d3v4.select(legendDivElementName)

    // create a list of keys
    let keys = Object.keys(legendValues)
    let colors = Object.values(legendValues)

    // Usually you have a color scale in your chart already
    var color = d3v4.scaleOrdinal()
        .domain(keys)
        .range(colors);

    // Add one dot in the legend for each name.
    var legendSize = 20;
    legendSVG.selectAll("mydots")
    .data(keys)
    .enter()
    .append("rect")
        .attr("x", 100)
        .attr("y", function(d,i){ return 100 + i*(legendSize+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", legendSize)
        .attr("height", legendSize)
        .style("fill", function(d){ return color(d)})

    // Add one dot in the legend for each name.
    legendSVG.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", 100 + legendSize*1.2)
        .attr("y", function(d,i){ return 100 + i*(legendSize+5) + (legendSize/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
}