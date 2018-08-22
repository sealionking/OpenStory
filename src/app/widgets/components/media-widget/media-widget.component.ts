import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {Media} from '../../../media/models/media';
import {widgetsData} from '../../../shared/model/widget-model';

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
                private auth: AuthenticateService,
                private messageService: MessageService
    ) {
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
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        if (data.body instanceof Object && Object.keys(data.body).length > 0) {
                            const list = data.body.filter(x => {
                                return x.filemime !== 'application/octet-stream';
                            });
                            this.mediaList = list.slice(0, 6);
                        }
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
                setTimeout(() => {
                    this.dataLoaded.emit(true);
                }, 0);
            });
    }

    // Calculate file size MB.
    fileSize(size){
        return size / 1024000;
    }

}
