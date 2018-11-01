import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {WebsocketService} from '../../../core/services/websocket.service';

@Component({
    selector: 'app-new-content',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './new-content.component.html',
    styleUrls: ['./new-content.component.scss']
})
export class NewContentComponent implements OnInit {
    contentSchema: any;
    initContent = false;
    contentName: string;
    contentLabel: string;
    showSchema = false;
    buttonValue = false;
    public lottieConfig: Object;

    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService,
                private route: Router,
                private router: ActivatedRoute) {
        this.contentName = this.router.snapshot.paramMap.get('contenttype');
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
        this.contentSchemaRequest();
    }

    /**
     * Request for the new content schema
     */
    contentSchemaRequest() {
        this.wsService.sendRequest({
            eventType: 'entity',
            event: 'EntityDefinition', data: {token: this.auth.getToken(), entityType: 'node', bundle: this.getContentName()}
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        if (this.initContent) {
                            return;
                        } else {
                            this.initContent = true;
                        }
                        this.contentLabel = data.body.entityLabel;
                        this.contentSchema = data.body.definition;
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
                        data.body.errors.forEach((i) => {
                            this.messageService.add(i.detail);
                        });
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
     * Retreive the content type from the url
     * @return {string | null}
     */
    getContentName() {
        const type = this.router.snapshot.paramMap.get('contenttype');
        return type;
    }

    /**
     * Submit the new content type
     * @param formData
     */
    onSubmitFn(formData): void {
        this.buttonValue = true;
        this.wsService.sendRequest({
            eventType: 'content', event: 'CreateEntity', data: {
                token: this.auth.getToken(),
                entityType: 'node', bundle: this.getContentName(), body: formData
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.route.navigate(['/content']);
                        this.messageService.add('Content has been created!', 'success');
                        break;
                    case 201:
                        this.route.navigate(['/content']);
                        this.messageService.add('Content has been created!', 'success');
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
                        // TODO: Redo this when backend resolves the issue
                        if (data.hasOwnProperty('body')) {
                            if (data['body'].hasOwnProperty('message')) {
                                this.messageService.add(data.body.message);
                            } else {
                                this.messageService.add('Internal Server Error.', 'danger');
                            }
                        }
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
        this.route.navigate(['/content']);
    }
}
