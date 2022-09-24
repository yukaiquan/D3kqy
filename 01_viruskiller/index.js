// console.log(d3)

let dms = {
    width: 800,
    height: 600,
    margin: {
        top: 50,
        right: 100,
        bottom: 50,
        left: 100
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

const yesLine = content.append('g')
    .attr('id', 'yesLine')

const dataAxis = content.append('g')
    .attr('id', 'data-axis')
    .style('transform', `translate(0, ${dms.chartHeight}px)`)


const yesAxis = content.append('g')
    .attr('id', 'yes-axis')

const datatext = dataAxis.append('text')
    .attr('id', 'data-title')
    .attr('x', dms.chartWidth + 45)
    .attr('y', 0)
    .text('Date Time')
const yestext = yesAxis.append('text')
    .attr('id', 'yes-title')
    .attr('x', 0)
    .attr('y', -20)
    .text('People Numbers')

const laserArea = content.append('g')
    .attr('id', 'laser-area')




////////////////////////read data////////////////////////    
const read_json = d3.json('../data/sh_day.json').then(data => {
    // console.log(data);
    drawLineChart(data);
})

function drawLineChart (dataset) {
    // console.log(dataset[0]);
    const dataParse = d3.timeParse('%Y-%m-%d');
    const dataGetter = d => dataParse(d.date);
    const fangGetter = d => d.fang;
    const yiGet = d => d.yi;
    // console.log(dataGetter(dataset[0]));
    const yesGet = d => d.yes;
    // console.log(yesGet(dataset[0]));
    // x scale
    const dataScale = d3.scaleTime()
        .domain(d3.extent(dataset, dataGetter))
        .range([0, dms.chartWidth])

    // console.log(d3.extent(dataset, dataGetter));
    // console.log(dataScale.domain());
    const yesScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yesGet))
        .range([dms.chartHeight, 50])
        .nice()
    const fangScale = d3.scaleLinear()
        .domain(d3.extent(dataset, fangGetter))
        .range([0, 20])
    const yiScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yiGet))
        .range([0, dms.chartHeight / 3])

    // console.log(yesScale.domain());
    // console.log(yesScale(50));
    // content.append('circle')
    //     .attr('cx', dataScale(dataGetter(dataset[0])))
    //     .attr('cy', yesScale(yesGet(dataset[0])))
    //     .attr('r', 10)
    // content.append('circle')
    //     .attr('cx', dataScale(dataGetter(dataset[1])))
    //     .attr('cy', yesScale(yesGet(dataset[1])))
    //     .attr('r', 10)
    // for (let i = 0; i < dataset.length; i++) {
    //     content.append('circle')
    //         .attr('cx', dataScale(dataGetter(dataset[i])))
    //         .attr('cy', yesScale(yesGet(dataset[i])))
    //         .attr('r', 5)
    // }
    // dataset.forEach(d => {
    //     yesLine.append('circle')
    //         .attr('cx', dataScale(dataGetter(d)))
    //         .attr('cy', yesScale(yesGet(d)))
    //         .attr('r', 5)
    // })
    const sth = yesLine.selectAll('circle')
        .data(dataset)
        // .enter().append('circle')
        .join('circle')
        .attr('cx', d => dataScale(dataGetter(d)))
        .attr('cy', d => yesScale(yesGet(d)))
        .attr('r', 4)
    // console.log(sth);
    const lineGenerator = d3.line()
        .x(d => dataScale(dataGetter(d)))
        .y(d => yesScale(yesGet(d)))
        .curve(d3.curveNatural)

    yesLine.append('path')
        .attr('d', lineGenerator(dataset))


    // axis Y and X
    const dataAxisGenerator = d3.axisBottom()
        .scale(dataScale)
        .ticks(6, d3.timeFormat('%m-%d'))

    dataAxisGenerator(dataAxis)
    const yesAxisGenerator = d3.axisLeft()
        .scale(yesScale)
        .ticks(5)
    yesAxisGenerator(yesAxis)

    laserArea.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => dataScale(dataGetter(d)))
        .attr('cy', 0)
        .attr('r', d => fangScale(fangGetter(d)))
    laserArea.selectAll('line')
        .data(dataset)
        .join('line')
        .attr('x1', d => dataScale(dataGetter(d)))
        .attr('y1', 0)
        .attr('x2', d => dataScale(dataGetter(d)))
        .attr('y2', d => yiScale(yiGet(d)))
    laserArea.append('text')
        .attr('x', dms.chartWidth + 30)
        .attr('y', 0)
        .text('Fang')
}

