import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WebsocketService} from '../../../core/services/websocket.service';
import {StatusCodesService} from '../../../core/services/status-code.service';

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
    buttonValue = false;
    public lottieConfig: Object;

    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService,
                private route: Router,
                private statusCodes: StatusCodesService,
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
     * Allows us to retrieve the schema from the CMS
     */
    contentSchemaRequest() {
        this.wsService.sendRequest({
            eventType: 'entity',
            event: 'EditEntity', data: {
                token: this.auth.getToken(),
                entityType: 'node', bundle: this.getContentType(), id: this.getContentId()
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    if (this.initContent) {return; } else {this.initContent = true; }
                    this.contentSchema = data.body.definition;
                    this.contentName = data.body.entityLabel;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
                this.showSchema = true;
            });
    }

    /**
     * Retrieve the content type
     */
    getContentType(): string {
        const type = this.router.snapshot.paramMap.get('contenttype');
        return type;
    }

    /**
     * Retrieve the id of the selected content type
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
        this.buttonValue = true;
        this.wsService.sendRequest({
            eventType: 'entity',
            event: 'UpdateEntity', data: {
                token: this.auth.getToken(),
                entityType: 'node', bundle: this.getContentType(), id: this.getContentId(), body: formData
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.route.navigate(['/content']);
                    this.messageService.add(this.statusCodes.getMessageType('content-edit'), 'os-success');
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
