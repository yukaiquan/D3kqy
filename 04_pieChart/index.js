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
const body = d3.select('#box-div')
    .style('position', 'absolute')
    .style('margin', 'auto')
    .style('left', '50%')
    .style('top', '50%')
    .style('transform', 'translate(-50%,-50%)')

const box = body.append('svg')
    .attr('id', 'box')
    .attr('width', dms.width)
    .attr('height', dms.height)

// console.log(box);
const content = box.append('g')
    .attr('id', 'content')
    .style('font-family', "'Roboto', sans-serif")
    .style('transform', `translate(${dms.width / 2}px, ${dms.height / 2}px)`)
// console.log(content);

const dounutArea = content.append('g')
    .attr('id', 'dounut-area')
    .style('dominant-baseline', 'middle')
    .style('text-anchor', 'middle')
    .style('font-weight', 'bold')




async function getData () {
    let data = await d3.csv('ACD_sfs_ann_detail.csv')
    // console.log(data)
    const totlecounts = data.reduce((acc, cur) => acc + +cur.counts, 0)
    const totlegene = 120769
    const species = 'SFS'
    // console.log(totlecounts)
    data = data.sort((a, b) => b.counts - a.counts).splice(0, 10)
    // console.log(data)
    drawDonutChart(data, totlegene, totlecounts, species)
}
getData()

const drawDonutChart = (data, totlegene, totlecounts, species) => {
    // console.log(data); 
    // Getter function
    const speciesGet = d => d.species;
    const countsGet = d => +d.counts;


    const countsColScale = d3.scaleLinear()
        .domain([0, d3.max(data, countsGet)])
        .range([d3.rgb(148, 200, 209), d3.rgb(93, 157, 216)])
        .nice()
    const speciesFontScale = d3.scaleLinear()
        .domain([0, d3.max(data, countsGet)])
        .range(['#555', d3.rgb(86, 87, 88)])
        .nice()

    const rectScale = d3.scaleLinear()
        .domain([0, totlecounts])
        .range([0, 100])
        .nice()
    // console.log(rectScale(totlecounts))
    // console.log(d3.pie()(data))
    const pieGenerator = d3.pie()
        .value(d => countsGet(d))
        .startAngle(0)
        .endAngle(Math.PI * 1.6)
        .padAngle(0.02)
    // console.log(pieGenerator(data))


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
            .style('font-weight', 'bold')
            .style('text-anchor', anchor)
            .style('fill', `${speciesFontScale(countsGet(data[i]))}`)
    })
    const countsScale = d3.scaleLinear()
        .domain([0, totlegene])
        .range([0, 100])
    const rectArea = dounutArea.append('rect')
        .attr('id', 'rect-area')
        .attr('x', dms.chartWidth / 2)
        .attr('y', dms.chartHeight / 2)
        .attr('width', 35)
        .attr('height', 100)
        .attr('fill', 'LightGray')
        .style('transform', `rotate(-90deg) translate(-${dms.chartWidth / 2 + 15}px, -${dms.chartHeight / 2 + 50}px)`)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('stroke', 'LightGray')
        .attr('stroke-width', 5)

    const prograssRect = dounutArea.append('rect')
        .attr('id', 'rect-area')
        .attr('x', dms.chartWidth / 2)
        .attr('y', dms.chartHeight / 2)
        .attr('width', 35)
        .attr('height', countsScale(totlecounts))
        .attr('fill', d3.rgb(201, 226, 202))
        .style('transform', `rotate(-90deg) translate(-${dms.chartWidth / 2 + 15}px, -${dms.chartHeight / 2 + 50}px)`)

    const prograssText = dounutArea.append('text')
        .attr('id', 'prograss-text')
        .attr('x', dms.chartWidth / 2 + 15)
        .attr('y', dms.chartHeight / 2 + 50)
        .attr('font-size', 20)
        .attr('fill', d3.rgb(157, 96, 69))
        .text(countsScale(totlecounts).toFixed(2) + '%')
        .style('transform', `translate(-${dms.chartWidth / 2 + 15}px, -${dms.chartHeight / 2 + 50}px)`)

    const speciesText = dounutArea.append('text')
        .attr('id', 'species-text')
        .attr('x', dms.chartWidth / 2 + 15)
        .attr('y', dms.chartHeight / 2 + 85)
        .attr('font-size', 20)
        .attr('fill', d3.rgb(86, 87, 88))
        .text(species)
        .style('transform', `translate(-${dms.chartWidth / 2 + 15}px, -${dms.chartHeight / 2 + 50}px)`)

    const totleText = dounutArea.append('text')
        .attr('id', 'totle-text')
        .attr('x', dms.chartWidth / 2 + 15)
        .attr('y', dms.chartHeight / 2 + 110)
        .attr('font-size', 16)
        .attr('fill', d3.rgb(157, 96, 69))
        .text(totlecounts + '/' + totlegene)
        .style('transform', `translate(-${dms.chartWidth / 2 + 15}px, -${dms.chartHeight / 2 + 50}px)`)


}
d3.select("body").append("button")
    .attr("type", "button")
    .attr("class", "downloadButton")
    .text("Download SVG")
    .on("click", function () {
        // download the svg
        downloadSVG();
    });
