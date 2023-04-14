

async function drawScatter () {
    // const data = await d3.json('../data/my_weather_data.json')
    const data = await d3.csv('all_gene_PF_counts.csv')
    console.log(data)


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
        // const xAccessor = d => d[metric]
        const xAccessor = d => d['num']
        const yAccessor = d => d.length
        // const yAccessor = d => d.humidity
        console.log(xAccessor(data[0]))
        console.log(yAccessor(data))

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
        console.log(bins)
        // 写出bins的数据到csv文件
        const csvContent = "data:text/csv;charset=utf-8," + bins.map((e, i) => i + "\t" + e.length).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        link.innerHTML = "Download CSV";
        document.body.appendChild(link); // Required for FF


        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, yAccessor)])
            .range([dms.chartHeight, 0])
            .nice()
        const binGroup = bounds.append('g')
        // console.log(bins)
        const binGroups = binGroup.selectAll('g')
            .data(bins)
            .join('g')

        const barPadding = 0
        const barRects = binGroups.append('rect')
            .attr('x', d => xScale(d.x0) + barPadding / 2)
            // .attr('x', d => xScale(xAccessor(d.x0)))
            .attr('y', d => yScale(yAccessor(d)))
            // .attr('width', d => d3.max([
            //     0,
            //     xScale(d.x1) - xScale(d.x0) - barPadding
            // ]))
            .attr('width', 50)
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
        // const meanLine = bounds.append('line')
        //     .attr('x1', xScale(mean))
        //     .attr('x2', xScale(mean))
        //     .attr('y1', -15)
        //     .attr('y2', dms.chartHeight)
        //     .attr('stroke', 'maroon')
        //     .attr('stroke-dasharray', '2px 4px')
        // const meanLabel = bounds.append('text')
        //     .attr('x', xScale(mean))
        //     .attr('y', -20)
        //     .text('mean')
        //     .style('text-anchor', 'middle')
        //     .style('font-size', '12px')
        //     .style('fill', 'maroon')
        //     .style('font-family', 'sans-serif')
        // 定义X轴比例尺 将刻度在直方图的中间
        const xAxisScale = d3.scaleLinear()
            .domain(xScale.domain())
            .range([0, dms.chartWidth])

        const xAxisGenerator = d3.axisBottom()
            .scale(xAxisScale)
        // 加长X轴
        // .ticks(12)

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

