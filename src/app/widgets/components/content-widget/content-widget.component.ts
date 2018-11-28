import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';

import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {Content} from '../../../content/model/content';
import {widgetsData} from '../../../shared/model/widget-model';
import {StatusCodesService} from '../../../core/services/status-code.service';

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
     * Delete status
     * @type {boolean}
     */
    deleteStatus = false;
    /**
     * Used for the delete function
     */
    checkbox: any;

    /**
     * @ignore
     * @param wsSocket - web-socket service used to connect to the nodeJS
     * @param auth - used to send the token, needed to authenticate the request
     * @param router
     * @param statusCodes - used to show status code message
     */
    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private router: Router,
                private statusCodes: StatusCodesService) {
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
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
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
                    console.log(data);
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
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

    /**
     * Delete function
     * @param id - the content UID
     * @param nid - the content NID
     * @param name
     */
    public deleteContent(id, nid, name): Content[] {
        this.wsSocket.sendRequest({eventType: 'content', event: 'DeleteEntity', data: {
                token: this.auth.getToken(), entityType: 'node', bundle: name, id: id
            }});
        const index = this.tmpContentList.findIndex(content => content.uuid === id);
        this.tmpContentList.splice(index, 1);
        this.contentList = this.tmpContentList.filter( x => {
            return x.nid !== nid;
        }).slice(0, 5);
        return this.tmpContentList;
    }

    /**
     * Redirect to the desired content
     * @param page - string
     * @param id - string
     * @param type - string
     */
    editContent(page: any, id: any, type: any) {
        this.router.navigate(['/' + page + '/' + id + '/' + type]);
    }
    /**
     * cancel delete user function
     */
    public return() {
        this.deleteStatus = false;
        this.checkbox = null;
    }
}
