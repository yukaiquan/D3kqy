const svgname = 'pieaddplot'

let dms = {
    width: 1300,
    height: 850,
    margin: {
        top: 100,
        right: 250,
        bottom: 80,
        left: 550
    }
}

// 定义画布
dms.chartWidth = dms.width - dms.margin.left - dms.margin.right;
dms.chartHeight = dms.height - dms.margin.top - dms.margin.bottom;

let tip = d3.tip().attr('class', 'd3-tip')
    .html((event, d) => {
        return `<div class="tip">
        <h3>${d.ID}</h3>
        ${d.gene.split('/').map(g => `<p>${g}</p>`).join('')}
        </div>`
    })

const box = d3.select('#box-div').append('svg')
    .attr('id', svgname)
    .attr('width', dms.width)
    .attr('height', dms.height)

const content = box.append('g')
    .attr('id', 'content')
    .style('transform', `translate(${dms.margin.left}px, ${dms.margin.top}px)`)
    .call(tip)
// 添加图例
const legendArea = d3.select(`#${svgname}`).append('g')
    .attr('id', 'legend')
    .style('transform', `translate(${dms.chartWidth + 580}px, ${dms.chartHeight / 2}px)`)

// NR	KOG	UN	GO	KEGG
// 22.21 	9.73 	15.21 	13.7725	8.435
// 22.48 	11.17 	17.23 	13.9175	8.155
// 21.74 	9.52 	15.11 	12.9875	7.18
// 16.77 	7.19 	11.47 	9.3525	5.19
// 23.21 	10.76 	16.48 	14.1125	7.5975
// 22.83 	9.53 	15.11 	12.43	6.935
// 17.03 	7.79 	12.31 	9.475	5.2375
// 21.34 	13.14 	18.20 	14.8375	9.6475
// 22.53 	10.45 	16.21 	13.785	7.695
// 19.13 	9.35 	14.63 	11.0425	6.065
// ['Sanfensan','Sang','OT3098v2','BYU209','CN108634','CN58139', 'CN58138','CN19328','Cc7277','S75']
// Cc7277
// S75
// CN19328
// CN58138
// CN58139
// CN108634
// BYU209
// OT3098v2
// Sanfensan
// Sang
// ['Cc7277','S75','CN19328','CN58138','CN58139','CN108634','BYU209','OT3098v2','Sanfensan','Sang']

// prettier-ignore
const hours = ['Cc7277', 'S75', 'CN19328', 'CN58138', 'CN58139', 'CN108634', 'BYU209', 'OT3098v2', 'Sanfensan', 'Sang']
// prettier-ignore
const days = [
    '', '', '',
    '', '', '', ''
];
// prettier-ignore
const data = [[2, 0, 22.21], [2, 1, 22.48], [2, 2, 21.74], [2, 3, 16.77], [2, 4, 23.21], [2, 5, 22.83], [2, 6, 17.03], [2, 7, 21.34], [2, 8, 22.53], [2, 9, 19.13],
[3, 0, 9.73], [3, 1, 11.17], [3, 2, 9.52], [3, 3, 7.19], [3, 4, 10.76], [3, 5, 9.53], [3, 6, 7.79], [3, 7, 13.14], [3, 8, 10.45], [3, 9, 9.35],
[4, 0, 15.21], [4, 1, 17.23], [4, 2, 15.11], [4, 3, 11.47], [4, 4, 16.48], [4, 5, 15.11], [4, 6, 12.31], [4, 7, 18.20], [4, 8, 16.21], [4, 9, 14.63],
[5, 0, 13.7725], [5, 1, 13.9175], [5, 2, 12.9875], [5, 3, 9.3525], [5, 4, 14.1125], [5, 5, 12.43], [5, 6, 9.475], [5, 7, 14.8375], [5, 8, 13.785], [5, 9, 11.0425],
[6, 0, 8.435], [6, 1, 8.155], [6, 2, 7.18], [6, 3, 5.19], [6, 4, 7.5975], [6, 5, 6.935], [6, 6, 5.2375], [6, 7, 9.6475], [6, 8, 7.695], [6, 9, 6.065]];
option = {
    title: {
        text: 'Punch Card of Github'
    },
    toolbox: {
        feature: {
            saveAsImage: { show: true }
        }
    },
    legend: {
        data: ['Punch Card'],
        left: 'right',
    },
    polar: {},
    tooltip: {
        formatter: function (params) {
            return (
                params.value[2] +
                ' commits in ' +
                hours[params.value[1]] +
                ' of ' +
                days[params.value[0]]
            );
        }
    },
    angleAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        splitLine: {
            show: true
        },
        axisLine: {
            show: false
        }
    },
    radiusAxis: {
        type: 'category',
        data: days,
        axisLine: {
            show: false
        },
        axisLabel: {
            rotate: 45
        }
    },
    series: [
        {
            name: 'Punch Card',
            type: 'scatter',
            coordinateSystem: 'polar',
            symbolSize: function (val) {
                return val[2] * 2;
            },
            data: data,
            animationDelay: function (idx) {
                return idx * 5;
            }
        }
    ]
};


// 55803	27628	266752	120769	152335	66474	108466	89995	43477	62409	47263	39885	49475
// [55803, 27628, 266752, 120769, 152335, 66474, 108466, 89995, 43477, 62409, 47263, 39885, 49475]
// 47807	24575	231854	114706	138957	61548	98402	86407	41884	54934	44659	38310	46813
// 7996	3053	34898	6063	12793	3634	8189	3588	1593	5603	2604	1575	2669
// 21141	12929	40305	32572	56406	24445	53575	31529	25626	36291	27607	24992	28386
// 1773	1345	13002	921	692	364	587	486	83	304	150	122	307
// 15138	5864	90379	2975	1630	1003	1563	1577	215	802	387	279	1070
// [47807, 24575, 231854, 114706, 138957, 61548, 98402, 86407, 41884, 54934, 44659, 38310, 46813]
// [7996, 3053, 34898, 6063, 12793, 3634, 8189, 3588, 1593, 5603, 2604, 1575, 2669]
// [21141, 12929, 40305, 32572, 56406, 24445, 53575, 31529, 25626, 36291, 27607, 24992, 28386]
// [1773, 1345, 13002, 921, 692, 364, 587, 486, 83, 304, 150, 122, 307]
// [15138, 5864, 90379, 2975, 1630, 1003, 1563, 1577, 215, 802, 387, 279, 1070]
option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['Assigned Genes', 'Gene Number']
    },
    toolbox: {
        feature: {
            saveAsImage: { show: true }
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'value'
        }
    ],
    yAxis: [
        {
            type: 'category',
            axisTick: {
                show: false
            },
            data: ['IWGSC2.1', 'IRGSP', 'TAIR10', 'Sanfensan', 'Sang', 'OT3098v2', 'BYU209', 'CN108634', 'CN58139', 'CN58138', 'CN19328', 'S75', 'Cc7277']
        }
    ],
    series: [
        {
            name: 'Assigned Genes',
            type: 'bar',
            stack: 'Total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [231854, 47807, 24575, 114706, 138957, 61548, 98402, 86407, 41884, 54934, 44659, 38310, 46813],
            color: 'rgb(145,146,171)'
        },
        {
            name: 'Gene Number',
            type: 'bar',
            label: {
                show: true,
                position: 'inside'
            },
            emphasis: {
                focus: 'series'
            },
            data: [266752, 55803, 27628, 120769, 152335, 66474, 108466, 89995, 43477, 62409, 47263, 39885, 49475],
            color: 'rgb(124,214,207)'
        },

    ]
};