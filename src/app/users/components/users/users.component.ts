import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {GeneralUsers} from '../../../shared/model/general-users';
import {MessageService} from '../../../core/services/message.service';
import {WebsocketService} from '../../../core/services/websocket.service';
import {UsersService} from '../../services/users.service';
import {UserData} from '../../../shared/model/user-data';

/**
 * User Display Page component
 */
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    /**
     * Filter dropdown options
     */
    dropItems = [];
    /**
     * Sort list used to sort the users by name alphabetically
     * @type {string[]}
     */
    orderItems = [{id: 1, label: 'A-Z'}, {id: 2, label: 'Z-A'}];
    /**
     * Variable used to sort the users
     */
    order: string;
    /**
     * Variable used to sort the users
     * @type {boolean}
     */
    reverse = false;
    /**
     * Variable used to filter the users
     * @type {{label: null}}
     */
    statusFilter = [{id: null, label: null}];
    /**
     * @ignore
     */
    user: GeneralUsers;
    /**
     * Array used to display the users from the server
     */
    list: GeneralUsers[];
    /**
     * Array used to store the current list of users in order to filter/sort
     */
    tmpList: GeneralUsers[];
    initUsers = false;
    deleteStatus = false;
    checkbox: any;
    currentUser: UserData;

    public lottieConfig: Object;
    /**
     * @ignore
     */
    constructor(private auth: AuthenticateService,
                private wsService: WebsocketService,
                private messageService: MessageService) {
        this.lottieConfig = {
            path: 'assets/json/loader.json',
            autoplay: true,
            loop: true
        };
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.showUsers();
        this.getUserInfo();
    }

    /**
     * Function allows us to send the event and token to the server
     * and allows us to listen to the event and display the users.
     * @return {Array<GeneralUsers>}
     */
    showUsers(): Array<GeneralUsers> {
        this.wsService.sendRequest({
            eventType: 'user', event: 'ListUser', data: {
                token: this.auth.getToken(),
                sorting: {created: 'DESC'}
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.getUserRoles();
                        // TODO: Remove this functionality, when back-end fix multiple emits issue.
                        if (this.initUsers) {
                            return;
                        } else {
                            this.initUsers = true;
                        }
                        this.list = data.body;
                        this.tmpList = this.list;
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
        return this.list;
    }

    /**
     * Function used to sort the users alphabetically
     * @param $event
     */
    setOrder($event): void {
        if ($event === this.orderItems[0]) {
            this.order = 'name';
            this.reverse = false;
        }
        if ($event === this.orderItems[1]) {
            this.order = 'name';
            this.reverse = !this.reverse;
        }
    }

    /**
     * Function used to clear the sort
     */
    clear(): void {
        this.order = '';
        this.reverse = false;
    }

    /**
     * Filter function for the user roles
     */
    filterUsers(): void {
        this.list = this.tmpList.filter(data => {
            for (const entry of data.roles) {
                if (this.statusFilter !== null) {
                    if ((entry.id === this.statusFilter) || (entry.label === this.statusFilter)) {
                        return true;
                    } else {
                    }
                }
            }
        });
    }

    /**
     * Function used to clear the filter
     */
    default(): Array<GeneralUsers> {
        return this.list = this.tmpList;
    }

    /**
     * Delete user from view and server
     * @param name
     * @param id
     */
    deleteThisUser(id) {
        this.wsService.sendEvent({eventType: 'user', event: 'DeleteEntity', data: {
                token: this.auth.getToken(), entityType: 'user', bundle: 'user', id: id
            }
        });
        this.list = this.tmpList.filter(data => {
            return data.uuid !== id;
        });
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

    /**
     * Function used to get an object array of the user roles
     */
    getUserRoles() {
        this.wsService.sendRequest({
            eventType: 'user',
            event: 'GetUserRoles', data: {token: this.auth.getToken()}
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        const roles = [];
                        for (const role in data.body) {
                            if (role) {
                                roles.push({
                                    label: data.body[role],
                                    id: role
                                });
                            }
                        }
                        this.dropItems = Array.from(new Set(roles
                            .map(x => x.label)));
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

                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
            });
    }

}
