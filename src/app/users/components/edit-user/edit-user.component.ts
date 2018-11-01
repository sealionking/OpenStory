import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WebsocketService} from '../../../core/services/websocket.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
    userSchema: any;
    username: string;
    userRoles = [];
    userPicture: any;
    editedUser: string;
    initContent = false;
    // Loader visibility.
    lottieLoader: boolean = false;
    showSchema = false;
    buttonValue = false;
    public lottieConfig: Object;

    constructor(
        private wsService: WebsocketService,
        private auth: AuthenticateService,
        private messageService: MessageService,
        private route: Router,
        private router: ActivatedRoute) {
        this.lottieConfig = {
            path: 'assets/json/loader.json',
            autoplay: true,
            loop: true
        };
    }

    ngOnInit() {
        this.getUserRoles();
        this.editSchemaRequest();
    }

    editSchemaRequest() {
        this.wsService.sendRequest({
            eventType: 'user',
            event: 'EditEntity', data: {token: this.auth.getToken(), entityType: 'user', bundle: 'user', id: this.getUserUuid()}
        })
            .subscribe(data => {
                console.log(data);
                // Set the loader visibility.
                this.lottieLoader = true;
                switch (data.statusCode) {
                    case 200:
                        if (this.initContent) {
                            return;
                        } else {
                            this.initContent = true;
                        }
                        for (const item in data.body.definition) {
                            if (item) {
                               if (data.body.definition[item]['id'] === 'name') {
                                   this.editedUser = data.body.definition[item]['defaultValue'][0];
                               }
                            }
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

    getUserUuid() {
        const id = this.router.snapshot.paramMap.get('id');
        return id;
    }

    getUserId() {
        const id = this.router.snapshot.paramMap.get('info');
        return id;
    }

    getUserRoles() {
        this.wsService.sendRequest( {
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
            });
    }
    /**
     * Submit function
     * @param formData - input data from the form
     */
    onSubmitFn(formData): void {
        this.buttonValue = true;
        this.wsService.sendRequest({eventType: 'entity', event: 'UpdateEntity', data: {token: this.auth.getToken(),
                entityType: 'user', id: this.getUserId(), bundle: 'user', body: formData}})
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.route.navigate(['/users']);
                        this.messageService.add('User has been edited!', 'success');
                        break;
                    case 201:
                        this.route.navigate(['/users']);
                        this.messageService.add('User has been edited!', 'success');
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
