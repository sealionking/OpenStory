import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Content} from '../../../content/model/content';
import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {widgetsData} from '../../../shared/model/widget-model';
import {StatusCodesService} from '../../../core/services/status-code.service';

@Component({
    selector: 'app-top-content',
    templateUrl: './top-content.component.html',
    styleUrls: ['./top-content.component.scss']
})
export class TopContentComponent implements OnInit {
    @Input() dataStatic: boolean;
    @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    topList: Content[];

    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private statusCodes: StatusCodesService) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.topList = widgetsData.top5;
        } else {
            this.getContent();
        }
    }

    /**
     * Content Listing
     */
    private getContent() {
        this.wsSocket.sendRequest({
            eventType: 'content',
            event: 'ListContent',
            data: {
                token: this.auth.getToken(),
                sorting: {created: 'DESC'}
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    if (data.body instanceof Object && Object.keys(data.body).length > 0) {
                        this.topList = data.body.slice(0, 5);
                    }
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
                setTimeout(() => {
                    this.dataLoaded.emit(true);
                }, 0);
            });
    }
}
