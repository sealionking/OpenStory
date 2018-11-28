import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {Media} from '../../../media/models/media';
import {widgetsData} from '../../../shared/model/widget-model';
import {StatusCodesService} from '../../../core/services/status-code.service';

@Component({
    selector: 'app-media-widget',
    templateUrl: './media-widget.component.html',
    styleUrls: ['./media-widget.component.scss']
})
export class MediaWidgetComponent implements OnInit {
    @Input() dataStatic: boolean;
    @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    mediaList: Media[];

    constructor(private wsSocket: WebsocketService,
                private statusCodes: StatusCodesService,
                private auth: AuthenticateService) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.mediaList = widgetsData.mediaList;
        } else {
            this.getMedia();
        }
    }

    /**
     * Media Listing
     */
    private getMedia() {
        this.wsSocket.sendRequest({
            eventType: 'media',
            event: 'ListMedia',
            data: {
                token: this.auth.getToken()
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    if (data.body instanceof Object && Object.keys(data.body).length > 0) {
                        const list = data.body.filter(x => {
                            return x.filemime !== 'application/octet-stream';
                        });
                        this.mediaList = list.slice(0, 6);
                    }
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
                setTimeout(() => {
                    this.dataLoaded.emit(true);
                }, 0);
            });
    }

    // Calculate file size MB.
    fileSize(size) {
        return size / 1024000;
    }

}
