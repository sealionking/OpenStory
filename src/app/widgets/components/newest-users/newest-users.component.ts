import {Component, Input, OnInit} from '@angular/core';
import {WebsocketService} from '../../../core/services/websocket.service';
import {MessageService} from '../../../core/services/message.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {widgetsData} from '../../../shared/model/widget-model';

@Component({
    selector: 'app-newest-users',
    templateUrl: './newest-users.component.html',
    styleUrls: ['./newest-users.component.scss']
})
export class NewestUsersComponent implements OnInit {
    @Input() dataStatic: boolean;
    newestUsers: string;

    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.newestUsers = widgetsData.newestUsers;
        } else {
            this.getNewestUsers();
        }
    }

    getNewestUsers() {
        this.wsSocket.sendRequest({
            eventType: 'user',
            event: 'NewestUsers',
            data: {
                token: this.auth.getToken(),
                days: 7
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.newestUsers = data.body;
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
