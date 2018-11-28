import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {widgetsData} from '../../../shared/model/widget-model';

export interface Legend {
    orient: string;
    right: any;
    center: any[];
    bottom: any;
    itemGap: number;
    radius: any[];
}

@Component({
    selector: 'app-browser-session',
    templateUrl: './browser-session.component.html',
    styleUrls: ['./browser-session.component.scss']
})
export class BrowserSessionComponent implements OnInit {
    @Input() dataStatic: boolean;
    @Input() mini: {
        id: any;
        indent: any;
    };
    @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    doughnut: any = {};
    legend: Legend;
    data: number[];
    values = {
        seriesData: [],
        legendData: []
    };
    colors = ['#53D79F', '#F48F07', '#687086', '#26BCE1'];


    constructor() {
    }

    /**
     * @ignore
     */
    ngOnInit() {
        // TODO: delete this statement after backend is done
        this.dataStatic = true;
        if (this.dataStatic === true) {
            this.constructData(widgetsData.browserSession);
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
        // web-socket data
    }

    /**
     * Function used to display the chart using static data
     */
    private legendData() {
        if (this.mini && this.mini.id === this.mini.indent) {
            this.legend = {
                orient: 'vertical',
                right: 6,
                center: ['48%', '55%'],
                bottom: 88,
                itemGap: 22,
                radius: ['62%', '80%']
            };
        } else {
            this.legend = {
                orient: 'horizontal',
                right: 'left',
                center: ['50%', '50%'],
                bottom: 10,
                itemGap: 16,
                radius: ['53%', '68%']
            };
        }
        return this.legend;
    }

    /**
     * Function used to create the chart
     */
    private createChart() {
        this.legendData();
        this.doughnut = {
            grid: {
                top: 0,
                left: 64,
                right: '4%',
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
                orient: this.legend.orient,
                right: this.legend.right,
                bottom: this.legend.bottom,
                align: 'right',
                borderRadius: 0,
                itemWidth: 12,
                itemGap: this.legend.itemGap,
                itemHeight: 12,
                width: 360,
                textStyle: {
                    color: 'rgba(51, 59, 80, 0.7)',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    borderRadius: 0,
                    padding: [0, 4, 0, 0]
                },
                data: this.values.legendData
            },
            series: [
                {
                    name: 'Session by browser',
                    type: 'pie',
                    center: this.legend.center,
                    radius: this.legend.radius,
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
    private constructData(data: Object): any {
        let limit: number;
        if (data.hasOwnProperty('value') && data.hasOwnProperty('name')) {
            limit = data['name'].length;
            for (let i = 0; i < limit; i++) {
                const sum = data['value'].reduce((a, b) => a + b, 0);
                this.values.seriesData.push({
                    value: data['value'][i],
                    name: data['name'][i],
                    itemStyle: {
                        color: this.colors[i]
                    },
                    perc: ((100 * data['value'][i]) / sum).toFixed(2)
                });
                this.values.legendData.push({
                    name: data['name'][i],
                    icon: 'rect'
                });
            }
        }
        return this.values;
    }


    /**
     * Add correct SVG to the correct type
     * @param name
     */
    public addBrowser(name: string): string {
        switch (name) {
            case 'Chrome':
                return '../../../../assets/images/browser/chrome.svg';
            case 'Firefox':
                return '../../../../assets/images/browser/firefox.svg';
            case 'Safari':
                return '../../../../assets/images/browser/safari.svg';
            default:
                return '../../../../assets/images/browser/clicks.svg';
        }
    }

}
