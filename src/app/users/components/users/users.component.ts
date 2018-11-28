import {Component, OnDestroy, OnInit} from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import {Subscription} from 'rxjs/Subscription';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {GeneralUsers} from '../../../shared/model/general-users';
import {MessageService} from '../../../core/services/message.service';
import {WebsocketService} from '../../../core/services/websocket.service';
import {NgxMasonryOptions} from 'ngx-masonry';
import {UserData} from '../../../shared/model/user-data';
import {StatusCodesService} from '../../../core/services/status-code.service';

/**
 * User Display Page component
 */
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
    private userView: Subscription;
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
    deleteStatus = false;
    checkbox: any;
    currentUser: UserData;
    /**
     * Masonry animation options
     */
    public masonryOptions: NgxMasonryOptions = {
        transitionDuration: '1s',
        percentPosition: true,
        resize: true,
        initLayout: true
    };

    public lottieConfig: Object;
    public noContent: Object;
    /**
     * @ignore
     */
    constructor(private auth: AuthenticateService,
                private wsService: WebsocketService,
                private statusCodes: StatusCodesService,
                private messageService: MessageService) {
        this.lottieConfig = {
            path: 'assets/json/loader.json',
            autoplay: true,
            loop: true
        };
        this.noContent = {
            path: 'assets/no-content/data.json',
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
     * @ignore
     */
    ngOnDestroy(): void {
        this.userView.unsubscribe();
    }

    /**
     * Function allows us to send the event and token to the server
     * and allows us to listen to the event and display the users.
     * @return {Array<GeneralUsers>}
     */
    showUsers(): Array<GeneralUsers> {
        this.userView = this.wsService.sendRequest({
            eventType: 'user', event: 'ListUser', data: {
                token: this.auth.getToken(),
                sorting: {created: 'DESC'}
            }
        })
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.getUserRoles();
                    this.list = data.body;
                    this.tmpList = this.list;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
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
     * @param id
     */
    public deleteThisUser(id): GeneralUsers[] {
        this.wsService.sendEvent({eventType: 'user', event: 'DeleteEntity', data: {
                token: this.auth.getToken(), entityType: 'user', bundle: 'user', id: id
            }
        });
        const index = this.tmpList.findIndex(content => content.uuid === id);
        this.tmpList.splice(index, 1);
        this.list = this.tmpList.filter(data => {
            return data.uuid !== id;
        });
        return this.tmpList;
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
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
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
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }

}
