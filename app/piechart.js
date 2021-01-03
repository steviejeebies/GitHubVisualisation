function drawPieChart(dataJSON) {
	var svgPie = d3v3.select("#piechart_div")
		.append("svg")
		.append("g")

	svgPie.append("g")
		.attr("class", "slices");
	svgPie.append("g")
		.attr("class", "labels");
	svgPie.append("g")
		.attr("class", "lines");

	var pie_width = 960,
		pie_height = 450,
		pie_radius = Math.min(pie_width, pie_height) / 2;

	var pie = d3v3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	var arc = d3v3.svg.arc()
		.outerRadius(pie_radius * 0.8)
		.innerRadius(pie_radius * 0.4);

	var outerArc = d3v3.svg.arc()
		.innerRadius(pie_radius * 0.9)
		.outerRadius(pie_radius * 0.9);

	svgPie.attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")");

	var key = function(d){ return d.data.label; };

	var color = d3v3.scale.ordinal()
		.domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	function randomData (){
		var labels = color.domain();
		return labels.map(function(label){
			return { label: label, value: Math.random() }
		});
	}

	change(randomData());

	d3v3.select(".randomize")
		.on("click", function(){
			change(randomData());
		});


	function change(data) {

		/* //////- PIE SLICES //////-*/
		var slice = svgPie.select(".slices").selectAll("path.slice")
			.data(pie(data), key);

		slice.enter()
			.insert("path")
			.style("fill", function(d) { return color(d.data.label); })
			.attr("class", "slice");

		slice		
			.transition().duration(1000)
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3v3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			})

		slice.exit()
			.remove();

		/* //////- TEXT LABELS //////-*/

		var text = svgPie.select(".labels").selectAll("text")
			.data(pie(data), key);

		text.enter()
			.append("text")
			.attr("dy", ".35em")
			.text(function(d) {
				return d.data.label;
			});
		
		function midAngle(d){
			return d.startAngle + (d.endAngle - d.startAngle)/2;
		}

		text.transition().duration(1000)
			.attrTween("transform", function(d) {
				this._current = this._current || d;
				var interpolate = d3v3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = pie_radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d){
				this._current = this._current || d;
				var interpolate = d3v3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			});

		text.exit()
			.remove();

		/* //////- SLICE TO TEXT POLYLINES //////-*/

		var polyline = svgPie.select(".lines").selectAll("polyline")
			.data(pie(data), key);
		
		polyline.enter()
			.append("polyline");

		polyline.transition().duration(1000)
			.attrTween("points", function(d){
				this._current = this._current || d;
				var interpolate = d3v3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = pie_radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};			
			});
		
		polyline.exit()
			.remove();
	};
}