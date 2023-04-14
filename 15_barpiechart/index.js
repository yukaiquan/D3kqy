// 获取用户的宽和高
let width = document.documentElement.clientWidth;
let height = document.documentElement.clientHeight;

// 控制画布周边的空白
const padding = { left: 80, right: 80, top: 50, bottom: 80 };
// 绘图区域的宽和高
const chartWidth = width - padding.left - padding.right;
const chartHeight = height - padding.top - padding.bottom;

// 选择id为app的元素
let app = d3.select('#app');

// 创建svg元素
let svg = app.append('svg')
    .attr('width', width)
    .attr('height', height);

//读取数据
d3.csv('inputdata.csv').then(function (data) {
    console.log(data);
    drawBar(data);
});

// 利用数据中的orthogroups containing species字段绘制柱形图
// 绘图函数
const drawBar = (data) => {
    // 获取数据中的orthogroups containing species字段
    let genes = data.map((d) => {
        return d['orthogroups containing species'];
    });
    // 获取数据中的Genome Name字段
    let genomeName = data.map((d) => {
        return d['Genome Name'];
    });
    // 定义比例尺
    let xScale = d3.scaleBand()
        .domain(genomeName)
        .range([0, chartWidth])
        .padding(0.1);


    let yScale = d3.scaleLinear()
        .domain([0, d3.max(genes)])
        .range([chartHeight, 0])
        .nice();
    // 绘制柱形图
    let rect = svg.selectAll('rect')
        .data(genes)
        .enter()
        .append('rect')
        .attr('x', (d, i) => {
            return xScale(genomeName[i]) + padding.left;
        })
        .attr('y', (d) => {
            return yScale(d) + padding.top;
        })
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => {
            return chartHeight - yScale(d);
        })
        .attr('fill', '#ff7f0e');

    // 绘制x轴
    let xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('transform', `translate(${padding.left}, ${chartHeight + padding.top})`)
        .call(xAxis);

    // 绘制y轴
    let yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('transform', `translate(${padding.left}, ${padding.top})`)
        .call(yAxis);


};


