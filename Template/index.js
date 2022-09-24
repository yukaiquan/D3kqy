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
const box = d3.select('#box-div').append('svg')
    .attr('id', 'box')
    .attr('width', dms.width)
    .attr('height', dms.height)
// console.log(box);
const content = box.append('g')
    .attr('id', 'content')
    .style('transform', `translate(${dms.margin.left}px, ${dms.margin.top}px)`)
// console.log(content);


