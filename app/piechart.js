// http://bl.ocks.org/dbuezas/9306799
// dataJSON must have structure [{label:"label", value:value}]

function drawPieChart(dataJSON) {
	var pieSvg = d3v3.select("#piechart_div")
		.append("svg")
		.append("g")

	pieSvg.append("g")
		.attr("class", "slices");
	pieSvg.append("g")
		.attr("class", "labels");
	pieSvg.append("g")
		.attr("class", "lines");

	var pie_width = 960,
		pie_height = 450,
		pie_radius = Math.min(pie_width, pie_height) / 2;

	var pie = d3v3.layout.pie()
		.sort(null)
		.value(function (d) {
			return d.value;
		});

	var arc = d3v3.svg.arc()
		.outerRadius(pie_radius * 0.8)
		.innerRadius(pie_radius * 0.4);

	var outerArc = d3v3.svg.arc()
		.innerRadius(pie_radius * 0.9)
		.outerRadius(pie_radius * 0.9);

	pieSvg.attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")");

	var key = function (d) { return d.data.label; };

	let labelNames = dataJSON.map(a => a.label);

	var color = d3v3.scale.category20()
		.domain(labelNames)
	//.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	function generateData(newData) {
		return newData.sort(function (a, b) {
			return d3v3.ascending(a.label, b.label);
		});
	}

	function randomData() {
		var labels = color.domain();
		return labels.map(function (label) {
			return { label: label, value: Math.random() }
		}).filter(function () {
			return Math.random() > .5;
		}).sort(function (a, b) {
			return d3v3.ascending(a.label, b.label);
		});
	}

	d3v3.selectAll("input[name='pie_chart_radio']").on("change", function(){
		change(generateData(this.value));
	});

	change(generateData(dataJSON));	// initialize with first data

	function mergeWithFirstEqualZero(first, second) {
		var secondSet = d3v3.set(); second.forEach(function (d) { secondSet.add(d.label); });

		var onlyFirst = first
			.filter(function (d) { return !secondSet.has(d.label) })
			.map(function (d) { return { label: d.label, value: 0 }; });
		return d3v3.merge([second, onlyFirst])
			.sort(function (a, b) {
				return d3v3.ascending(a.label, b.label);
			});
	}

	function change(data) {
		var duration = 700;
		var data0 = pieSvg.select(".slices").selectAll("path.slice")
			.data().map(function (d) { return d.data });
		if (data0.length == 0) data0 = data;
		var was = mergeWithFirstEqualZero(data, data0);
		var is = mergeWithFirstEqualZero(data0, data);

		/* ------- SLICE ARCS -------*/

		var slice = pieSvg.select(".slices").selectAll("path.slice")
			.data(pie(was), key);

		slice.enter()
			.insert("path")
			.attr("class", "slice")
			.style("fill", function (d) { return color(d.data.label); })
			.each(function (d) {
				this._current = d;
			});

		slice = pieSvg.select(".slices").selectAll("path.slice")
			.data(pie(is), key);

		slice
			.transition().duration(duration)
			.attrTween("d", function (d) {
				var interpolate = d3v3.interpolate(this._current, d);
				var _this = this;
				return function (t) {
					_this._current = interpolate(t);
					return arc(_this._current);
				};
			});

		slice = pieSvg.select(".slices").selectAll("path.slice")
			.data(pie(data), key);

		slice
			.exit().transition().delay(duration).duration(0)
			.remove();

		/* ------- TEXT LABELS -------*/

		var text = pieSvg.select(".labels").selectAll("text")
			.data(pie(was), key);

		text.enter()
			.append("text")
			.attr("dy", ".35em")
			.style("opacity", 0)
			.text(function (d) {
				return d.data.label;
			})
			.each(function (d) {
				this._current = d;
			});

		function midAngle(d) {
			return d.startAngle + (d.endAngle - d.startAngle) / 2;
		}

		text = pieSvg.select(".labels").selectAll("text")
			.data(pie(is), key);

		text.transition().duration(duration)
			.style("opacity", function (d) {
				return d.data.value == 0 ? 0 : 1;
			})
			.attrTween("transform", function (d) {
				var interpolate = d3v3.interpolate(this._current, d);
				var _this = this;
				return function (t) {
					var d2 = interpolate(t);
					_this._current = d2;
					var pos = outerArc.centroid(d2);
					pos[0] = pie_radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate(" + pos + ")";
				};
			})
			.styleTween("text-anchor", function (d) {
				var interpolate = d3v3.interpolate(this._current, d);
				return function (t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start" : "end";
				};
			});

		text = pieSvg.select(".labels").selectAll("text")
			.data(pie(data), key);

		text
			.exit().transition().delay(duration)
			.remove();

		/* ------- SLICE TO TEXT POLYLINES -------*/

		var polyline = pieSvg.select(".lines").selectAll("polyline")
			.data(pie(was), key);

		polyline.enter()
			.append("polyline")
			.style("opacity", 0)
			.each(function (d) {
				this._current = d;
			});

		polyline = pieSvg.select(".lines").selectAll("polyline")
			.data(pie(is), key);

		polyline.transition().duration(duration)
			.style("opacity", function (d) {
				return d.data.value == 0 ? 0 : .5;
			})
			.attrTween("points", function (d) {
				this._current = this._current;
				var interpolate = d3v3.interpolate(this._current, d);
				var _this = this;
				return function (t) {
					var d2 = interpolate(t);
					_this._current = d2;
					var pos = outerArc.centroid(d2);
					pos[0] = pie_radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};
			});

		polyline = pieSvg.select(".lines").selectAll("polyline")
			.data(pie(data), key);

		polyline
			.exit().transition().delay(duration)
			.remove();
	};
}