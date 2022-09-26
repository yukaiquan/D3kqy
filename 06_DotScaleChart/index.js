// console.log(d3)

let dms = {
    width: window.innerWidth * 0.9,
    height: 600,
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
const wrapper = d3.select('#wrapper')
    .append('svg')
    .attr('id', 'box')
    .attr('width', dms.width)
    .attr('height', dms.height)
// console.log(box);
const bounds = wrapper.append('g')
    .attr('id', 'bounds')
    .style('transform', `translate(${dms.margin.left}px, ${dms.margin.top}px)`)
// console.log(bounds)


async function drawScatter () {
    const data = await d3.json('../data/my_weather_data.json')
    // console.log(data[0])
    const xAccessor = d => d.dewPoint
    const yAccessor = d => d.humidity
    const colorAccessor = d => d.cloudCover
    // console.log(yAccessor(data[0]));
    // const arr = [1, 2, 3, 4, null]
    // console.log({
    //     d3: d3.min(arr),
    //     Math: Math.min(...arr)
    // })
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dms.chartWidth])
        .nice()
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([dms.chartHeight, 0])
        .nice()
    const colorScale = d3.scaleLinear()
        .domain(d3.extent(data, colorAccessor))
        .range(['skyblue', 'darkslategrey'])



    const dots = bounds.selectAll('circle')
        .data(data)
    dots.join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 5)
        .attr('fill', d => colorScale(colorAccessor(d)))

    // Draw peripherals
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
        .style('transform', `translateY(${dms.chartHeight}px)`)
    const xAxisLabel = xAxis.append('text')
        .attr('x', dms.chartWidth / 2)
        .attr('y', dms.margin.bottom - 10)
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .html('Dew point (&deg;F)')
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .ticks(4)

    const yAxis = bounds.append('g')
        .call(yAxisGenerator)
    const yAxisLabel = yAxis.append('text')
        .attr('x', -dms.chartHeight / 2)
        .attr('y', -dms.margin.left + 10)
        .style("fill", "black")
        .text("Relative humidity")
        .style("transform", "rotate(-90deg)")
        .style("text-anchor", "middle")

}
drawScatter()

