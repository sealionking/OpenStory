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
    userSchema: string;
    displayData: any;
    myLayout: any;
    form: any;
    userRoles = [];
    minLength = 6;
    /**
     *
     * @param {WebsocketService} wsService
     * @param {AuthenticateService} auth
     * @param {MessageService} messageService
     * @param {Router} route
     */
    constructor(
        private wsService: WebsocketService,
        private auth: AuthenticateService,
        private messageService: MessageService,
        private route: Router) {
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
                     event: 'getEntityDefinition', data: {token: this.auth.getToken(), entityType: 'user', bundle: 'user'}})
            .subscribe(data => {
            switch (data.statusCode) {
                case 200:
                    this.userSchema = data.body;
                    // TODO: Remove this when back-end will send correct schema.
                    delete this.userSchema['properties']['roles']['enum'];
                    this.userSchema['properties']['roles']['oneOf'] = this.userRoles;
                    this.userSchema['properties']['mail']['pattern'] = "^\\S+@\\S+$";
                    this.userSchema['properties']['mail']['description'] = "User Email Address";
                    this.userSchema['properties']['pass']['minLength'] = this.minLength;
                    this.userSchema['properties']['name']['placeholder'] = 'Username';
                    this.userSchema['properties']['First Name']['placeholder'] = 'First Name';
                    this.userSchema['properties']['Last Name']['placeholder'] = 'Last Name';
                    this.myLayout = [
                        {
                            key    : 'First Name',
                            notitle: true

                        },
                        {
                            key    : 'Last Name',
                            notitle: true

                        },
                        {
                            key    : 'name',
                            notitle: true

                        },
                        {
                            key    : 'mail',
                            notitle: true

                        },
                        {
                            key  : 'pass',
                            type : 'password',
                            title: 'Password: '
                        },
                        {
                            key  : 'roles',
                            title: 'Available Roles: ',
                            htmlClass : 'col-xl-3 col-lg-4 col-md-6 p-0',
                        },
                        {
                            type : 'submit',
                            style: 'btn-success float-right',
                            title: 'Add New User'
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

    /**
     * Function used to get an object array of the user roles
     */
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
     * Function used to send the form info to the server
     * @param formData: any
     * @constructor
     */
    OnSubmitFn(formData): void {
        this.displayData = formData;
        this.wsService.sendRequest({event: 'createEntity', data: {token: this.auth.getToken(),
                entityType: 'user', bundle: 'user', body: formData}})
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.route.navigate(['/users'])
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
