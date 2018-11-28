import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {GeneralUsers} from '../../../shared/model/general-users';
import {widgetsData} from '../../../shared/model/widget-model';
import {StatusCodesService} from '../../../core/services/status-code.service';
import {UserData} from '../../../shared/model/user-data';

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
    deleteStatus = false;
    checkbox: any;
    currentUser: any;


    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private router: Router,
                private statusCodes: StatusCodesService
    ) {
    }

    /**
     * @ignore
     */
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
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    if (data.body instanceof Object && Object.keys(data.body).length > 0) {
                        this.userList = data.body.slice(0, 5);
                        this.tmpList = data.body;
                        this.getUserInfo();
                    }
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
                setTimeout(() => {
                    this.dataLoaded.emit(true);
                }, 0);
            });
    }

    /**
     * Delete user from view and server
     * @param id
     */
    public deleteThisUser(id): GeneralUsers[] {
        this.wsSocket.sendEvent({eventType: 'user', event: 'DeleteEntity', data: {
                token: this.auth.getToken(), entityType: 'user', bundle: 'user', id: id
            }
        });
        const index = this.tmpList.findIndex(content => content.uuid === id);
        this.tmpList.splice(index, 1);
        this.userList = this.tmpList.filter(data => {
            return data.uuid !== id;
        }).slice(0, 5);
        return this.tmpList;
    }

    /**
     * Redirect to the desired content
     * @param page - string
     * @param id - string
     * @param uid
     */
    editUser(page: string, id: string, uid: string) {
        this.router.navigate(['/' + page + '/' + id, {info: uid}]);
    }
    /**
     * cancel delete user function
     */
    return() {
        this.deleteStatus = false;
        this.checkbox = null;
    }

    getUserInfo() {
        this.currentUser = this.auth.getUserInfo();
    }
}
