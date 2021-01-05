// // get the data
// Harry,Sally,1.2
// Harry,Mario,1.3
// Sarah,Alice,0.2
// Eveie,Alice,0.5
// Peter,Alice,1.6
// Mario,Alice,0.4
// James,Alice,0.6
// Harry,Carol,0.7
// Harry,Nicky,0.8
// Bobby,Frank,0.8
// Alice,Mario,0.7
// Harry,Lynne,0.5
// Sarah,James,1.9
// Roger,James,1.1
// Maddy,James,0.3
// Sonny,Roger,0.5
// James,Roger,1.5
// Alice,Peter,1.1
// Johan,Peter,1.6
// Alice,Eveie,0.5
// Harry,Eveie,0.1
// Eveie,Harry,2.0
// Henry,Mikey,0.4
// Elric,Mikey,0.6
// James,Sarah,1.5
// Alice,Sarah,0.6
// James,Maddy,0.5
// Peter,Johan,0.7

// http://www.d3noob.org/2013/03/d3js-force-directed-graph-example-basic.html

// data has the structure {source: "", target: "", value: ""}

function drawForceDirectedGraph(links) {

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] ||
            (nodes[link.source] = { name: link.source });
        link.target = nodes[link.target] ||
            (nodes[link.target] = { name: link.target });
        link.value = +link.value;
    });

    var width = 960,
        height = 500;

    var force = d3v3.layout.force()
        .nodes(d3v3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(60)
        .charge(-300)
        .on("tick", tick)
        .start();

    var svg = d3v3.select("#force_directed_graph_div").append("svg")
        .attr("width", width)
        .attr("height", height);

    // build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("marker-end", "url(#end)");

    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    // add the nodes
    node.append("circle")
        .attr("r", 5);

    // add the text 
    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function (d) { return d.name; });

    // add the curvy lines
    function tick() {
        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }
}