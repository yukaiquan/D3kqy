// 边界
margin = ({ top: 20, right: 1, bottom: 40, left: 40 })

height = 16

// 新建一个div
const div = d3.select("body").append("div")
    .attr("id", "box-div")

const generator = (data) => {
    // console.log(data)
    const names = ["Alaska", "Ala.", "Ark.", "Ariz.", "Calif.", "Colo.", "Conn.", "D.C.", "Del.", "Fla.", "Ga.", "Hawaii", "Iowa", "Idaho", "Ill.", "Ind.", "Kan.", "Ky.", "La.", "Mass.", "Md.", "Maine", "Mich.", "Minn.", "Mo.", "Miss.", "Mont.", "N.C.", "N.D.", "Neb.", "N.H.", "N.J.", "N.M", "Nev.", "N.Y.", "Ohio", "Okla.", "Ore.", "Pa.", "R.I.", "S.C.", "S.D.", "Tenn.", "Texas", "Utah", "Va.", "Vt.", "Wash.", "Wis.", "W.Va.", "Wyo."];
    // const data = await FileAttachment("vaccines.json").json();
    const values = [];
    const year0 = d3.min(data[0].data.values.data, d => d[0]);
    const year1 = d3.max(data[0].data.values.data, d => d[0]);
    const years = d3.range(year0, year1 + 1);
    for (const [year, i, value] of data[0].data.values.data) {
        if (value == null) continue;
        (values[i] || (values[i] = []))[year - year0] = value;
    }
    // console.log(data[0].data.chart_options.vaccine_year)
    // 1963
    console.log(years)
    return {
        values,
        names,
        years,
        year: data[0].data.chart_options.vaccine_year
    };
}
// const format = () => {
//     // console.log(d)
//     const f = d3.format(",d");
//     // console.log(f)
//     return d => isNaN(d) ? "N/A cases"
//         : d === 0 ? "0 cases"
//             : d < 1 ? "<1 case"
//                 : d < 1.5 ? "1 case"
//                     : `${f(d)} cases`;
// }


d3.json("vaccines.json").then(data => {
    const svg_node = chart(data)
    console.log(svg_node)
    // 将svg展示在页面上
    document.getElementById('box-div').appendChild(svg_node)
    // 将svg保存为图片
    // saveSvgAsPng(document.getElementById("box-div").children[0], "diagram.png", { scale: 2 });
});




function chart (raw) {
    const data = generator(raw)
    const innerHeight = height * data.names.length
    const width = window.innerWidth - 100

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.select(".domain").remove());

    const xAxis = g => g
        .call(g => g.append("g")
            .attr("transform", `translate(${(x(data.years[0] + 1) - x(data.years[0])) / 2},${margin.top})`)
            .call(d3.axisTop(x).ticks(null, "d"))
            .call(g => g.select(".domain").remove())
        )
    // .call(g => g.append("g")
    //     .attr("transform", `translate(0,${innerHeight + margin.top + 4})`)
    //     .call(d3.axisBottom(x)
    //         .tickValues([data.year])
    //         .tickFormat(x => x)
    //         .tickSize(-innerHeight - 10)
    //     )
    //     .call(g => g.select(".tick text")

    //         .clone()
    //         .attr("dy", "2em")
    //         .style("font-weight", "bold")
    //         .text("Measles vaccine introduced"))
    //     .call(g => g.select(".domain").remove()));
    // 间隔多久显示一个刻度


    // console.log(d3.interpolatePuRd(0.5))

    // const color = d3.scaleSequential([0, d3.max(data.values, d => d3.max(d))], d3.interpolatePuRd)
    // 换一种颜色
    // const color = d3.scaleSequential([0, d3.max(data.values, d => d3.max(d))], d3.interpolateYlOrRd)
    const color = d3.scaleSequential([0, d3.max(data.values, d => d3.max(d))], d3.interpolateYlGnBu)
    // console.log(color(1000))

    const y = d3.scaleBand()
        .domain(data.names)
        .rangeRound([margin.top, margin.top + innerHeight])

    const x = d3.scaleLinear()
        .domain([d3.min(data.years), d3.max(data.years) + 1])
        .rangeRound([margin.left, width - margin.right])

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, innerHeight + margin.top + margin.bottom])
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);



    svg.append("g")
        .call(xAxis);
    svg.append("g")
        .call(yAxis);

    // format 返回一个多条件的函数
    const f = d3.format(",d");
    // console.log(f)
    const format = d => isNaN(d) ? "N/A cases"
        : d === 0 ? "0 cases"
            : d < 1 ? "<1 case"
                : d < 1.5 ? "1 case"
                    : `${f(d)} cases`;
    svg.append("g")
        .selectAll("g")
        .data(data.values)
        .join("g")
        .attr("transform", (d, i) => `translate(0,${y(data.names[i])})`)
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", (d, i) => x(data.years[i]) + 1)
        .attr("width", (d, i) => x(data.years[i] + 1) - x(data.years[i]) - 1)
        .attr("height", y.bandwidth() - 1)
        .attr("fill", d => isNaN(d) ? "#eee" : d === 0 ? "#eee" : color(d))
        .append("title")
        .text((d, i) => `${format(d)} per 100,000 people in ${data.years[i]}`);

    // console.log(svg.node())
    return svg.node();
}

