import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {WebsocketService} from '../../../core/services/websocket.service';
import {MessageService} from '../../../core/services/message.service';
import {StatusCodesService} from '../../../core/services/status-code.service';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit, OnDestroy {
    private viewSchema: Subscription;
    private submit: Subscription;
    userSchema: any;
    userRoles = [];
    // Loader visibility.
    lottieLoader = false;
    showSchema = false;
    buttonValue = false;
    public lottieConfig: Object;

    /**
     *
     * @param {WebsocketService} wsService
     * @param {AuthenticateService} auth
     * @param {MessageService} messageService
     * @param statusCodes
     * @param {Router} route
     */
    constructor(
        private wsService: WebsocketService,
        private auth: AuthenticateService,
        private messageService: MessageService,
        private statusCodes: StatusCodesService,
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
    ngOnInit(): void {
        this.getUserRoles();
        this.schemaRequest();
    }

    /**
     * @ignore
     */
    ngOnDestroy(): void {
        this.viewSchema.unsubscribe();
        if (this.submit) {
            this.submit.unsubscribe();
        }
    }

    /**
     * Function used to retrieve the form info from the server
     */
    private schemaRequest() {
        this.viewSchema = this.wsService.sendRequest({
            eventType: 'entity',
            event: 'EntityDefinition', data: {token: this.auth.getToken(), entityType: 'user', bundle: 'user'}
        })
            .subscribe(data => {
                // Set the loader visibility.
                this.lottieLoader = true;
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.userSchema = data.body.definition;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
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
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    const roles = data.body;
                    for (const role in roles) {
                        if (role) {
                            this.userRoles.push({
                                title: roles[role],
                                enum: [role]
                            });
                        }
                    }
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
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
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.route.navigate(['/users']);
                    this.messageService.add(this.statusCodes.getMessageType('user-create'), 'os-success');
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
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
