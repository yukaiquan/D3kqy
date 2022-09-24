// console.log(d3)

let dms = {
    width: 800,
    height: 600,
    margin: {
        top: 50,
        right: 50,
        bottom: 100,
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

const barArea = content.append('g')
    .attr('id', 'bar-area')
const yesAxis = content.append('g')
    .attr('class', 'axis')
    .style('transform', `translateY(${dms.chartHeight + 10}px)`)

const yesText = content.append('text')
    .attr('class', 'axis-label')
    .attr('x', dms.chartWidth / 2)
    .attr('y', dms.chartHeight + 40)
    .text('People Numbers')

const dayText = content.append('text')
    .attr('class', 'axis-day')
    .attr('x', -20)
    .attr('y', dms.chartHeight / 2)
    .text('Day counts')



d3.json('../data/sh_day.json').then(data => {
    barChart(data)
})

const barChart = (data) => {
    // console.log(data)
    const yesGetter = (d) => d.yes;
    const countGet = d => d.length

    const yesScale = d3.scaleLinear()
        .domain(d3.extent(data, yesGetter))
        .range([0, dms.chartWidth])
        .nice()

    const histoGram = d3.histogram()
        .domain(yesScale.domain())
        .thresholds(10) // spilt into 10 bins
        .value(yesGetter)

    // console.log(histoGram(data))
    const countScale = d3.scaleLinear()
        .domain([0, d3.max(histoGram(data), countGet)])
        .range([dms.chartHeight, 0])
        .nice()

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(histoGram(data), countGet))
        .range(['lightskyblue', 'cornflowerblue'])
        .nice()

    console.log(colorScale.domain())

    const barPadding = 4
    // console.log(countScale.domain());
    const barplot = barArea.selectAll('rect')
        .data(histoGram(data))
        .join('rect')
        .attr('x', d => yesScale(d.x0) + barPadding / 2)
        .attr('y', d => countScale(d.length))
        .attr('width', d => yesScale(d.x1) - yesScale(d.x0) - barPadding)
        .attr('height', d => dms.chartHeight - countScale(d.length))
        .style('fill', d => colorScale(d.length))

    barArea.selectAll('text')
        .data(histoGram(data).filter(d => d.length > 0))
        .join('text')
        .attr('x', d => (yesScale(d.x0) + (yesScale(d.x1) - barPadding)) / 2)
        .attr('y', d => countScale(d.length) - 15)
        .text(d => d.length)

    const yesAxisGenerator = d3.axisBottom(yesScale)
    yesAxis.call(yesAxisGenerator)



}

