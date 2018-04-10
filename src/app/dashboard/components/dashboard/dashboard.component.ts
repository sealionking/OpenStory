import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js';
import {GridsterConfig, GridsterItem} from 'angular-gridster2';

import {DashboardService} from '../../services/dashboard.service';
import {NgxMasonryOptions} from '../../../masonry/ngx-masonry-options.interface';
import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    mediaList: any;
    canvasChart: any;
    tmpMedia: any;
    commentsList: any;
    userList: any;
    userNumber: any;
    contentList: any;
    userRoles: any;
    chartUsers = [];
    chartContent = [];
    chartMedia = [];
    public masonryOptions: NgxMasonryOptions = {
        transitionDuration: '0.4s',
        resize: true
    };
    constructor(private dashboardService: DashboardService,
                private messageService: MessageService,
                private wsSocket: WebsocketService,
                private auth: AuthenticateService) {

    }
    options: GridsterConfig;
    dashboard: Array<GridsterItem>;
    media: Array<GridsterItem>;
    activeUsers: Array<GridsterItem>;
    ngOnInit() {
        this.getDashboard();
        this.chartUsers = new Chart('users', {
            type: 'bar',
            data: {
                labels: ['Administrator', 'Editor', 'Subscriber', 'Authenticated'],
                datasets: [{
                    data: [2, 13, 25, 30 ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
        this.chartContent = new Chart('content', {
            type: 'horizontalBar',
            data: {
                labels: ['Blog', 'News', 'Event', 'Stories'],
                datasets: [{
                    label: 'Blog',
                    data: [21, 3, 7, 11 ],
                    backgroundColor: [
                        'rgba(83, 215, 159, 0.2)',
                        'rgba(54, 100, 235, 0.2)',
                        'rgba(255, 50, 86, 0.2)',
                        'rgba(75, 25, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
        this.chartMedia = new Chart('media', {
            type: 'pie',
            data: {
                datasets: [{
                    data: [290, 41, 22, 15],
                    backgroundColor: [
                        'rgba(83, 215, 159, 0.8)',
                        'rgba(82, 162, 215, 0.8)',
                        'rgba(255, 50, 86, 0.8)',
                        'rgba(75, 25, 192, 0.8)',
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    'Images',
                    'Video',
                    'Audio',
                    'Docs',
                ]
            },
            options: {
                responsive: true
            }
        });
        this.getCommentsList();
        this.getMedia();
        this.getContent();
        this.options = this.dashboardService.getDashboardOptions();

        this.dashboard = [
            {cols: 1, rows: 2, y: 0, x: 0, dragEnabled: true, resizeEnabled: false, compactEnabled: true, hasContent: true},
        ];
        this.media = [
            {cols: 1, rows: 2, y: 0, x: 0, dragEnabled: true, resizeEnabled: false, hasContent: true},
        ];
        this.activeUsers = [
            {cols: 1, rows: 1, y: 0, x: 0, dragEnabled: true, resizeEnabled: false, hasContent: true},
        ];
        this.canvasChart = [
            {cols: 1, rows: 2, y: 0, x: 0, dragEnabled: true, resizeEnabled: false, hasContent: true},
        ];

    }


    private getDashboard() {
        this.wsSocket.sendRequest({
            event: 'getUsers',
            data: {
                token: this.auth.getToken()
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        let allRoles = data.body;
                        this.userList = data.body.slice(0, 5);
                        this.userNumber = data.body.length;
                        let roles: any;
                        roles = allRoles.map(data => {
                            for (const envy of data.roles) {
                                if (data.roles.length > 0) {
                                    roles = envy;
                                }
                            }
                            return roles;
                        });
                        this.userRoles = Array.from(new Set(roles.map(x => x.label)));
                        console.log(this.userRoles);
                        break;
                    case 400:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Bad request.');
                        break;
                    case 403:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Access denied.');
                        break;
                    case 404:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Not Found.');
                        break;
                    case 422:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
            });
    }
    private getCommentsList() {
        this.wsSocket.sendRequest({
            event: 'getCommentsList',
            data: {
                token: this.auth.getToken()
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.commentsList = data.body.slice(0, 5);
                        break;
                    case 400:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Bad request.');
                        break;
                    case 403:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Access denied.');
                        break;
                    case 404:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Not Found.');
                        break;
                    case 422:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
            });
    }
    private getMedia() {
        this.wsSocket.sendRequest({
            event: 'getMedia',
            data: {
                token: this.auth.getToken(), itemsPerPage: 5
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.mediaList = data.body.filter(x => {
                            return x.filemime !== 'application/octet-stream';
                        });
                        this.tmpMedia = this.mediaList.slice(0, 6);
                        break;
                    case 400:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Bad request.');
                        break;
                    case 403:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Access denied.');
                        break;
                    case 404:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Not Found.');
                        break;
                    case 422:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
            });
    }
    private getContent() {
        this.wsSocket.sendRequest({
            event: 'getContentList',
            data: {
                token: this.auth.getToken(), itemsPerPage: 5
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.contentList = data.body;
                        break;
                    case 400:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Bad request.');
                        break;
                    case 403:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Access denied.');
                        break;
                    case 404:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Not Found.');
                        break;
                    case 422:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
            });
    }
}
