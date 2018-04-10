import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {GeneralUsers} from '../../../shared/model/general-users';
import {MessageService} from '../../../core/services/message.service';
import {WebsocketService} from '../../../core/services/websocket.service';
import {UsersService} from '../../services/users.service';

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
     * Filter list for the user roles
     * @type {string[]}
     */
    /**
     * Filter dropdown options
     */
    dropItems: any;
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

    /**
     * @ignore
     */
    constructor(private auth: AuthenticateService,
                private wsService: WebsocketService,
                private messageService: MessageService,
                private usersService: UsersService) {
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.showUsers();
    }

    /**
     * Function allows us to send the event and token to the server
     * and allows us to listen to the event and display the users.
     * @return {Array<GeneralUsers>}
     */
    showUsers(): Array<GeneralUsers> {
        this.wsService.sendRequest({event: 'getUsers', data: {token: this.auth.getToken()}})
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        // TODO: Remove this functionality, when back-end fix multiple emits issue.
                        if(this.initUsers){ return;} else {this.initUsers = true;}
                        this.list = data.body;
                        // TODO: Remove this function. when back-end will give us the full url.
                        this.usersService.addFullPath(this.list);
                        this.tmpList = this.list;
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
                    if ((entry.id === this.statusFilter) || (entry.label === this.statusFilter) ) {
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
     * Used to find the user roles
     */
    filterItems() {
        let roles: any;
        roles = this.tmpList.map(data => {
            for (const envy of data.roles) {
                if (data.roles.length > 0) {
                    roles = envy;
                }
            }
            return roles;
        });
        this.dropItems = Array.from(new Set(roles.map(x => x.label)));
    }

    /**
     * Delete user from view and server
     * @param name
     * @param id
     */
    deleteUser(name, id){
        this.wsService.sendEvent({event: 'deleteEntity', data: {
                token: this.auth.getToken(), entityType: 'user', userId: id
            }});
        this.list = this.tmpList.filter( data => {
            return data.uid !== id;
        });
    }

}
