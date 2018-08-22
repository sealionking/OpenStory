import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../core/services/authenticate.service';
import {UserData} from '../shared/model/user-data';
import {WebsocketService} from '../core/services/websocket.service';
import {MessageService} from '../core/services/message.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    show = false;
    userJWTData: UserData;
    options = false;
    constructor(
        private auth: AuthenticateService,
        private wsService: WebsocketService,
        private mService: MessageService) {
    }

    ngOnInit() {
        this.getUserInfo();
    }

    submitLogout(): void {
        this.auth.logout();
    }

    getUserInfo() {
        this.userJWTData = this.auth.getUserInfo();
    }

    clearCache() {
        this.wsService.sendRequest({
            eventType: 'cache',
            event: 'ClearCache',
            data: {token : this.auth.getToken()}
        })
            .subscribe( data => {
                switch (data.statusCode) {
                    case 200:
                        this.mService.add(data.body, 'success');
                        break;
                    case 400:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Bad request.');
                        break;
                    case 403:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Access denied.');
                        break;
                    case 404:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Not Found.');
                        break;
                    case 422:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Internal Server Error.');
                        break;
                    default:
                        this.mService.add('Connection issues between UI and Server');
                }
            });
    }

    runCron() {
        this.wsService.sendRequest({
            eventType: 'cron',
            event: 'RunCron',
            data: {token : this.auth.getToken()}
        })
            .subscribe( data => {
                switch (data.statusCode) {
                    case 200:
                        this.mService.add(data.body, 'success');
                        break;
                    case 400:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Bad request.');
                        break;
                    case 403:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Access denied.');
                        break;
                    case 404:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Not Found.');
                        break;
                    case 422:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        // TODO: add general messages - bootstrap.
                        this.mService.add('Internal Server Error.');
                        break;
                    default:
                        this.mService.add('Connection issues between UI and Server');
                }
            });
    }
}
