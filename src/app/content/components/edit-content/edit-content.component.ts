import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WebsocketService} from '../../../core/services/websocket.service';

@Component({
    selector: 'app-edit-content',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './edit-content.component.html',
    styleUrls: ['./edit-content.component.scss']
})
export class EditContentComponent implements OnInit {
    contentSchema: any = [];
    initContent = false;
    contentName: string;
    liveFormData = {};
    showSchema = false;
    public lottieConfig: Object;

    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
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

    /**
     * @ignore
     */
    ngOnInit() {
        this.contentSchemaRequest();
    }

    /**
     * Allows us to retreive the schema from the CMS
     */
    contentSchemaRequest() {
        this.wsService.sendRequest({
            eventType: 'entity',
            event: 'EditEntity', data: {
                token: this.auth.getToken(),
                entityType: 'node', bundle: this.getContentType(), id: this.getContentId()
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        if (this.initContent) {return; } else {this.initContent = true; }
                        this.contentSchema = data.body.definition;
                        this.contentName = data.body.entityLabel;
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
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
                this.showSchema = true;
            });
    }

    /**
     * Retreive the content type
     */
    getContentType(): string {
        const type = this.router.snapshot.paramMap.get('contenttype');
        return type;
    }

    /**
     * Retrive the id of the selected content type
     */
    getContentId(): any {
        const id = this.router.snapshot.paramMap.get('id');
        return id;
    }

    /**
     * Submit the edited content type
     * @param formData
     */
    onSubmitFn(formData): void {
        this.wsService.sendRequest({
            eventType: 'entity',
            event: 'UpdateEntity', data: {
                token: this.auth.getToken(),
                entityType: 'node', bundle: this.getContentType(), id: this.getContentId(), body: formData
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.route.navigate(['/content']);
                        this.messageService.add('Content has been edited!', 'success');
                        break;
                    case 201:
                        this.route.navigate(['/content']);
                        this.messageService.add('Content has been edited!', 'success');
                        break;
                    case 400:
                        this.messageService.add('Bad request.');
                        break;
                    case 403:
                        this.messageService.add(data.body);
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
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Unknown request.');
                }
            });
    }

    /**
     * Allows the user to go back to the users screen
     */
    goBack() {
        this.route.navigate(['/content']);
    }

    /**
     * Save the live data from the form
     * @param data
     */
    onChanges(data: any) {
        this.liveFormData = data;
    }

    /**
     * Allows us to view the JSON form
     * for testing only
     * Just add {{prettyLiveFormData}} in the HTML
     * @return {string}
     */
    get prettyLiveFormData() {
        return JSON.stringify(this.liveFormData, null, 2);
    }
}
