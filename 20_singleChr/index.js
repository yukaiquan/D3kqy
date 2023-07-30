// console.log(d3)
const svgname = 'OTv2'
// const CHRLENGTH = 'bmc_ath.lenth.csv'
// const PROBE = 'probe_ath.csv'
// const CHRLENGTH = 'scau_sfs.lenth.csv'
const CHRLENGTH = 'ot3098v2_length.csv'
// const PROBE = 'sfs_blastn_plot_add_num.csv'
const PROBE = 'ot3098_blastn_plot_add_num.csv'
const SPLITE_CHAR = '%' // 分隔符
const CHR_WIDTH = 28 // 柱状图宽度
const chr_list = ['1', '2', '3', '4']
const color_list = ['rgb(118,218,145)', 'rgb(247,77,77)', 'rgb(255,165,16)', 'rgb(12,132,198)']


let dms = {
    width: 1300,
    height: 800,
    margin: {
        top: 50,
        right: 400,
        bottom: 100,
        left: 80
    }
}

// 定义画布
dms.chartWidth = dms.width - dms.margin.left - dms.margin.right;
dms.chartHeight = dms.height - dms.margin.top - dms.margin.bottom;

// console.log(dms);
const box = d3.select('#box-div').append('svg')
    .attr('id', svgname)
    .attr('width', dms.width)
    .attr('height', dms.height)

// 添加图例
const legendArea = d3.select(`#${svgname}`).append('g')
    .attr('id', 'legend')
    .style('transform', `translate(${dms.chartWidth + 100}px, ${dms.chartHeight / 2}px)`)


// console.log(box);
const content = box.append('g')
    .attr('id', 'content')
    .style('transform', `translate(${dms.margin.left}px, ${dms.margin.top}px)`)
// console.log(content);

const barArea = content.append('g')
    .attr('id', 'bar-area')

const lineArea = content.append('g')
    .attr('id', 'line-area')

// 坐标轴    
const yAxis = content.append('g')
    .attr('class', 'axis-y')
    .attr('transform', `translate(-20, 10)`)

// d3.json('chrdata.json').then(data => {
//     barChart(data)
// })
//同时读取两文件
Promise.all([
    // d3.json('chrdata.json'),
    // d3.json('density.json'),
    d3.csv(CHRLENGTH),
    //读取csv文件
    d3.csv(PROBE, d => {
        return {
            source: d.source.split(SPLITE_CHAR)[0],
            chr: d.chr,
            start: +d.start,
            end: +d.end,
            color: d.color
        }
    })
]).then(([chrdata, probe]) => {
    // console.log(chrdata)
    barChart(chrdata, probe)
})



const barChart = (data, probe) => {
    // console.log(data)
    const countGet = d => d.length
    const ypos = d => d.start

    const xScale = d3.scaleBand()
        .domain(data.map(data => data.chr))
        .range([0, dms.chartWidth - 100])
        .paddingInner(1)
        .paddingOuter(0.5)
        .round(true)

    const countScale = d3.scaleLinear()
        .domain([0, d3.max(data, countGet)])
        .range([dms.chartHeight, 0])
        .nice()

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(data, countGet))
        .range(['#b8c7e0a6'])
        .nice()
    // 图例对应关系 1:ACD 2:AD 3:C 4:CHR
    const legendScale = d3.scaleOrdinal()
        .domain(['1', '2', '3', '4'])
        .range(['ACD', 'AD', 'C', 'CHR'])

    // 设置坐标轴的映射关系    
    const densityScale = d3.scaleLinear()
        .domain(d3.extent(probe, ypos))
        .range([0, dms.chartHeight])
        .nice()
    //定义颜色比例尺
    const chrScale = d3.scaleOrdinal()
        .domain(chr_list)
        .range(color_list)

    // console.log(chrScale('chr2A'))
    // console.log(countScale.domain());
    const barplot = barArea.selectAll('rect')
        .data(data)
        .join('rect')
        // .attr('x', d => yesScale(chrHash[d.chr] - 7))
        .attr('x', d => xScale(d.chr))
        .attr('y', d => countScale(d.length))
        .attr('width', d => CHR_WIDTH)
        .attr('height', d => dms.chartHeight - countScale(d.length) + 20)
        .style('fill', d => colorScale(d.length))
        //设置圆角
        .attr('rx', 20)

    //画线条填充矩形
    lineArea.selectAll('line')
        .data(probe)
        .join('line')
        // .attr('x1', d => yesScale(chrHash[d.chr] - 7) + 3.5)
        .attr('x1', d => xScale(d.chr) + 3.5)
        .attr('y1', d => countScale(d.start) + 10)
        // .attr('x2', d => yesScale(chrHash[d.chr] - 7) + 45)
        .attr('x2', d => xScale(d.chr) + CHR_WIDTH - 3.5)
        .attr('y2', d => countScale(d.start) + 10)
        .attr('stroke', d => chrScale(d.color))
        .attr('stroke-width', 0.05)

    barArea.selectAll('text')
        .data(data.filter(d => d.length > 0))
        .join('text')
        // .attr('x', d => yesScale(d.id))
        .attr('x', d => xScale(d.chr) + 6)
        .attr('y', d => countScale(d.length) - 15)
        .text(d => d.chr)


    // 图例
    legendArea.selectAll('rect')
        .data(chr_list)
        .join('rect')
        .attr('x', (d, i) => {
            if (i < 7) {
                return 0
            } else if (i < 14) {
                return 80
            } else {
                return 160
            }
        })
        .attr('y', (d, i) => {
            if (i < 7) {
                return i * 25
            } else if (i < 14) {
                return (i - 7) * 25
            } else {
                return (i - 14) * 25
            }
        })
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', d => chrScale(d))
    legendArea.selectAll('text')
        .data(chr_list)
        .join('text')
        .attr('x', (d, i) => {
            if (i < 7) {
                return 30
            } else if (i < 14) {
                return 110
            } else {
                return 190
            }
        })
        .attr('y', (d, i) => {
            if (i < 7) {
                return i * 25 + 13
            } else if (i < 14) {
                return (i - 7) * 25 + 15
            } else {
                return (i - 14) * 25 + 15
            }
        })
        .text(d => legendScale(d))



    const yAxisCall = d3.axisLeft(countScale)
        .ticks(5)
        .tickSize(5)
        .tickFormat(d => d / 1000000 + 'M')

    yAxis.call(yAxisCall)

}
d3.select("body").append("button")
    .attr("type", "button")
    .attr("class", "downloadButton")
    .text("Download SVG")
    .on("click", function () {
        // download the svg
        saveSvg(document.getElementById(svgname), svgname.split('.')[0] + '.svg', { backgroundColor: "#fff" });
    })
d3.select("body").append("button")
    .attr("type", "button")
    .attr("class", "downloadButton")
    .text("Download PNG")
    .on("click", function () {
        saveSvgAsPng(document.getElementById(svgname), svgname.split('.')[0] + '.png', { backgroundColor: "#fff" });
    })
