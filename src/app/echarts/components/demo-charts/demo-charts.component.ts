import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {NgxEchartsService} from 'ngx-echarts';

@Component({
    selector: 'app-demo-charts',
    templateUrl: './demo-charts.component.html',
    styleUrls: ['./demo-charts.component.scss']
})
export class DemoChartsComponent implements OnInit {

    chartOption: any = {};
    doughnut1: any = {};
    bar: any = {};
    line: any = {};
    area: any = {};
    map: any = {};
    doughnut: any = {};

    constructor(private es: NgxEchartsService,
                private http: HttpClient) {
    }

    ngOnInit() {
        const echarts = this.es.echarts;
        this.chartOption = {
            title: {
                text: 'Full Pie Chart - default',
                subtext: '',
                x: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: ['UnIdentified', 'Male', 'Female']
            },
            series: [
                {
                    name: 'Gender',
                    type: 'pie',
                    radius: '55%',
                    center: ['40%', '50%'],
                    data: [
                        {value: 102, name: 'UnIdentified'},
                        {value: 102, name: 'Female'},
                        {value: 35, name: 'Male'},
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        this.doughnut1 = {
            title : {
                text: 'Doughnut CHART',
                subtext: '',
                x: 'left'
            },
            grid: {
                left: '5%',
                right: '0%',
                bottom: '10%',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                formatter: '{c} sessions',
                backgroundColor: 'rgba(239, 240, 243, 0.7)',
                textStyle: {
                    color: '#333B50',
                }
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 110,
                align: 'right',
                borderRadius: 0,
                itemWidth: 12,
                itemGap: 22,
                itemHeight: 12,
                textStyle: {
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    borderRadius: 0
                },
                data: [
                    {name: 'Chrome', icon: 'rect'},
                    {name: 'Safari', icon: 'rect'},
                    {name: 'Firefox', icon: 'rect'},
                    {name: 'Other', icon: 'rect'},
                ]
            },
            series: [
                {
                    name: 'Session by browser',
                    type: 'pie',
                    radius: ['52.5%', '67.5%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            formatter: [
                                '{d|{d}%}',
                                '{a|{b}}'
                            ].join('\n'),
                            textStyle: {
                                fontFamily: 'sans-serif',
                                fontSize: '24',
                            },
                            rich: {
                                d: {
                                    color: '#53D79F',
                                    fontSize: 52,
                                    fontWeight: 300,
                                    fontFamily: 'sans-serif',
                                },
                                a: {
                                    color: '#53D79F',
                                    fontWeight: 600,
                                    fontSize: 20,
                                    lineHeight: 27,
                                    fontFamily: 'sans-serif',
                                }
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: 125, name: 'Chrome', itemStyle: {color: '#53D79F'}},
                        {value: 35, name: 'Safari', itemStyle: {color: '#F48F07'}},
                        {value: 50, name: 'Firefox', itemStyle: {color: '#687086'}},
                        {value: 102, name: 'Other', itemStyle: {color: '#26BCE1'}}
                    ]
                }
            ]
        };

        this.bar = {
            title: {
                text: 'Bar chart',
                subtext: '',
                x: 'left'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                backgroundColor: 'rgba(239, 240, 243, 0.7)',
                textStyle: {
                    color: '#333B50'
                }
            },
            legend: {
                data: [
                    {name: 'Facebook', icon: 'rect'},
                    {name: 'Twitter', icon: 'rect'},
                    {name: 'Other', icon: 'rect'},
                ],
                textStyle: {
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontWeight: 'bold',
                    padding: [0, 4, 0, 0]
                },
                right: 10,
                bottom: 11,
                borderRadius: 0,
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 20,
                align: 'right'
            },
            grid: {
                left: 10,
                right: 10,
                bottom: 38,
                height: 261,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['M', 'T', 'W', 'T', 'F'],
                axisLine: {
                    lineStyle: {
                        color: '#D4D7DD',
                    },
                },
                axisLabel: {
                    inside: false,
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontWeight: 'bold',
                    align: 'center'
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#D4D7DD',
                    }
                },
                axisLabel: {
                    inside: true,
                    margin: -5,
                    verticalAlign: 'bottom',
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontWeight: 'bold',
                    align: 'left'
                }
            },
            series: [
                {
                    name: 'Facebook',
                    type: 'bar',
                    stack: 'sm',
                    barWidth: 42,
                    data: [320, 332, 301, 334, 390],
                    itemStyle: {color: '#26BCE1'}
                },
                {
                    name: 'Twitter',
                    type: 'bar',
                    stack: 'sm',
                    data: [120, 132, 101, 134, 90],
                    itemStyle: {color: '#53D79F'}
                },
                {
                    name: 'Other',
                    type: 'bar',
                    stack: 'sm',
                    data: [220, 182, 191, 234, 390],
                    itemStyle: {color: '#F48F07'}
                },

            ]
        };

        this.line = {
            title: {
                text: 'Line Chart'
            },
            legend: {
                data: [
                    {name: 'Page Views', icon: 'rect'},
                    {name: 'Clicks', icon: 'rect'}
                ],
                textStyle: {
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontWeight: 'bold'
                },
                right: 15,
                bottom: 10,
                borderRadius: 0,
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 20,
                align: 'right'
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(239, 240, 243, 0.8)',
                textStyle: {
                    color: '#333B50'
                }
            },
            toolbox: {
                show: false
            },
            grid: {
                left: 25,
                right: 20,
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: '#D4D7DD'
                    }
                },
                axisLabel: {
                    inside: false,
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontWeight: 'bold',
                    align: 'center'
                },
                axisTick: {
                    alignWithLabel: true
                },
                data: ['M', 'T', 'W', 'T', 'F']
            },
            yAxis: {
                max: 400,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#D4D7DD'
                    }
                },
                axisLabel: {
                    inside: true,
                    margin: -5,
                    verticalAlign: 'bottom',
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontWeight: 'bold',
                    align: 'left'
                },
                type: 'value'
            },
            series: [
                {
                    name: 'Clicks',
                    stack: 'view',
                    data: [{value: 120, symbol: 'circle', itemStyle: {color: '#53D79F'}},
                        {value: 132, symbol: 'circle', itemStyle: {color: '#53D79F'}},
                        {value: 101, symbol: 'circle', itemStyle: {color: '#53D79F'}},
                        {value: 134, symbol: 'circle', itemStyle: {color: '#53D79F'}},
                        {value: 90, symbol: 'circle', itemStyle: {color: '#53D79F'}},
                    ],
                    type: 'line',
                    itemStyle: {
                        color: '#53D79F',
                        borderColor: '#53D79F',
                        borderWidth: 5,
                        shadowColor: '#53D79F',
                        shadowBlur: 5
                    },
                    lineStyle: {
                        color: '#53D79F',
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#fff',
                            borderColor: '#53D79F',
                            borderWidth: 1
                        }
                    }
                },
                {
                    name: 'Page Views',
                    stack: 'click',
                    data: [
                        {value: 220, symbol: 'circle', itemStyle: {color: '#26BCE1'}},
                        {value: 234, symbol: 'circle', itemStyle: {color: '#26BCE1'}},
                        {value: 290, symbol: 'circle', itemStyle: {color: '#26BCE1'}},
                        {value: 182, symbol: 'circle', itemStyle: {color: '#26BCE1'}},
                        {value: 300, symbol: 'circle', itemStyle: {color: '#26BCE1'}}
                    ],
                    type: 'line',
                    itemStyle: {
                        color: '#26BCE1',
                        borderColor: '#26BCE1',
                        borderWidth: 5,
                        shadowColor: '#26BCE1',
                        shadowBlur: 5
                    },
                    lineStyle: {
                        color: '#26BCE1',
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#fff',
                            borderColor: '#26BCE1',
                            borderWidth: 1
                        }
                    }
                }
            ]
        };

        this.area = {
            title: {
                text: 'Area Chart'
            },
            tooltip: {
                trigger: 'axis',
                position: 'top',
                backgroundColor: 'rgba(239, 240, 243, 0.7)',
                textStyle: {
                    color: '#333B50'
                }
            },
            legend: {
                data: [
                    {name: 'Visitors', icon: 'rect'}
                ],
                right: 14,
                top: 'bottom',
                align: 'right',
                borderRadius: 0,
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 20,
                textStyle: {
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontWeight: 'bold',
                    padding: [0, 4, 0, 0]
                }
            },
            toolbox: {
                show: false,
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: 0,
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['3:00am', '6:00am', '9:00am', '3:00pm', '6:00pm'],
                    axisLine: {
                        lineStyle: {
                            color: '#D4D7DD',
                            shadowColor: '#D4D7DD',
                            width: 1,
                            shadowBlur: 0,
                            opacity: 1,
                            shadowOffsetX: 5
                        },
                    },
                    axisLabel: {
                        color: 'rgba(51, 59, 80, 0.7)',
                        fontWeight: 'bold',
                        align: 'right',
                        padding: [0, -6, 0, 0],
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                }
            ],
            yAxis: {
                max: 1000,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#D4D7DD'
                    }
                },
                axisLabel: {
                    inside: false,
                    verticalAlign: 'bottom',
                    align: 'left',
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontWeight: 'bold',
                    margin: 35,
                },
                axisTick: {
                    show: true,
                    length: 35,
                    lineStyle: {
                        color: '#D4D7DD',
                        // shadowColor: '#D4D7DD',
                        width: 1,
                        // shadowBlur: 0,
                        opacity: 1,
                        // shadowOffsetX: -35
                    },
                },
                type: 'value'
            },
            series: [
                {
                    name: 'Visitors',
                    type: 'line',
                    stack: 'test',
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#53D79F'
                            }, {
                                offset: 1, color: '#26BCE1'
                            }],
                            globalCoord: false // false by default
                        },
                        opacity: 0.5,
                    },
                    data: [
                        {value: 120, symbol: 'circle', itemStyle: {color: '#53D79F'}},
                        {value: 200, symbol: 'circle', itemStyle: {color: '#53D79F'}},
                        {value: 400, symbol: 'circle', itemStyle: {color: '#53D79F'}},
                        {value: 134, symbol: 'circle', itemStyle: {color: '#53D79F'}},
                        {value: 600, symbol: 'circle', itemStyle: {color: '#53D79F'}}
                    ],
                    itemStyle: {
                        color: '#53D79F',
                        borderColor: '#53D79F',
                        borderWidth: 5,
                        shadowColor: '#53D79F',
                        shadowBlur: 5
                    },
                    lineStyle: {
                        color: '#53D79F',
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#fff',
                            borderColor: '#53D79F',
                            borderWidth: 1
                        }
                    }
                }
            ]
        };
        // this.doughnut = {
        //     title: {
        //         text: 'SOS-655',
        //         subtext: '',
        //         x: 'left'
        //     },
        //     grid: {
        //         left: '3%',
        //         right: '10%',
        //         bottom: '10%',
        //         containLabel: true
        //     },
        //     tooltip: {
        //         trigger: 'item',
        //         formatter: '{c} sessions',
        //         backgroundColor: 'rgba(239, 240, 243, 0.7)',
        //         textStyle: {
        //             color: '#333B50',
        //         }
        //     },
        //     legend: {
        //         orient: 'horizontal',
        //         bottom: 10,
        //         left: 'right',
        //         align: 'right',
        //         borderRadius: 0,
        //         itemWidth: 12,
        //         itemGap: 17,
        //         itemHeight: 12,
        //         textStyle: {
        //             color: 'rgba(51, 59, 80, 0.7)',
        //             fontFamily: 'sans-serif',
        //             fontWeight: 'bold',
        //             borderRadius: 0
        //         },
        //         data: [
        //             {name: 'Tablet', icon: 'rect'},
        //             {name: 'Desktop', icon: 'rect'},
        //             {name: 'Mobile', icon: 'rect'}
        //         ]
        //     },
        //     series: [
        //         {
        //             name: 'Session by browser',
        //             type: 'pie',
        //             radius: ['53%', '68%'],
        //             avoidLabelOverlap: false,
        //             label: {
        //                 normal: {
        //                     show: false,
        //                     position: 'center'
        //                 },
        //                 emphasis: {
        //                     show: true,
        //                     formatter: '{d}% {b}',
        //                     textStyle: {
        //                         fontFamily: 'sans-serif',
        //                         fontSize: '25',
        //                         fontWeight: 'bold'
        //                     }
        //                 }
        //             },
        //             labelLine: {
        //                 normal: {
        //                     show: false
        //                 }
        //             },
        //             data: [
        //                 {value: 102, name: 'Tablet', itemStyle: {color: '#53D79F'}},
        //                 {value: 102, name: 'Desktop', itemStyle: {color: '#0074C0'}},
        //                 {value: 35, name: 'Mobile', itemStyle: {color: '#F48F07'}}
        //             ]
        //         }
        //     ]
        // };
        this.http.get('assets/map/world.json')
            .subscribe(geoJson => {
                // register map:
                echarts.registerMap('world', geoJson);
                // update options:
                this.map = {
                    backgroundColor: '#efefef',
                    title: {
                        text: 'MAP chart',
                        left: 'left',
                        top: 'top'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}'
                    },
                    toolbox: {
                        show: false,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            dataView: {readOnly: false},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: 1000000,
                        text: ['High', 'Low'],
                        orient: 'horizontal',
                        left: 'center',
                        top: 'bottom',
                        realtime: false,
                        calculable: true,
                        inRange: {
                            color: ['#D4D7DD', '#54D79F', '#F48F06']
                        },
                        textStyle: {
                            fontSize: 9
                        }
                    },
                    series: [
                        {
                            name: 'Traffic by country',
                            type: 'map',
                            mapType: 'world',
                            roam: false,
                            itemStyle: {
                                emphasis: {label: {show: true, color: 'black', fontSize: 12}}
                            },
                            data: [
                                {name: 'Afghanistan', value: 28397.812},
                                {name: 'Angola', value: 19549.124},
                                {name: 'Albania', value: 3150.143},
                                {name: 'United Arab Emirates', value: 8441.537},
                                {name: 'Argentina', value: 40374.224},
                                {name: 'Armenia', value: 2963.496},
                                {name: 'French Southern and Antarctic Lands', value: 268.065},
                                {name: 'Australia', value: 22404.488},
                                {name: 'Austria', value: 8401.924},
                                {name: 'Azerbaijan', value: 9094.718},
                                {name: 'Burundi', value: 9232.753},
                                {name: 'Belgium', value: 10941.288},
                                {name: 'Benin', value: 9509.798},
                                {name: 'Burkina Faso', value: 15540.284},
                                {name: 'Bangladesh', value: 151125.475},
                                {name: 'Bulgaria', value: 7389.175},
                                {name: 'The Bahamas', value: 66402.316},
                                {name: 'Bosnia and Herzegovina', value: 3845.929},
                                {name: 'Belarus', value: 9491.07},
                                {name: 'Belize', value: 308.595},
                                {name: 'Bermuda', value: 64.951},
                                {name: 'Bolivia', value: 716.939},
                                {name: 'Brazil', value: 195210.154},
                                {name: 'Brunei', value: 27.223},
                                {name: 'Bhutan', value: 716.939},
                                {name: 'Botswana', value: 1969.341},
                                {name: 'Central African Rep.', value: 4349.921},
                                {name: 'Canada', value: 34126.24},
                                {name: 'Switzerland', value: 7830.534},
                                {name: 'Chile', value: 17150.76},
                                {name: 'China', value: 1359821.465},
                                {name: 'Ivory Coast', value: 60508.978},
                                {name: 'Cameroon', value: 20624.343},
                                {name: 'Dem. Rep. Congo', value: 62191.161},
                                {name: 'Congo', value: 3573.024},
                                {name: 'Colombia', value: 46444.798},
                                {name: 'Costa Rica', value: 4669.685},
                                {name: 'Cuba', value: 11281.768},
                                {name: 'Northern Cyprus', value: 1.468},
                                {name: 'Cyprus', value: 1103.685},
                                {name: 'Czech Rep.', value: 10553.701},
                                {name: 'Germany', value: 83017.404},
                                {name: 'Djibouti', value: 834.036},
                                {name: 'Denmark', value: 5550.959},
                                {name: 'Dominican Rep.', value: 10016.797},
                                {name: 'Algeria', value: 37062.82},
                                {name: 'Ecuador', value: 15001.072},
                                {name: 'Egypt', value: 78075.705},
                                {name: 'Eritrea', value: 5741.159},
                                {name: 'Spain', value: 46182.038},
                                {name: 'Estonia', value: 1298.533},
                                {name: 'Ethiopia', value: 87095.281},
                                {name: 'Finland', value: 5367.693},
                                {name: 'Fiji', value: 860.559},
                                {name: 'Falkland Islands', value: 49.581},
                                {name: 'France', value: 63230.866},
                                {name: 'Gabon', value: 1556.222},
                                {name: 'United Kingdom', value: 62066.35},
                                {name: 'Georgia', value: 4388.674},
                                {name: 'Ghana', value: 24262.901},
                                {name: 'Guinea', value: 10876.033},
                                {name: 'Gambia', value: 1680.64},
                                {name: 'Guinea Bissau', value: 10876.033},
                                {name: 'Equatorial Guinea', value: 696.167},
                                {name: 'Greece', value: 11109.999},
                                {name: 'Greenland', value: 56.546},
                                {name: 'Guatemala', value: 14341.576},
                                {name: 'French Guiana', value: 231.169},
                                {name: 'Guyana', value: 786.126},
                                {name: 'Honduras', value: 7621.204},
                                {name: 'Croatia', value: 4338.027},
                                {name: 'Haiti', value: 9896.4},
                                {name: 'Hungary', value: 10014.633},
                                {name: 'Indonesia', value: 240676.485},
                                {name: 'India', value: 1205624.648},
                                {name: 'Ireland', value: 4467.561},
                                {name: 'Iran', value: 240676.485},
                                {name: 'Iraq', value: 30962.38},
                                {name: 'Iceland', value: 318.042},
                                {name: 'Israel', value: 7420.368},
                                {name: 'Italy', value: 60508.978},
                                {name: 'Jamaica', value: 2741.485},
                                {name: 'Jordan', value: 6454.554},
                                {name: 'Japan', value: 127352.833},
                                {name: 'Kazakhstan', value: 15921.127},
                                {name: 'Kenya', value: 40909.194},
                                {name: 'Kyrgyzstan', value: 5334.223},
                                {name: 'Cambodia', value: 14364.931},
                                {name: 'Korea', value: 51452.352},
                                {name: 'Kosovo', value: 97.743},
                                {name: 'Kuwait', value: 2991.58},
                                {name: 'Lao PDR', value: 6395.713},
                                {name: 'Lebanon', value: 4341.092},
                                {name: 'Liberia', value: 3957.99},
                                {name: 'Libya', value: 6040.612},
                                {name: 'Sri Lanka', value: 20758.779},
                                {name: 'Lesotho', value: 2008.921},
                                {name: 'Lithuania', value: 3068.457},
                                {name: 'Luxembourg', value: 507.885},
                                {name: 'Latvia', value: 2090.519},
                                {name: 'Morocco', value: 31642.36},
                                {name: 'Moldova', value: 103.619},
                                {name: 'Madagascar', value: 21079.532},
                                {name: 'Mexico', value: 117886.404},
                                {name: 'Macedonia', value: 507.885},
                                {name: 'Mali', value: 13985.961},
                                {name: 'Myanmar', value: 51931.231},
                                {name: 'Montenegro', value: 620.078},
                                {name: 'Mongolia', value: 2712.738},
                                {name: 'Mozambique', value: 23967.265},
                                {name: 'Mauritania', value: 3609.42},
                                {name: 'Malawi', value: 15013.694},
                                {name: 'Malaysia', value: 28275.835},
                                {name: 'Namibia', value: 2178.967},
                                {name: 'New Caledonia', value: 246.379},
                                {name: 'Niger', value: 15893.746},
                                {name: 'Nigeria', value: 159707.78},
                                {name: 'Nicaragua', value: 5822.209},
                                {name: 'Netherlands', value: 16615.243},
                                {name: 'Norway', value: 4891.251},
                                {name: 'Nepal', value: 26846.016},
                                {name: 'New Zealand', value: 4368.136},
                                {name: 'Oman', value: 2802.768},
                                {name: 'Pakistan', value: 173149.306},
                                {name: 'Panama', value: 3678.128},
                                {name: 'Peru', value: 29262.83},
                                {name: 'Philippines', value: 93444.322},
                                {name: 'Papua New Guinea', value: 6858.945},
                                {name: 'Poland', value: 38198.754},
                                {name: 'Puerto Rico', value: 3709.671},
                                {name: 'Dem. Rep. Korea', value: 1.468},
                                {name: 'Portugal', value: 10589.792},
                                {name: 'Paraguay', value: 6459.721},
                                {name: 'Qatar', value: 1749.713},
                                {name: 'Romania', value: 21861.476},
                                {name: 'Russia', value: 21861.476},
                                {name: 'Rwanda', value: 10836.732},
                                {name: 'W. Sahara', value: 514.648},
                                {name: 'Saudi Arabia', value: 27258.387},
                                {name: 'Sudan', value: 35652.002},
                                {name: 'S. Sudan', value: 9940.929},
                                {name: 'Senegal', value: 12950.564},
                                {name: 'Solomon Islands', value: 526.447},
                                {name: 'Sierra Leone', value: 5751.976},
                                {name: 'El Salvador', value: 6218.195},
                                {name: 'Somaliland', value: 9636.173},
                                {name: 'Somalia', value: 9636.173},
                                {name: 'Serbia', value: 3573.024},
                                {name: 'Suriname', value: 524.96},
                                {name: 'Slovakia', value: 5433.437},
                                {name: 'Slovenia', value: 2054.232},
                                {name: 'Sweden', value: 9382.297},
                                {name: 'Swaziland', value: 1193.148},
                                {name: 'Syria', value: 7830.534},
                                {name: 'Chad', value: 11720.781},
                                {name: 'Togo', value: 6306.014},
                                {name: 'Thailand', value: 66402.316},
                                {name: 'Tajikistan', value: 7627.326},
                                {name: 'Turkmenistan', value: 5041.995},
                                {name: 'East Timor', value: 10016.797},
                                {name: 'Trinidad and Tobago', value: 1328.095},
                                {name: 'Tunisia', value: 10631.83},
                                {name: 'Turkey', value: 72137.546},
                                {name: 'Tanzania', value: 44973.33},
                                {name: 'Uganda', value: 33987.213},
                                {name: 'Ukraine', value: 46050.22},
                                {name: 'Uruguay', value: 3371.982},
                                {name: 'United States', value: 312247.116},
                                {name: 'Uzbekistan', value: 27769.27},
                                {name: 'Venezuela', value: 236.299},
                                {name: 'Vietnam', value: 89047.397},
                                {name: 'Vanuatu', value: 236.299},
                                {name: 'West Bank', value: 13.565},
                                {name: 'Yemen', value: 22763.008},
                                {name: 'South Africa', value: 51452.352},
                                {name: 'Zambia', value: 13216.985},
                                {name: 'Zimbabwe', value: 13076.978}
                            ]
                        }
                    ]
                };
            });
    }

}
