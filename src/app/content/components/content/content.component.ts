import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {Content} from '../../model/content';
import {NgxMasonryOptions} from 'ngx-masonry';
import {WebsocketService} from '../../../core/services/websocket.service';
import {StatusCodesService} from '../../../core/services/status-code.service';

/**
 * Content Component allows us to view the CMS content
 */
@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {
    private contentType: Subscription;
    /**
     * @ignore
     */
    show = false;
    menuItems = [];
    /**
     * Items for the dropdown filter list
     * @type {string[]}
     */
    items: any;
    /**
     * Items for the dropdown filter list
     * @type {string[]}
     */
    contentStatus = [{id: 1, name: 'Published'}, {id: 0, name: 'Unpublished'}];
    /**
     * Allows us to retrieve content from the server
     */
    content: Content;
    /**
     * Array type of Content
     */
    contentList: Content[];
    /**
     * Array used for filtering
     * Array type of Content
     */
    tmpContentList: Content[];
    /**
     * Used to check the filter options
     * @type {{type: null; status: null; language: null}}
     */
    selectedFilter = {
        type: null,
        status: null,
        language: null
    };
    /**
     * Content Types
     */
    contentNames: any;
    /**
     * Delete status
     * @type {boolean}
     */
    deleteStatus = false;
    /**
     * Used for the delete function
     */
    checkbox: any;
    limit = 10;
    /**
     * Masonry animation options
     */
    public masonryOptions: NgxMasonryOptions = {
        transitionDuration: '1s',
        percentPosition: true,
        resize: true,
        initLayout: true
    };

    public lottieConfig: Object;
    public noContent: Object;

    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
                private auth: AuthenticateService,
                private statusCodes: StatusCodesService) {
        this.lottieConfig = {
            path: 'assets/json/loader.json',
            autoplay: true,
            loop: true
        };
        this.noContent = {
            path: 'assets/no-content/data.json',
            autoplay: true,
            loop: true
        };
    }

    /**
     * @ignore
     */
    ngOnInit(): void {
        this.getContentListType();
    }

    /**
     * @ignore
     */
    ngOnDestroy(): void {
        this.contentType.unsubscribe();
    }

    /**
     * Returns content types available
     * @return {any}
     */
    private getContentListType(): void {
        this.wsService.sendRequest({
            eventType: 'entity',
            event: 'ListEntities',
            data: {token: this.auth.getToken(), entityTypeId: 'node'}
        })
            .take(1)
            .subscribe(
                data => {
                    if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                        this.contentNames = data.body;
                        this.getContent();
                    } else if (this.statusCodes.checkStatusCode(data)) {
                        return true;
                    }
                }
            );
    }

    /**
     * Function that allows us to retrieve the Content data from the server
     */
    public getContent(): void {
        this.contentType = this.wsService.sendRequest({
            eventType: 'content', event: 'ListContent',
            data: {token: this.auth.getToken(), sorting: {created: 'DESC'}}
        })
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    if (Object.keys(data.body).length > 0) {
                        for (const item in data.body) {
                            if (item) {
                                // Removes HTML tag from the body and checks if the body is of valid format.
                                let stripTag: any;
                                if (data.body[item].hasOwnProperty('body')) {
                                    stripTag = data.body[item]['body'];
                                    if (data.body[item]['body'] && data.body[item]['body'].length > 0) {
                                        if (data.body[item]['body'] instanceof Object) {
                                            if (data.body[item]['body'].find(x => x.hasOwnProperty('value'))) {
                                                if (data.body[item]['body'][0]['value'] === '') {
                                                    data.body[item]['body'] = '';
                                                }
                                            }
                                        } else {
                                            data.body[item]['body'] = stripTag.replace(/<[^>]*>/g, '');
                                        }
                                    }
                                }
                                // end check.

                                if (data.body[item].hasOwnProperty('type')) {
                                    if (data.body[item]['type']) {
                                        data.body[item]['contentMachineName'] = data.body[item]['type'];
                                        data.body[item]['type'] = this.contentNames[data.body[item]['type']];
                                    }
                                }
                            }
                        }
                    }
                    this.contentList = data.body.slice(0, 10);
                    for (const content in this.contentNames) {
                        if (this.contentNames) {
                            this.menuItems.push({
                                id: content,
                                label: this.contentNames[content]
                            });
                        }
                    }
                    this.tmpContentList = data.body;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     * Filter function used to filter the Content page
     */
    public filter(): void {
        this.contentList = this.tmpContentList.filter(data => {
            return (
                ((this.selectedFilter.type !== null) ? data.type === this.selectedFilter.type : true) &&
                ((this.selectedFilter.language !== null) ?
                    data.langcode.toUpperCase() === this.selectedFilter.language.toUpperCase().slice(0, 2) : true) &&
                ((this.selectedFilter.status !== null) ? ~~data.status === this.selectedFilter.status : true)
            );
        }).slice(0, 10);
    }

    /**
     * Clear the filter functions
     */
    public clearFilter(): void {
        this.contentList = this.tmpContentList.slice(0, 10);
        this.limit = 10;
    }

    /**
     * Function used to get the filter options dynamic
     */
    public filterItems(): void {
        this.items = Array.from(new Set(this.tmpContentList.map(data => data.type)));
    }

    /**
     * Delete function
     * @param id - the content UID
     * @param nid - the content NID
     * @param name
     */
    public deleteContent(id, nid, name): Content[] {
        this.wsService.sendRequest({eventType: 'content', event: 'DeleteEntity', data: {
                token: this.auth.getToken(), entityType: 'node', bundle: name, id: id
            }});
        const index = this.tmpContentList.findIndex(content => content.uuid === id);
        this.tmpContentList.splice(index, 1);
        this.contentList = this.tmpContentList.filter( x => {
            return x.nid !== nid;
        }).slice(0, 10);
        return this.tmpContentList;
    }

    /**
     * cancel delete user function
     */
    public return() {
        this.deleteStatus = false;
        this.checkbox = null;
    }

    /**
     * Shows more.
     */
    public showMore() {
        this.limit += 10;
        this.contentList = this.tmpContentList.slice(0, this.limit);
    }
}
