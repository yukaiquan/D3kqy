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
    const sAccessor = d => d.dewPoint
    const yAccessor = d => d.humidity
    // console.log(yAccessor(data[0]));
    // const arr = [1, 2, 3, 4, null]
    // console.log({
    //     d3: d3.min(arr),
    //     Math: Math.min(...arr)
    // })


}
drawScatter()

