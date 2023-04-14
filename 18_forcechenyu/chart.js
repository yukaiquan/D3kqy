const color = d3.scaleOrdinal(d3.schemeTableau10);
const creatChart = (SVGAElement, hanleClickNode) => {
    const svg = d3.select(SVGAElement);
    // 所有的节点都放在这个g里面，这样可以方便的拖动整个画布
    const zoomer = svg.select('#zoomer');

    const simulation = d3.forceSimulation()
        // 加大节点间排斥力
        .force("charge", d3.forceManyBody().strength(-3000))
        //增加连接线间的长度
        .force("link", d3.forceLink().id(d => d.id).distance(300))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .on("tick", ticked);

    let link = zoomer.append("g")
        .attr("stroke", "#999")
        .attr("stroke-width", 1.5)
        .selectAll("line");

    let node = zoomer.append("g").selectAll("g");

    // ticked() 是每次渲染时都会调用的函数 用于更新节点和连线的位置
    function ticked () {
        node.attr('transform', d => `translate(${d.x}, ${d.y})`);

        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    }
    function drag () {
        function dragstarted (event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = null;
            d.fy = null;
        }
        function dragged (event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended (event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
    }


    return Object.assign(svg.node(), {
        update ({ nodes, links }) {

            // Make a shallow copy to protect against mutation, while
            // recycling old nodes to preserve position and velocity.
            const old = new Map(node.data().map(d => [d.id, d]));
            nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
            links = links.map(d => Object.assign({}, d));

            simulation.nodes(nodes);
            simulation.force("link").links(links);
            simulation.alpha(1).restart();

            node = node
                .data(nodes, d => d.id)
                .join(enter => {
                    return enter.append(d => {
                        console.log('d', d);
                        const node = document.querySelector('#node-template').content.firstElementChild.querySelector('.node').cloneNode(true);
                        // console.log('node', node);
                        const text = node.querySelector('text');
                        text.textContent = d.id;
                        const circle = node.querySelector('circle');
                        circle.style.fill = color(d.id);
                        circle.style.r = d.id.length * 14;
                        const isFirstNode = d.index === 0;
                        if (isFirstNode) {
                            node.classList.add('first-node');
                        }
                        // console.log('node', node);
                        return node;
                    })
                })
                .on('click', hanleClickNode)
                // 让节点可以拖动
                .call(drag());

            link = link
                .data(links, d => `${d.source.id}\t${d.target.id}`)
                .join("line")
                .attr("marker-end", "url(#arrow)");
        }
    });
}