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


async function getData () {
    const data = await d3.json('../data/my_weather_data.json')
    const yAccessor = d => d.temperatureMax
    const dateParser = d3.timeParse('%Y-%m-%d')
    const xAccessor = d => dateParser(d.date)
    // console.log(data);
    // return data;
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([dms.chartHeight, 0])
    // console.log(d3.extent(data, yAccessor))

    const freezingTemperaturePlacement = yScale(32)
    const freezingTemperatures = bounds.append('rect')
        .attr('x', 0)
        .attr('width', dms.chartWidth)
        .attr('y', freezingTemperaturePlacement)
        .attr('height', dms.chartHeight - freezingTemperaturePlacement)
        .attr('fill', '#e0f3f3')

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, dms.chartWidth])

    const lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))

    const line = bounds.append('path')
        .attr('d', lineGenerator(data))
        .attr('fill', 'none')
        .attr('stroke', 'cornflowerblue')
        .attr('stroke-width', 2)

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)

    const yAxis = bounds.append('g')
        .call(yAxisGenerator)
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
        .style('transform', `translateY(${dms.chartHeight}px)`)


}
getData()

