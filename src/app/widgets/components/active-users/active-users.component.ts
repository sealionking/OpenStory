import {Component, Input, OnInit} from '@angular/core';

import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {widgetsData} from '../../../shared/model/widget-model';
import {StatusCodesService} from '../../../core/services/status-code.service';

@Component({
    selector: 'app-active-users',
    templateUrl: './active-users.component.html',
    styleUrls: ['./active-users.component.scss']
})
export class ActiveUsersComponent implements OnInit {
    @Input() dataStatic: boolean;
    activeUsers: string;

    constructor(private wsSocket: WebsocketService,
                private statusCodes: StatusCodesService,
                private auth: AuthenticateService) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.activeUsers = widgetsData.activeUsers;
        } else {
            this.getActiveUsers();
        }
    }

    getActiveUsers() {
        this.wsSocket.sendRequest({
            eventType: 'user',
            event: 'ActiveUsers',
            data: {
                token: this.auth.getToken()
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.activeUsers = data.body;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }
}
