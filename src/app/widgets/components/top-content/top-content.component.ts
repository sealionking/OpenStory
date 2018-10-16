import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Content} from '../../../content/model/content';
import {WebsocketService} from '../../../core/services/websocket.service';
import {MessageService} from '../../../core/services/message.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {widgetsData} from '../../../shared/model/widget-model';

@Component({
    selector: 'app-top-content',
    templateUrl: './top-content.component.html',
    styleUrls: ['./top-content.component.scss']
})
export class TopContentComponent implements OnInit {
    @Input() dataStatic: boolean;
    @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    topList: Content[];

    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.topList = widgetsData.top5;
        } else {
            this.getContent();
        }
    }

    /**
     * Content Listing
     */
    private getContent() {
        this.wsSocket.sendRequest({
            eventType: 'content',
            event: 'ListContent',
            data: {
                token: this.auth.getToken(),
                sorting: {created: 'DESC'}
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        if (data.body instanceof Object && Object.keys(data.body).length > 0) {
                            this.topList = data.body.slice(0, 5);
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
                setTimeout(() => {
                    this.dataLoaded.emit(true);
                }, 0);
            });
    }
}
