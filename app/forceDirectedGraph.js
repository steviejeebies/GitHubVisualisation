// https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8

function drawForceDirectedGraph(linksIn, nodesIn) {
    let graph = {links: linksIn, nodes: nodesIn}

    d3v4.select("#force_directed_graph_div")
        .append("svg")
        .attr("id", "fdg")
        .attr("width", 960)
        .attr("height", 600)

    var svg = d3v4.select("#fdg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var color = d3v4.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3v4.forceSimulation()
        .force("link", d3v4.forceLink().id(function (d) { return d.id; }))
        .force("charge", d3v4.forceManyBody())
        .force("center", d3v4.forceCenter(width / 2, height / 2));

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", 2);

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")

        var circles = node.append("circle")
        .attr("r", 5)
        .attr("fill", function (d) { return color(d.group); })
        .call(d3v4.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var lables = node.append("text")
        .text(function (d) {
            return d.id;
        })
        .attr('x', 6)
        .attr('y', 3);

    node.append("title")
        .text(function (d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    }

    function dragstarted(d) {
        if (!d3v4.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3v4.event.x;
        d.fy = d3v4.event.y;
    }

    function dragended(d) {
        if (!d3v4.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}