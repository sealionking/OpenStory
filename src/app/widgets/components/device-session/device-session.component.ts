import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {widgetsData} from '../../../shared/model/widget-model';

@Component({
    selector: 'app-device-session',
    templateUrl: './device-session.component.html',
    styleUrls: ['./device-session.component.scss']
})
export class DeviceSessionComponent implements OnInit {
    @Input() dataStatic: boolean;
    @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    device: any = {};
    data: number[];
    values = {
        seriesData: [],
        legendData: []
    };
    colors = ['#0074C0', '#F48F07', '#53D79F'];

    constructor() {
    }

    /**
     * @ignore
     */
    ngOnInit() {
        // TODO: delete this statement after backend is done
        this.dataStatic = true;
        if (this.dataStatic === true) {
            this.constructData(widgetsData.deviceSession);
        } else {
            this.liveData();
        }
        this.createChart();
    }

    /**
     * Function used to display the chart using live data
     */
    // TODO: Apply backend service when done
    private liveData() {
        // this.constructData(data);
        // web-socket service code
    }

    private createChart() {
        this.device = {
            grid: {
                left: '3%',
                right: '10%',
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
                orient: 'horizontal',
                bottom: 10,
                right: -1,
                align: 'right',
                borderRadius: 0,
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 17,
                textStyle: {
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    borderRadius: 0,
                    padding: [0, 3, 0, 0]
                },
                data: this.values.legendData
            },
            series: [
                {
                    name: 'Session by browser',
                    type: 'pie',
                    center: ['50%', '42%'],
                    radius: ['61%', '76.5%'],
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
                                    fontSize: 52,
                                    fontWeight: 300,
                                    fontFamily: 'sans-serif',
                                },
                                a: {
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
                    data: this.values.seriesData
                }
            ]
        };

    }

    /**
     * Function used to build the legend and section data
     * @param data
     */
    constructData(data: Object) {
        let limit: number;
        if (data.hasOwnProperty('value') && data.hasOwnProperty('name')) {
            limit = data['name'].length;
            for (let i = 0; i < limit; i++) {
                this.values.seriesData.push({
                    value: data['value'][i],
                    name: data['name'][i],
                    itemStyle: {
                        color: this.colors[i]
                    }
                });
                this.values.legendData.push({
                    name: data['name'][i],
                    icon: 'rect'
                });
            }
        }
        return this.values;
    }

}
