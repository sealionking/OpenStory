import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {WebsocketService} from '../../../core/services/websocket.service';
import {MessageService} from '../../../core/services/message.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {Content} from '../../../content/model/content';
import {widgetsData} from '../../../shared/model/widget-model';

@Component({
    selector: 'app-content-widget',
    templateUrl: './content-widget.component.html',
    styleUrls: ['./content-widget.component.scss']
})
export class ContentWidgetComponent implements OnInit, OnChanges {
    @Input() dataStatic: boolean;
    @Input() viewMore: boolean;
    showFilter: boolean;
    selectedFilter: any;
    items: any;
    limit = 5;
    contentList: Content[];
    tmpContentList: Content[];

    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService
    ) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.contentList = widgetsData.contentList;
        } else {
            this.showFilter = true;
            this.getContent();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.viewMore && changes.viewMore && changes.viewMore.currentValue) {
            this.loadMore();
        }
    }

    filter(): void {
        this.contentList = this.tmpContentList.filter(data => {
            return ((this.selectedFilter !== null) ? data.type === this.selectedFilter : true);
        }).slice(0 , 5);
    }

    /**
     * Content Listing
     */
    private getContent() {
        this.wsSocket.sendRequest({
            eventType: 'content',
            event: 'ListContent',
            data: {
                token: this.auth.getToken()
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        if (data.body instanceof Object && Object.keys(data.body).length > 0) {
                            this.contentList = data.body.slice(0, 5);
                            this.tmpContentList = data.body;
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
            });
    }

    filterItems(): void {
        this.items = Array.from(new Set(this.tmpContentList.map(data => data.type)));
    }

    clearFilter(): void {
        this.contentList = this.tmpContentList.slice(0, 5);
    }

    loadMore() {
        this.limit += 5;
        if (this.limit <= this.tmpContentList.length) {
            this.contentList = this.tmpContentList.slice(0, this.limit);
        }
    }
}
