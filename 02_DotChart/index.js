// console.log(d3)

let dms = {
    width: 800,
    height: 800,
    margin: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    }
}

// 定义画布
dms.chartWidth = dms.width - dms.margin.left - dms.margin.right;
dms.chartHeight = dms.height - dms.margin.top - dms.margin.bottom;

// console.log(dms);
const box = d3.select('#box-div').append('svg')
    .attr('id', 'box')
    .attr('width', dms.width)
    .attr('height', dms.height)
// console.log(box);
const content = box.append('g')
    .attr('id', 'content')
    .style('transform', `translate(${dms.margin.left}px, ${dms.margin.top}px)`)
// console.log(content);



const dotArea = content.append('g')
    .attr('id', 'dot-area')

const yesAxis = content.append('g')
    .attr('class', 'axis')
    .style('transform', `translate(0, ${dms.chartHeight}px)`)

const noAxis = content.append('g')
    .attr('class', 'axis')

const xyline = content.append('line')
    .attr('id', 'xy-line')
    .attr('x1', 50)
    .attr('y1', dms.chartHeight - 50)
    .attr('x2', dms.chartWidth - 50)
    .attr('y2', 50)

d3.json('../data/sh_day.json').then(data => {
    drawDotChart(data)
})

const drawDotChart = (dataset) => {
    // console.log(dataset);
    // function
    const yesGet = d => d.yes
    const noGet = d => d.no

    const yesScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yesGet))
        .range([0, dms.chartWidth])
        .nice()

    const noScale = d3.scaleLinear()
        .domain(d3.extent(dataset, noGet))
        .range([dms.chartHeight, 0])
        .nice()

    dotArea.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => yesScale(yesGet(d)))
        .attr('cy', d => noScale(noGet(d)))
        .attr('r', 5)

    const yesAxisGenerator = d3.axisBottom(yesScale)
        .ticks(5)

    yesAxis.call(yesAxisGenerator)

    const noAxisGenerator = d3.axisLeft(noScale)
        .ticks(5)

    noAxis.call(noAxisGenerator)

    noAxis.append('text')
        .attr('class', 'title')
        .attr('x', 0)
        .attr('y', -10)
        .text('No peple numbers')

}

