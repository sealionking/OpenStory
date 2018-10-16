import {Component, Input, OnInit} from '@angular/core';
import {WebsocketService} from '../../../core/services/websocket.service';
import {MessageService} from '../../../core/services/message.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {widgetsData} from '../../../shared/model/widget-model';

@Component({
    selector: 'app-content-evo',
    templateUrl: './content-evo.component.html',
    styleUrls: ['./content-evo.component.scss']
})
export class ContentEvoComponent implements OnInit {
    @Input() dataStatic: boolean;
    stories = [];

    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.stories = widgetsData.contentStories;
        } else {
            this.getContentEvo();
        }
    }

    getContentEvo() {
        this.wsSocket.sendRequest({
            eventType: 'content',
            event: 'CountStories',
            data: {
                token: this.auth.getToken(),
                days: 7
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        if (data.body instanceof Object && this.stories.length === 0) {
                            for (const i in data.body) {
                                if (i) {
                                    this.stories.push({
                                        name: i,
                                        value: data.body[i]
                                    });
                                }
                            }
                        }
                        break;
                    case 400:
                        this.messageService.add('Bad request.');
                        break;
                    case 403:
                        this.messageService.add('Access denied.');
                        break;
                    case 404:
                        this.messageService.add('Not Found.');
                        break;
                    case 422:
                        this.messageService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        this.messageService.add(data.body);
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
            });
    }
}
