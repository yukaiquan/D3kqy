const width = 1000
let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
        top: 30,
        right: 10,
        bottom: 50,
        left: 50,
    },
}
dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

// 3. Draw canvas

const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

// var projection = d3.geoMercator().scale(500).center([121.4648, 31.2891])
var projection = d3.geoMercator().scale(500).center([107, 33])
var path = d3.geoPath().projection(projection)
d3.json('world.geojson').then(data => {
    console.log(data)
    bounds.selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "lightgrey")
        .attr("stroke", "black")
        .on("mouseover", function (event, d) {
            // console.log(d.properties.code)
            d3.select(this)
                .transition()
                .duration(6000)
                .attr("fill", d3.rgb(255, 0, 0))
            fangkuangRemove()
            createFangkuang(wrapper, d)
        })
        .on('mousemove', function (event, d) {
            fangkuangRemove()
            createFangkuang(wrapper, d)
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition()
                .duration(6000)
                .attr("fill", "lightgrey")
            fangkuangRemove()
            createFangkuang(wrapper, d)
        })

})

//返回当前鼠标位置
function mouseXY (e) {
    var e = e || window.event;
    return { "x": e.offsetX, "y": e.offsetY };
}

//移除方框
function fangkuangRemove () {
    d3.select("#fangkuang1").remove();
    d3.select("#fangkuang2").remove();
}
//创建方框和文字
function createFangkuang (svg, d) {

    let XY = mouseXY(event);
    svg.append("rect")
        .attr("id", "fangkuang1")
        .attr("x", XY.x)
        .attr("y", XY.y)
        .attr("class", "fangkuang")
    //创建显示tooltip文本
    svg.append("text")
        .attr("id", "fangkuang2")
        .attr("x", XY.x + 40)
        .attr("y", XY.y + 30)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .text(d.properties.code)
}        
