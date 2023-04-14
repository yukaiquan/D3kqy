import * as echarts from 'echarts/core';
import {
    PolarComponent,
    PolarComponentOption,
    LegendComponent,
    LegendComponentOption
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PolarComponent, LegendComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
    PolarComponentOption | LegendComponentOption | BarSeriesOption
>;

var chartDom = document.getElementById('main')!;
var myChart = echarts.init(chartDom);
var option: EChartsOption;

option = {
    angleAxis: {
        type: 'category',
        data: [
            'Sanfensan',
            'Sang',
            'OT3098v2',
            'BYU209',
            'CN108634',
            'CN58139',
            'CN58138',
            'eriantha',
            'atlantica',
            'strigosa'
        ]
    },
    radiusAxis: {},
    polar: {},
    series: [
        {
            type: 'bar',
            data: [41433, 47469, 21838, 0, 0, 43477, 62409, 0, 49475, 39885],
            coordinateSystem: 'polar',
            name: 'A',
            stack: 'a',
            emphasis: {
                focus: 'series'
            },
            color: '#8ECFC9'
        },
        {
            type: 'bar',
            data: [36283, 46259, 22729, 62802, 43243, 0, 0, 47263, 0, 0],
            coordinateSystem: 'polar',
            name: 'C',
            stack: 'a',
            emphasis: {
                focus: 'series'
            },
            color: '#FFBE7A'
        },
        {
            type: 'bar',
            data: [41633, 46386, 22729, 45664, 43911, 0, 0, 0, 0, 0],
            coordinateSystem: 'polar',
            name: 'D',
            stack: 'a',
            emphasis: {
                focus: 'series'
            },
            color: '#FA7F6F'
        }
    ],
    legend: {
        show: true,
        data: ['A', 'C', 'D']
    }
};

option && myChart.setOption(option);
