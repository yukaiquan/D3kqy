import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

var chartDom = document.getElementById('main')!;
var myChart = echarts.init(chartDom, null, {
    renderer: 'svg'
});
var option: EChartsOption;

option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    legend: {},
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
    xAxis: {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: [
            'Sanfensan',
            'Sang',
            'OT3098v2',
            'BYU209',
            'CN108634',
            'CN58139',
            'CN58138',
            'CN19328',
            'Cc7277',
            'S75'
        ]
    },
    series: [
        {
            name: 'NR',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            color: 'rgb(153,135,206)'
        },
        {
            name: 'KOG',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            color: 'rgb(118,218,145)'
        },
        {
            name: 'Uniprot',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            color: 'rgb(248,203,127)'
        },
        {
            name: 'GO',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            color: 'rgb(248,149,136)'
        },
        {
            name: 'KEGG',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            color: 'rgb(124,214,207)'
        }
    ]
};

option && myChart.setOption(option);
