import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WebsocketService} from '../../../core/services/websocket.service';
import {UsersService} from '../../services/users.service';


@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
    editUser: any;
    username: string;
    dataUser: any;
    editLayout: any;
    userRoles = [];
    displayData: any;
    editedUser: any;


    constructor(
        private wsService: WebsocketService,
        private auth: AuthenticateService,
        private messageService: MessageService,
        private route: Router,
        private router: ActivatedRoute,
        private userService: UsersService) {
    }

    ngOnInit() {
        this.getUserRoles();
        this.editSchemaRequest();
    }

    editSchemaRequest() {
        this.wsService.sendRequest({
            event: 'editEntity', data: {token: this.auth.getToken(), entityType: 'user', bundle: 'user', id: this.getUserId()}
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.editedUser = data.body.data.name;
                        this.editUser = {type: 'object', properties: data.body.properties};
                        delete this.editUser['properties']['roles']['enum'];
                        this.editUser['properties']['roles']['oneOf'] = this.userRoles;
                        this.dataUser = data.body.data;
                        delete this.dataUser['roles'];
                        this.editLayout = [
                            'First Name',
                            'Last Name',
                            'name',
                            {
                                type : 'submit',
                                style: 'btn-success float-right',
                                title: 'Update'
                            }
                        ];
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
    }

    getUserId() {
        const id = this.router.snapshot.paramMap.get('id');
        return id;
    }

    getUserRoles() {
        this.wsService.sendRequest( {
            event: 'getUserRoles', data: {token: this.auth.getToken()}
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        let roles = data.body;
                        for (let role in roles) {
                            this.userRoles.push({
                                title: roles[role],
                                enum: [role]
                            });
                        }
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
    }
    /**
     * Submit function
     * @param formData - input data from the form
     */
    onSubmitFn(formData): void {
        this.displayData = formData;
        this.wsService.sendRequest({event: 'updateEntity', data: {token: this.auth.getToken(),
                entityType: 'user', id: this.getUserId(), bundle: 'user', body: formData}})
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.route.navigate(['/users']);
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
    }

    /**
     * Allows the user to go back to the users screen
     */
    goBack(){
        this.route.navigate(['/users']);
    }
}
