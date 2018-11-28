import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthenticateService} from '../core/services/authenticate.service';
import {UserData} from '../shared/model/user-data';
import {WebsocketService} from '../core/services/websocket.service';
import {MessageService} from '../core/services/message.service';
import {StatusCodesService} from '../core/services/status-code.service';

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
        private statusCodes: StatusCodesService,
        private wsService: WebsocketService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService) {
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.getUserInfo();
    }

    /**
     * Logout call service
     */
    submitLogout(): void {
        this.auth.logout();
    }

    /**
     * User Info function
     */
    getUserInfo() {
        this.userJWTData = this.auth.getUserInfo();
    }

    /**
     * Function allows us to clear the Drupal Cache
     */
    clearCache() {
        this.wsService.sendRequest({
            eventType: 'cache',
            event: 'ClearCache',
            data: {token: this.auth.getToken()}
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.messageService.add(this.statusCodes.getMessageType(data.body), 'os-success');
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     * Function allows us to run the Drupal Cron
     */
    runCron() {
        this.wsService.sendRequest({
            eventType: 'cron',
            event: 'RunCron',
            data: {token: this.auth.getToken()}
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.messageService.add(this.statusCodes.getMessageType(data.body), 'os-success');
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     * Redirect to the current user
     * @param page - string
     * @param id - string
     * @param uid
     */
    editUser(page: string, id: string, uid: string) {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
            this.router.navigate(['./' + page + '/' + id, {info: uid}]));
    }
}
