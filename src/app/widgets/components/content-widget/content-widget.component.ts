import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
    @Input() filterItem: string;
    @Output() selectedFilterItem: EventEmitter<string> = new EventEmitter();
    showFilter: boolean;
    selectedFilter: any;
    items: any;
    limit = 5;
    contentList: Content[];
    tmpContentList: Content[];

    /**
     * @ignore
     * @param wsSocket - web-socket service used to connect to the nodeJS
     * @param auth - used to send the token, needed to authenticate the request
     * @param messageService - used to display the error messages
     */
    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService
    ) {
    }

    /**
     * @ignore
     */
    ngOnInit() {
        if (this.dataStatic === true) {
            this.contentList = widgetsData.contentList;
        } else {
            this.showFilter = true;
            this.getContent();
        }
    }

    /**
     * @ignore
     * @param changes - angular built-in interface
     */
    ngOnChanges(changes: SimpleChanges) {
        if (this.viewMore && changes.viewMore && changes.viewMore.currentValue) {
            this.loadMore();
        }
    }

    /**
     * Function used to filter the content.
     */
    filter(): void {
        this.selectedFilterItem.emit(this.selectedFilter);
        this.contentList = this.tmpContentList.filter(data => {
            return ((this.selectedFilter !== null) ? data.type === this.selectedFilter : true);
        }).slice(0, 5);
    }

    /**
     * Provides a list of 5 of the current content available on site
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
                            if (this.filterItem) {
                                this.selectedFilter = this.filterItem;
                                this.contentList = data.body.filter(filter => {
                                    return ((this.selectedFilter !== null) ? filter.type === this.selectedFilter : true);
                                }).slice(0, 5);
                                this.tmpContentList = data.body;
                                this.filterItems();
                            } else {
                                this.contentList = data.body.slice(0, 5);
                                this.tmpContentList = data.body;
                            }
                        }
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
                        this.messageService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        this.messageService.add(data.body);
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
            });
    }

    /**
     * Provides a list of the available filter options
     */
    filterItems(): void {
        this.items = Array.from(new Set(this.tmpContentList.map(data => data.type)));
    }

    /**
     * Clears selected filter
     */
    clearFilter(): void {
        this.contentList = this.tmpContentList.slice(0, 5);
    }

    /**
     * @ignore
     */
    loadMore() {
        this.limit += 5;
        if (this.limit <= this.tmpContentList.length) {
            this.contentList = this.tmpContentList.slice(0, this.limit);
        }
    }
}
