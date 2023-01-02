
const svgname = 'goenrich-svg'
let dms = {
    width: 1200,
    height: 800,
    margin: {
        top: 50,
        right: 250,
        bottom: 100,
        left: 550
    }
}

// 定义画布
dms.chartWidth = dms.width - dms.margin.left - dms.margin.right;
dms.chartHeight = dms.height - dms.margin.top - dms.margin.bottom;


let tip = d3.tip().attr('class', 'd3-tip').html(function (d) { return d; })


// console.log(dms);
const box = d3.select('#box-div').append('svg')
    .attr('id', svgname)
    .attr('width', dms.width)
    .attr('height', dms.height)


const content = box.append('g')
    .attr('id', 'content')
    .style('transform', `translate(${dms.margin.left}px, ${dms.margin.top}px)`)
    .call(tip)
// 添加图例
const legendArea = d3.select(`#${svgname}`).append('g')
    .attr('id', 'legend')
    .style('transform', `translate(${dms.chartWidth + 580}px, ${dms.chartHeight / 2}px)`)




// 读取csv文件
d3.csv('go_enrich.csv').then(data => {
    console.log(data);
    goPlot(data)
})

const goPlot = (data) => {
    // 转换文本数据为数值
    data.forEach(d => {
        d.GeneNumber = +d.GeneNumber
    })
    // 定义x轴比例尺
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.GeneNumber)])
        .range([0, dms.chartWidth])
        .nice()
    // 定义y轴比例尺
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.Description))
        .range([0, dms.chartHeight])

    // 定义x轴
    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickSize(5)
        .tickSizeOuter(5)
        .tickPadding(10)
    // 定义y轴
    const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(5)
        .tickPadding(10)
    // 刻度线向外延伸

    // 绘制x轴
    content.append('g')
        .attr('class', 'axis-x')
        .attr('transform', `translate(0, ${dms.chartHeight})`)
        .call(xAxis)
    // 绘制y轴
    content.append('g')
        .attr('class', 'axis-y')
        .call(yAxis)
    // 绘制横向柱状图
    content.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => yScale(d.Description))
        .attr('width', d => xScale(d.GeneNumber))
        .attr('height', yScale.bandwidth() - 1)
        // 填充不同颜色
        .attr('fill', d => {
            if (d.type === 'biological process') {
                return 'rgb(247,77,77)'
            } else if (d.type === 'molecular function') {
                return 'rgb(65,183,172)'
            } else {
                return 'rgb(255,165,16)'
            }
        })
        // 点击事件
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    // 去除x轴的刻度线
    d3.selectAll('.axis-x .tick line')
        .attr('stroke', '#b8c7e0a6')
    // 去除y轴的刻度线
    d3.selectAll('.axis-y .tick line')
        .attr('stroke', '#b8c7e0a6')
    // 添加边框
    content.append('rect')
        .attr('class', 'border')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', dms.chartWidth)
        .attr('height', dms.chartHeight)
        .attr('fill', 'none')
        .attr('stroke', '#b8c7e0a6')
        .attr('stroke-width', 1)


    // 顶部添加标题
    content.append('text')
        .attr('class', 'title')
        .attr('x', dms.chartWidth / 2)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .text('GO Enrichment Analysis')
        // 字体加粗
        .style('font-weight', 'bold')


    // 添加x轴的标题
    content.append('text')
        .attr('class', 'axis-title')
        .attr('x', dms.chartWidth / 2)
        .attr('y', dms.chartHeight + 50)
        .attr('text-anchor', 'middle')
        .text('Gene Number')
        // 字体加粗
        .style('font-weight', 'bold')
    // 添加y轴的标题
    content.append('text')
        .attr('class', 'axis-title')
        .attr('x', -dms.chartHeight / 2)
        .attr('y', -500)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Description')
        // 字体加粗
        .style('font-weight', 'bold')

    // 添加图例
    const legend = legendArea.selectAll('.legend')
        .data(['Biological Process', 'Cellular Component', 'Molecular Function'])
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0, ${i * 30})`)


    // 添加图例的颜色块
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', d => {
            if (d === 'Biological Process') {
                return 'rgb(247,77,77)'
            } else if (d === 'Molecular Function') {
                return 'rgb(65,183,172)'
            } else {
                return 'rgb(255,165,16)'
            }
        })
    // 添加图例的文字
    legend.append('text')
        .attr('x', 30)
        .attr('y', 15)
        .text(d => d)

}
d3.select("body").append("button")
    .attr("type", "button")
    .attr("class", "downloadButton")
    .text("Download SVG")
    .on("click", function () {
        // download the svg
        downloadSVG()
    })
d3.select("body").append("button")
    .attr("type", "button")
    .attr("class", "downloadButton")
    .text("Download PNG")
    .on("click", function () {
        saveSvgAsPng(document.getElementById(svgname), svgname.split('.')[0] + '.png', { backgroundColor: "#fff" });
    })
