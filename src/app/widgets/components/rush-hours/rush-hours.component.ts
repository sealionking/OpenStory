import {Component, Input, OnInit} from '@angular/core';
import {widgetsData} from '../../../shared/model/widget-model';

@Component({
    selector: 'app-rush-hours',
    templateUrl: './rush-hours.component.html',
    styleUrls: ['./rush-hours.component.scss']
})
export class RushHoursComponent implements OnInit {
    @Input() dataStatic: boolean;
    showFilter: boolean;
    area: any = {};
    period = ['Today', 'Last 7 days', 'Last 30 days'];
    currentItem = 'Last 7 days';
    values = [];
    maximum: number;

    /**
     * @ignore
     */
    constructor() {
    }

    /**
     *@ignore
     */
    ngOnInit() {
        // TODO: delete this statement after backend is done
        this.dataStatic = true;
        if (this.dataStatic === true) {
            this.constructData(widgetsData.rushHours, 1);
        } else {
            this.showFilter = true;
            this.liveData();
        }
        // TODO: Remove showFilter after backend is done.
        this.showFilter = true;
        this.createChart();
    }

    /**
     * Function used to display the chart using live data
     */
    // TODO: Apply backend service when done
    private liveData() {
        // this.constructData(data);
        // web-socket data
    }

    public onChange() {
        this.values = [];
        switch (this.currentItem) {
            case 'Today':
                this.constructData(widgetsData.rushHours, 0.2);
                break;
            case 'Last 7 days':
                this.constructData(widgetsData.rushHours, 1);
                break;
            case 'Last 30 days':
                this.constructData(widgetsData.rushHours, 5);
                break;
        }
        this.createChart();
    }

    /**
     * Function used to create the chart
     */
    private createChart() {
        this.area = {
            tooltip: {
                trigger: 'axis',
                position: 'top',
                backgroundColor: 'rgba(239, 240, 243, 0.7)',
                textStyle: {
                    color: '#333B50',
                    borderRadius: 0,
                    padding: 20
                },
                formatter: function (params) {
                    const colorSpan =
                        color =>
                            '<span style="display:inline-block;margin-right:5px;' +
                            'border-radius:0;width:8px;height:8px;background-color:' + color + '"></span>';
                    let rez = '';
                    // console.log(params); //quite useful for debug
                    params.forEach(item => {
                        // console.log(item); //quite useful for debug
                        const xx = '<span style="padding:8px;border-radius:0">' +
                            ' ' + colorSpan(item.color) + item.value + ' ' + 'visitors' + '</span>';
                        rez += xx;
                    });

                    return rez;
                }
            },
            legend: {
                data: [
                    {name: 'Visitors', icon: 'rect'}
                ],
                right: -2,
                bottom: -1,
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
                top: 28,
                left: -28,
                right: 10,
                bottom: 26,
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
                            shadowOffsetX: 6
                        },
                    },
                    axisLabel: {
                        color: 'rgba(51, 59, 80, 0.7)',
                        fontWeight: 'bold',
                        fontSize: 12,
                        lineHeight: 17,
                        align: 'right',
                        padding: [0, -6, 0, 0]
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                }
            ],
            yAxis: {
                max: this.maximum,
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
                    padding: [0, 0, 3, 0]
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#D4D7DD',
                        shadowColor: '#D4D7DD',
                        width: 1,
                        shadowBlur: 0,
                        opacity: 1,
                        shadowOffsetX: 7
                    },
                },
                axisTick: {
                    show: true,
                    length: 35,
                    lineStyle: {
                        color: '#D4D7DD',
                        width: 1,
                        opacity: 1,
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
                    data: this.values,
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
    }

    /**
     * Function used to build the legend and section data
     * @param data: backend data object
     * @param set - to be removed
     */
    // TODO: Remove set parameter after backend is done
    private constructData(data: Object, set: number): any {
        if (data.hasOwnProperty('value')) {
            for (let i = 0; i < 5; i++) {
                this.values.push({
                    value: data['value'][i] * set,
                    symbol: 'circle',
                    itemStyle: {
                        color: '#53D79F'
                    }
                });
            }
        }
        this.maximum = Math.max(...data['value']) * set >= 1000 ? Math.max(...data['value']) * set : 1000;
        return this.values;
    }
}
