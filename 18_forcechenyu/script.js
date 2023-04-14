// DOM
const graph = document.querySelector("#graph");
const translater = document.querySelector("#translater");
const zoomer = document.querySelector("#zoomer");


const setGraphSize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    graph.setAttribute("width", width)
    graph.setAttribute("height", height)
    graph.setAttribute("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)

}

setGraphSize();
window.addEventListener("resize", setGraphSize)



//成语接龙核心代码
const data = {
    nodes: [],
    links: []
}
const chart = creatChart(document.querySelector("#graph"), (e, dataItem) => {
    console.log(e, dataItem);
    currentIdiom = dataItem.id;
    findNextIdiom();
});

// 取随机整数 包含最小值，不包含最大值
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
// 绘制第一个成语节点
// console.log(idioms);
const drawFirstIdiom = () => {
    const currentIdiom = idioms[getRandomInt(0, idioms.length)];
    console.log(currentIdiom);
    data.nodes.push({ id: currentIdiom });
    chart.update(data);
    return currentIdiom;
}
let currentIdiom = drawFirstIdiom();

// 寻找当前成语最后一个字的下一个成语
const findNextIdiom = () => {
    // 当前成语最后一个字
    const lastChar = currentIdiom[currentIdiom.length - 1];
    // console.log(lastChar);
    // 找到所有以lastChar开头的成语
    const matches = idioms.filter(idiom => idiom[0] === lastChar);
    // console.log(matches);
    if (matches.length <= 0) {
        alert(`没有以${lastChar}开头的成语了`);
        return;
    }
    let match;
    for (const m of matches) {
        if (data.nodes.find(node => node.id === m)) {
            // 如果已经存在，就跳过
            continue;
        }
        match = m;
    }
    if (!match) {
        alert(`没有以${lastChar}开头的成语了`);
        return;
    }
    // console.log(match);
    data.nodes.push({ id: match });
    data.links.push({ source: currentIdiom, target: match });
    chart.update(data);
}


// 画布的移动和缩放
let startPoints = {
    x: 0,
    y: 0
}
// 画布移动的距离
let translate = {
    x: 0,
    y: 0
}
// 画布上一次停止移动的位置
let lastTranslate = {
    x: 0,
    y: 0
}
// 画布缩放的比例
let scale = 1;
function handelMouseDown (e) {
    const { clientX, clientY } = e;
    startPoints = {
        x: clientX,
        y: clientY
    }
    graph.addEventListener("mousemove", handelMouseMove);
}
function handelMouseMove (e) {
    const { clientX, clientY } = e;
    const deltaX = clientX - startPoints.x;
    const deltaY = clientY - startPoints.y;
    translate = {
        x: lastTranslate.x + deltaX,
        y: lastTranslate.y + deltaY
    }
    translater.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
}
function handelMouseUp (e) {
    lastTranslate = translate;
    graph.removeEventListener("mousemove", handelMouseMove);
}
function handelWheel (e) {
    const { deltaY } = e;
    const direction = deltaY < 0 ? 1 : -1;
    scale += direction * 0.1;
    // console.log(scale);
    if (scale < 0.1) {
        // 最大缩放比例为0.1
        scale = 0.1;
    } else {
        // 缩放倍数保留两位小数
        scale = Number(scale.toFixed(2));
    }
    zoomer.style.transform = `scale(${scale})`;
}
graph.addEventListener("mousedown", handelMouseDown);
graph.addEventListener("mouseup", handelMouseUp);
graph.addEventListener("wheel", handelWheel);

// chart.update({
//     nodes: [
//         { id: "A" },
//         { id: "B" },
//         { id: "C" },
//     ],
//     links: []
// })

// setTimeout(() => {
//     chart.update({
//         nodes: [
//             { id: "A" },
//             { id: "B" },
//             { id: "C" },
//         ],
//         links: [
//             { source: "A", target: "B" },
//             { source: "B", target: "C" },
//             { source: "C", target: "A" },
//         ]
//     })
// }, 1000)

// setTimeout(() => {
//     chart.update({
//         nodes: [
//             { id: "A" },
//             { id: "B" },
//         ],
//         links: [
//             { source: "A", target: "B" },
//         ]
//     })
// }, 2000)