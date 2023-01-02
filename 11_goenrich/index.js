
const svgname = 'goenrich-svg'
// Here we can adjust defaults for all color pickers on page:
jscolor.presets.default = {
    position: 'right',
    palette: [
        '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26',
        '#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
        '#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d',
        '#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
    ],
    //paletteCols: 12,
    //hideOnPaletteClick: true,
};
const updateColor = (el, e) => {
    const color = el.toHEXString()
    console.log(id)

}
const colorlist = [{ 'biological process': '#f74d4d' }, { 'cellular component': '#ffb510' }, { 'molecular function': '#41b7ac' }]

let dms = {
    width: 1300,
    height: 850,
    margin: {
        top: 100,
        right: 250,
        bottom: 80,
        left: 550
    }
}

// 定义画布
dms.chartWidth = dms.width - dms.margin.left - dms.margin.right;
dms.chartHeight = dms.height - dms.margin.top - dms.margin.bottom;


let tip = d3.tip().attr('class', 'd3-tip')
    .html((event, d) => {
        return `<div class="tip">
        <h3>${d.ID}</h3>
        ${d.gene.split('/').map(g => `<p>${g}</p>`).join('')}
        </div>`
    })
    // 位置
    .offset([-10, 0])



// console.log(dms);
const box = d3.select('#box-div').append('svg')
    .attr('id', svgname)
    .attr('width', dms.width)
    .attr('height', dms.height)

const colorTip = d3.select('#box-div').selectAll('div')
    .data(colorlist.map(d => Object.keys(d)[0]))
    .attr('id', d => d.replace(' ', '-'))
    .enter()
    .append('button')
    .text(d => d)
    .attr('id', d => d.replace(' ', '-'))
    .attr('class', 'jscolor')
    .attr('data-jscolor', d => {
        let color = colorlist.filter(c => Object.keys(c)[0] === d)[0]
        return `{closeButton:true, closeText:'Close me!', backgroundColor:'#333', buttonColor:'${color[d]}',onInput:'updateColor(this,event)'}`
    })
    .attr('data-current-color', d => {
        let color = colorlist.filter(c => Object.keys(c)[0] === d)[0]
        return `${color[d]}`
    })
    .style('background', d => {
        let color = colorlist.filter(c => Object.keys(c)[0] === d)[0]
        return `${color[d]}`
    })


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
        .attr('height', yScale.bandwidth() - 2.5)
        // 填充不同颜色
        .attr('fill', d => {
            let color = colorlist.filter(c => Object.keys(c)[0] === d.type)[0]
            // console.log(color[d.type])
            return `${color[d.type]}`
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
        .data(colorlist.map(d => Object.keys(d)[0]))
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
            let color = colorlist.filter(c => Object.keys(c)[0] === d)[0]
            return `${color[d]}`
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
