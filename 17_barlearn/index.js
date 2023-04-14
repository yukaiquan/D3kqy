// 创建SVG画布
var svg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);
// 准备数据
var data = [10, 20, 30, 40, 50];
// 创建比例尺
var xScale = d3.scaleBand()
    .range([0, 400])
    .domain(data.map(function (d) { return d; }))
    .padding(0.2); // 添加间距
var yScale = d3.scaleLinear()
    .range([400, 0])
    .domain([0, d3.max(data)]);
// 创建坐标轴
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
// 添加坐标轴
svg.append("g")
    .attr("transform", "translate(50, 450)")
    .call(xAxis);
svg.append("g")
    .attr("transform", "translate(50, 50)")
    .call(yAxis);
// 创建柱状图
svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) { return xScale(d) + 50; })
    .attr("y", function (d) { return yScale(d); })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) { return 400 - yScale(d); })
    .attr("fill", "steelblue");
// 添加标签
svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("x", function (d) { return xScale(d) + xScale.bandwidth() / 2; })
    .attr("y", function (d) { return yScale(d) - 5; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(50,0)"); // 将标签向下移动一段距离
// 添加导出SVG和PNG按钮
d3.select("body")
    .append("button")
    .text("导出SVG")
    .on("click", function () {
        var svgData = svg.node().outerHTML;
        var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "chart.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
d3.select("body")
    .append("button")
    .text("导出PNG")
    .on("click", function () {
        var svgData = svg.node().outerHTML;
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var svgImage = new Image();
        svgImage.onload = function () {
            canvas.width = svgImage.width;
            canvas.height = svgImage.height;
            context.drawImage(svgImage, 0, 0);
            var pngUrl = canvas.toDataURL("image/png");
            var downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "chart.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };
        svgImage.src = "data:image/svg+xml;base64," + btoa(svgData);
    });
// 添加调节分辨率的PNG导出按钮
d3.select("body")
    .append("button")
    .text("导出PNG（调节分辨率）")
    .on("click", function () {
        var svgData = svg.node().outerHTML;
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var svgImage = new Image();
        svgImage.onload = function () {
            var width = prompt("请输入导出图片的宽度（像素）：", svgImage.width);
            var height = prompt("请输入导出图片的高度（像素）：", svgImage.height);
            canvas.width = width;
            canvas.height = height;
            context.drawImage(svgImage, 0, 0, width, height);
            var pngUrl = canvas.toDataURL("image/png");
            var downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "chart.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };
        svgImage.src = "data:image/svg+xml;base64," + btoa(svgData);
    });