import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {GeneralUsers} from '../../../shared/model/general-users';
import {widgetsData} from '../../../shared/model/widget-model';

@Component({
    selector: 'app-users-widget',
    templateUrl: './users-widget.component.html',
    styleUrls: ['./users-widget.component.scss']
})
export class UsersWidgetComponent implements OnInit {
    @Input() dataStatic: boolean;
    @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    userList: GeneralUsers[];
    tmpList: GeneralUsers[];
    limit = 5;


    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService
    ) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.userList = widgetsData.usersList;
        } else {
            this.getUsers();
        }
    }

    /**
     * User listing
     */
    private getUsers() {
        this.wsSocket.sendRequest({
            eventType: 'user',
            event: 'ListUser',
            data: {
                token: this.auth.getToken()
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        if (data.body instanceof Object && Object.keys(data.body).length > 0) {
                            this.userList = data.body.slice(0, 5);
                            this.tmpList = data.body;
                        }
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
                setTimeout(() => {
                    this.dataLoaded.emit(true);
                }, 0);
            });
    }

    loadMore() {
        this.limit += 5;
        if (this.limit <= this.tmpList.length) {
            this.userList = this.tmpList.slice(0, this.limit);
        }
    }

}
