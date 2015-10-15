// d3 test app

var $container = d3.select('.chart-section')
var _data = [4,8,15,16,23,42]

// Divs

var scale = d3.scale.linear().domain(
	[0,d3.max(_data)])
	.range([0,420])
$container.selectAll('div')
	.data(_data).enter()
		.append('div').style('width', (d) => `${scale(d)}px`)
		.text((d) => d)

// SVG
var _width = 420,
    _barHeight = 20;
var _x = d3.scale.linear()
	.domain([0, d3.max(_data)])
	.range([0, _width]);
var chart = d3.select('.chart-svg')
	.attr('width', _width)
	.attr('height', _barHeight * _data.length)
var bar = chart.selectAll('g')
	.data(_data)
	.enter().append('g')
	.attr('transform', (d,i) => `translate(0,${i*_barHeight})`)
bar.append('rect')
	.attr('width',_x)
	.attr('height',_barHeight - 1)
bar.append('text')
	.attr('x', (d) => _x(d) - 3)
	.attr('y', _barHeight / 2)
	.attr('dy', '.35em')
	.text((d) => d)

// SVG using Async loading
var width = 420,
    barHeight = 20;
var x = d3.scale.linear()
	.range([0, width]);
var chart = d3.select('.chart-async-svg')
	.attr('width', width)

d3.tsv('data/LOST.tsv', type, (error,data) => {
	console.log(data)
	x.domain([0,d3.max(data, (d) => d.value)])
	chart.attr('height', barHeight * data.length)
	var bar = chart.selectAll('g')
		.data(data)
		.enter().append('g')
		.attr('transform', (d,i) => `translate(0,${i*barHeight})`)
	bar.append('rect')
		.attr('width',(d) => x(d.value))
		.attr('height',barHeight - 1)
	bar.append('text')
		.attr('x', (d) => x(d.value) - 3)
		.attr('y', barHeight / 2)
		.attr('dy', '.35em')
		.text((d) => d.value)
})

function type(d) {
	d.value = +d.value
	return d
}
