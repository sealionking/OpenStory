import {Component, Input, OnInit} from '@angular/core';

import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {widgetsData} from '../../../shared/model/widget-model';
import {StatusCodesService} from '../../../core/services/status-code.service';

@Component({
    selector: 'app-content-evo',
    templateUrl: './content-evo.component.html',
    styleUrls: ['./content-evo.component.scss']
})
export class ContentEvoComponent implements OnInit {
    @Input() dataStatic: boolean;
    stories = [];

    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private statusCodes: StatusCodesService) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.stories = widgetsData.contentStories;
        } else {
            this.getContentEvo();
        }
    }

    getContentEvo() {
        this.wsSocket.sendRequest({
            eventType: 'content',
            event: 'CountStories',
            data: {
                token: this.auth.getToken(),
                days: 7
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    if (data.body instanceof Object && this.stories.length === 0) {
                        for (const i in data.body) {
                            if (i) {
                                this.stories.push({
                                    name: i,
                                    value: data.body[i]
                                });
                            }
                        }
                    }
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }
}
