

async function drawScatter () {
    const data = await d3.json('../data/my_weather_data.json')


    const drawHistogram = (metric) => {

        // console.log(d3)
        let width = window.innerWidth * 0.9;
        let dms = {
            width: width,
            height: width * 0.6,
            margin: {
                top: 50,
                right: 10,
                bottom: 50,
                left: 50
            }
        }

        // define the chart size
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
        const xAccessor = d => d[metric]
        const yAccessor = d => d.length
        // const yAccessor = d => d.humidity
        // console.log(xAccessor(data[0]))

        // create scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, xAccessor))
            .range([0, dms.chartWidth])
            .nice()
        // console.log(xScale.domain())
        const binsGenerator = d3.histogram()
            .domain(xScale.domain())
            .value(xAccessor)
            .thresholds(12)
        const bins = binsGenerator(data)
        // console.log(bins)
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, yAccessor)])
            .range([dms.chartHeight, 0])
            .nice()
        const binGroup = bounds.append('g')
        // console.log(bins)
        const binGroups = binGroup.selectAll('g')
            .data(bins)
            .join('g')

        const barPadding = 1
        const barRects = binGroups.append('rect')
            .attr('x', d => xScale(d.x0) + barPadding / 2)
            .attr('y', d => yScale(yAccessor(d)))
            .attr('width', d => d3.max([
                0,
                xScale(d.x1) - xScale(d.x0) - barPadding
            ]))
            .attr('height', d => dms.chartHeight - yScale(yAccessor(d)))
            .attr('fill', 'cornflowerblue')
        const barText = binGroups.filter(yAccessor)
            .append('text')
            .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
            .attr('y', d => yScale(yAccessor(d)) - 10)
            .text(yAccessor)
            .style('text-anchor', 'middle')
            .attr('fill', 'darkgrey')
            .style('font-size', '12px')
            .style('font-family', 'sans-serif')

        const mean = d3.mean(data, xAccessor)
        // console.log(mean)
        const meanLine = bounds.append('line')
            .attr('x1', xScale(mean))
            .attr('x2', xScale(mean))
            .attr('y1', -15)
            .attr('y2', dms.chartHeight)
            .attr('stroke', 'maroon')
            .attr('stroke-dasharray', '2px 4px')
        const meanLabel = bounds.append('text')
            .attr('x', xScale(mean))
            .attr('y', -20)
            .text('mean')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', 'maroon')
            .style('font-family', 'sans-serif')

        const xAxisGenerator = d3.axisBottom()
            .scale(xScale)
        const xAxis = bounds.append('g')
            .call(xAxisGenerator)
            .style('transform', `translateY(${dms.chartHeight}px)`)
            .style('font-size', '12px')
        const xAxisLabel = xAxis.append('text')
            .attr('x', dms.chartWidth / 2)
            .attr('y', dms.margin.bottom - 10)
            .attr('fill', 'black')
            .style('font-size', '1.4em')
            .text(metric)
    }

    const metrics = [
        'dewPoint',
        'humidity',
        'windSpeed',
        'uvIndex',
        'windBearing',
        'visibility',
        'temperatureMax',
        'temperatureMin'
    ]
    drawHistogram(metrics[1])

}
drawScatter()

