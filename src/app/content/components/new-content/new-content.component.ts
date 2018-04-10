import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WebsocketService} from '../../../core/services/websocket.service';

@Component({
    selector: 'app-new-content',
    templateUrl: './new-content.component.html',
    styleUrls: ['./new-content.component.scss']
})
export class NewContentComponent implements OnInit {
    contentSchema: any;
    initContent = false;

    constructor( private wsService: WebsocketService,
                 private auth: AuthenticateService,
                 private messageService: MessageService,
                 private route: Router,
                 private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.contentSchemaRequest();
    }

    contentSchemaRequest() {
        this.wsService.sendRequest({
            event: 'getEntityDefinition', data: {token: this.auth.getToken(), entityType: 'node', bundle: this.getContentName()}})
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        if(this.initContent){ return;} else {this.initContent = true;}
                        this.contentSchema = data.body;
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

    getContentName() {
        const type = this.router.snapshot.paramMap.get('contenttype');
        return type;
    }

    onSubmitFn(formData): void {
        this.wsService.sendRequest({event: 'createEntity', data: {token: this.auth.getToken(),
                entityType: 'node', bundle: this.getContentName(), body: formData}})
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.route.navigate(['/content'])
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
        this.route.navigate(['/content']);
    }
}
