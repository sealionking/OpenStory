import {Component, Input, OnInit} from '@angular/core';

import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {widgetsData} from '../../../shared/model/widget-model';
import {StatusCodesService} from '../../../core/services/status-code.service';

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
                private statusCodes: StatusCodesService) {
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
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.newestUsers = data.body;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }
}
