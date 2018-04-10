import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WebsocketService} from '../../../core/services/websocket.service';

@Component({
    selector: 'app-edit-content',
    templateUrl: './edit-content.component.html',
    styleUrls: ['./edit-content.component.scss']
})
export class EditContentComponent implements OnInit {
    contentSchema: any;
    // contentLayout: any;
    contentData: any;
    initContent = false;

    constructor(private wsService: WebsocketService,
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
            event: 'editEntity', data: {token: this.auth.getToken(),
                entityType: 'node', bundle: this.getContentType(), id: this.getContentId()}
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        if(this.initContent){ return;} else {this.initContent = true;}
                        this.contentSchema = data.body;
                        this.contentData = data.body.data;
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

    getContentType() {
        const type = this.router.snapshot.paramMap.get('contenttype');
        return type;
    }

    getContentId() {
        const id = this.router.snapshot.paramMap.get('id');
        return id;
    }


    onSubmitFn(formData): void {
        this.wsService.sendRequest({
            event: 'updateEntity', data: {
                token: this.auth.getToken(),
                entityType: 'node', bundle: this.getContentType(), id: this.getContentId(), body: formData
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.route.navigate(['/content']);
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
                        this.messageService.add('Unknown request.');
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
