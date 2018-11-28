import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {WebsocketService} from '../../../core/services/websocket.service';
import {StatusCodesService} from '../../../core/services/status-code.service';

@Component({
    selector: 'app-new-content',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './new-content.component.html',
    styleUrls: ['./new-content.component.scss']
})
export class NewContentComponent implements OnInit {
    contentSchema: any;
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
                private statusCodes: StatusCodesService,
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
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.contentLabel = data.body.entityLabel;
                    this.contentSchema = data.body.definition;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
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
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.route.navigate(['/content']);
                    this.messageService.add(this.statusCodes.getMessageType('content-create'), 'os-success');
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
                this.buttonValue = false;
            });
    }

    /**
     * Allows the user to go back to the users screen
     */
    public goBack() {
        this.route.navigate(['/content']);
    }
}
