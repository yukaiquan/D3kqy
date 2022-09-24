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
    .style('transform', `translate(${dms.width / 2}px, ${dms.height / 2}px)`)
// console.log(content);

const dounutArea = content.append('g')
    .attr('id', 'dounut-area')

const rectArea = content.append('rect')
    .attr('id', 'rect-area')

async function getData () {
    let data = await d3.csv('ACD_sfs_ann_detail.csv')
    // console.log(data)
    const totlecounts = data.reduce((acc, cur) => acc + +cur.counts, 0)
    const species = 'SFS'
    // console.log(totlecounts)
    data = data.sort((a, b) => b.counts - a.counts).splice(0, 10)
    // console.log(data)
    drawDonutChart(data, totlecounts, species)
}
getData()

const drawDonutChart = (data, totlecounts, species) => {
    // console.log(data); 
    // Getter function
    const speciesGet = d => d.species;
    const countsGet = d => +d.counts;

    const countsColScale = d3.scaleLinear()
        .domain([0, d3.max(data, countsGet)])
        .range([d3.rgb(221, 157, 156), d3.rgb(196, 34, 98)])
        .nice()
    const speciesFontScale = d3.scaleLinear()
        .domain([0, d3.max(data, countsGet)])
        .range(['#555', d3.rgb(86, 87, 88)])
        .nice()

    const rectScale = d3.scaleLinear()
        .domain([0, totlecounts])
        .range([0, 100])
        .nice()

    // console.log(d3.pie()(data))
    const pieGenerator = d3.pie()
        .value(d => countsGet(d))
        .startAngle(0)
        .endAngle(Math.PI * 1.6)
        .padAngle(0.02)
    // console.log(pieGenerator(data))
    const barplot = rectArea.selectAll('rect')
        .data(rectScale(totlecounts))
        .join('rect')
        .attr('x', dms.chartWidth / 2)
        .attr('y', dms.chartHeight / 2)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', 'red')

    const arcGenerator = d3.arc()
        .outerRadius(dms.chartWidth / 2 * 0.8)
        .innerRadius(dms.chartWidth / 2 * 0.5)
        // .innerRadius(0)
        .cornerRadius(5)

    const dountChart = dounutArea.selectAll('path')
        .data(pieGenerator(data))
        .join('path')
        .attr('d', d => arcGenerator(d))
        .attr('fill', d => countsColScale(d.value))
    // console.log(dountChart)

    const pieChart = pieGenerator(data).forEach((d, i) => {
        // 取x坐标
        const x = arcGenerator.centroid(d)[0]
        // 取y坐标
        const y = arcGenerator.centroid(d)[1] * 1.2
        const anchor = Math.abs(x) < 50 ? 'middle' : x > 0 ? 'start' : 'end'
        dounutArea.append('text')
            .attr('x', x)
            .attr('y', y)
            .text(speciesGet(data[i]) + ' ' + countsGet(data[i]))
            .style('font-size', '10px')
            .style('text-anchor', anchor)
            .style('fill', `${speciesFontScale(countsGet(data[i]))}`)
    })
}
