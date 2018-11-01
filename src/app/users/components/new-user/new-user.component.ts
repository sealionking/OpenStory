import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {WebsocketService} from '../../../core/services/websocket.service';
import {MessageService} from '../../../core/services/message.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
    userSchema: any;
    userRoles = [];
    initContent = false;
    // Loader visibility.
    lottieLoader: boolean = false;
    showSchema = false;
    buttonValue = false;
    public lottieConfig: Object;

    /**
     *
     * @param {WebsocketService} wsService
     * @param {AuthenticateService} auth
     * @param {MessageService} messageService
     * @param ngSpinner
     * @param loader
     * @param {Router} route
     */
    constructor(
        private wsService: WebsocketService,
        private auth: AuthenticateService,
        private messageService: MessageService,
        private route: Router) {
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
        this.getUserRoles();
        this.schemaRequest();
    }

    /**
     * Function used to retrevie the form info from the server
     */
    schemaRequest() {
        this.wsService.sendRequest({
            eventType: 'entity',
            event: 'EntityDefinition', data: {token: this.auth.getToken(), entityType: 'user', bundle: 'user'}
        })
            .subscribe(data => {
                // Set the loader visibility.
                this.lottieLoader = true;
                switch (data.statusCode) {
                    case 200:
                        if (this.initContent) {
                            return;
                        } else {
                            this.initContent = true;
                        }
                        this.userSchema = data.body.definition;
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
                        // TODO: Change back when json.api is re-implemented
                        // data.body.errors.forEach((i) => {
                        //     this.messageService.add(i.detail);
                        // });
                        this.messageService.add(data.body.message);
                        break;
                    case 500:
                        this.messageService.add(data.body);
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
                this.showSchema = true;
            });
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
                        const roles = data.body;
                        for (const role in roles) {
                            if (role) {
                                this.userRoles.push({
                                    title: roles[role],
                                    enum: [role]
                                });
                            }
                        }
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
                        // TODO: Change back when json.api is re-implemented
                        // data.body.errors.forEach((i) => {
                        //     this.messageService.add(i.detail);
                        // });
                        this.messageService.add(data.body.message);
                        break;
                    case 500:
                        this.messageService.add(data.body);
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
                this.showSchema = true;
            });
    }

    /**
     * Function used to send the form info to the server
     * @param formData: any
     * @constructor
     */
    onSubmitFn(formData): void {
        this.buttonValue = true;
        this.wsService.sendRequest({
            eventType: 'user', event: 'CreateEntity', data: {
                token: this.auth.getToken(),
                entityType: 'user', bundle: 'user', body: formData
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.route.navigate(['/users']);
                        this.messageService.add('User has been created!', 'success');
                        break;
                    case 201:
                        this.route.navigate(['/users']);
                        this.messageService.add('User has been created!', 'success');
                        break;
                    case 400:
                        this.messageService.add('Bad request.');
                        break;
                    case 401:
                        // TODO: Redo this when backend resolves the issue
                        if (data.hasOwnProperty('body')) {
                            if (data['body'].hasOwnProperty('message')) {
                                this.messageService.add(data.body.message);
                            } else {
                                this.messageService.add('Unauthorized. Access denied.', 'danger');
                            }
                        }
                        break;
                    case 403:
                        // TODO: Redo this when backend resolves the issue
                        if (data.hasOwnProperty('body')) {
                            if (data['body'].hasOwnProperty('message')) {
                                this.messageService.add(data.body.message);
                            } else {
                                this.messageService.add('Forbidden. Access denied.', 'danger');
                            }
                        }
                        break;
                    case 404:
                        this.messageService.add('Not Found.');
                        break;
                    case 422:
                        // TODO: Redo this when backend resolves the issue
                        // data.body.errors.forEach((i) => {
                        //     this.messageService.add(i.detail);
                        // });
                        if (data.hasOwnProperty('body')) {
                            if (data['body'].hasOwnProperty('message')) {
                                this.messageService.add(data.body.message);
                            } else {
                                this.messageService.add('Unprocessable Entity.', 'danger');
                            }
                        }
                        break;
                    case 500:
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
                this.buttonValue = false;
            });
    }

    /**
     * Allows the user to go back to the users screen
     */
    goBack() {
        this.route.navigate(['/users']);
    }
}
