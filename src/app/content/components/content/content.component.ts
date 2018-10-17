import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {Content} from '../../model/content';
import {ContentService} from '../../services/content.service';
import {MessageService} from '../../../core/services/message.service';
import {WebsocketService} from '../../../core/services/websocket.service';

/**
 * Content Component allows us to view the CMS content
 */
@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
    /**
     * @ignore
     */
    show = false;
    menuItems = [];
    /**
     * Used to load the content page once
     * @type {boolean}
     */
    initContent = false;
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
     * Items for the dropdown filter list
     * @type {string[]}
     */
    contentLanguage = [{id: 'English', name: 'English'}, {id: 'French', name: 'French'}, {id: 'German', name: 'German'}];
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

    public lottieConfig: Object;
    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService,
                private contentService: ContentService) {
        this.lottieConfig = {
            path: 'assets/json/loader.json',
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
     * Returns content types available
     * @return {any}
     */
    getContentListType(): void {
        this.wsService.sendRequest({eventType: 'entity', event: 'ListEntities', data: {token: this.auth.getToken(), entityTypeId: 'node'}})
            .subscribe(
                data => {
                    switch (data.statusCode) {
                        case 200:
                            this.contentNames = data.body;
                            this.getContent();
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
                            this.messageService.add('Internal Server Error.');
                            break;
                        default:
                            this.messageService.add('Connection issues between UI and Server');
                    }}
            );
    }

    /**
     * Function that allows us to retrieve the Content data from the server
     */
    public getContent(): void {
        this.wsService.sendRequest({eventType: 'content', event: 'ListContent',
                        data: {token: this.auth.getToken(), sorting: { created: 'DESC' }}})
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        // TODO: Remove this functionality, when back-end fix multiple emits issue.
                        if (this.initContent) { return; } else {this.initContent = true; }
                        for (const item in data.body) {
                            const rex = data.body[item]['body'];
                            if (data.body[item]['type']) {
                                data.body[item]['contentMachineName'] = data.body[item]['type'];
                                data.body[item]['type'] = this.contentNames[data.body[item]['type']];
                            }
                            if (data.body[item]['body'] && data.body[item]['body'].length > 0) {
                                data.body[item]['body'] = rex.replace(/<[^>]*>/g, '');
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
     * Filter function used to filter the Content page
     */
    filter(): void {
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
    clearFilter(): void {
       this.contentList = this.tmpContentList.slice(0, 10);
       this.limit = 10;
    }

    /**
     * Function used to get the filter options dynamic
     */
    filterItems(): void {
        this.items = Array.from(new Set(this.tmpContentList.map(data => data.type)));
    }

    /**
     * Delete function
     * @param id - the content UID
     * @param nid - the content NID
     * @param name
     */
    deleteContent(id, nid, name): void {
        this.wsService.sendRequest({eventType: 'content', event: 'DeleteEntity', data: {
            token: this.auth.getToken(), entityType: 'node', bundle: name, id: id
            }});
        this.contentList = this.tmpContentList.filter( x => {
            this.selectedFilter.type = null;
            this.selectedFilter.status = null;
            this.selectedFilter.language = null;
            return x.nid !== nid;
        }).slice(0, 10);
    }

    /**
     * cancel delete user function
     */
    return() {
        this.deleteStatus = false;
        this.checkbox = null;
    }

    /**
     * Shows more.
     */
    showMore() {
        this.limit += 10;
        this.contentList = this.tmpContentList.slice(0, this.limit);
    }
}
