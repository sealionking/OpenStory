import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {WebsocketService} from '../../../core/services/websocket.service';
import {StatusCodesService} from '../../../core/services/status-code.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
    private editSchema: Subscription;
    userSchema: any;
    username: string;
    userRoles = [];
    userPicture: any;
    editedUser: string;
    // Loader visibility.
    lottieLoader = false;
    showSchema = false;
    buttonValue = false;
    public lottieConfig: Object;

    constructor(
        private wsService: WebsocketService,
        private auth: AuthenticateService,
        private messageService: MessageService,
        private statusCodes: StatusCodesService,
        private route: Router,
        private router: ActivatedRoute) {
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
        this.editSchemaRequest();
    }

    /**(
     * @ignore
     */
    ngOnDestroy(): void {
        this.editSchema.unsubscribe();
    }

    /**
     * Request to fetch the user form to be edited
     */
    private editSchemaRequest() {
        this.editSchema = this.wsService.sendRequest({
            eventType: 'user',
            event: 'EditEntity',
            data: {token: this.auth.getToken(), entityType: 'user', bundle: 'user', id: this.getUserUuid()}
        })
            .subscribe(data => {
                // Set the loader visibility.
                this.lottieLoader = true;
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    for (const item in data.body.definition) {
                        if (item) {
                            if (data.body.definition[item]['id'] === 'name') {
                                this.editedUser = data.body.definition[item]['defaultValue'][0];
                            }
                        }
                    }
                    this.userSchema = data.body.definition;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
                this.showSchema = true;
            });
    }

    /**
     * Retrieve the selected users uuid
     */
    private getUserUuid() {
        const id = this.router.snapshot.paramMap.get('id');
        return id;
    }

    /**
     * Retrieve the selected users id
     */
    private getUserId() {
        const id = this.router.snapshot.paramMap.get('info');
        return id;
    }

    /**
     * Get the available roles for the user
     */
    private getUserRoles() {
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
            });
    }

    /**
     * Submit function
     * @param formData - input data from the form
     */
    public onSubmitFn(formData): void {
        this.buttonValue = true;
        this.wsService.sendRequest({
            eventType: 'entity', event: 'UpdateEntity', data: {
                token: this.auth.getToken(),
                entityType: 'user', id: this.getUserUuid(), bundle: 'user', body: formData
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.route.navigate(['/users']);
                    this.messageService.add(this.statusCodes.getMessageType('user-edit'), 'os-success');
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
