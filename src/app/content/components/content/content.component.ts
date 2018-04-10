import {Component, OnInit} from '@angular/core';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {Content} from '../../model/content';
import {ContentService} from '../../services/content.service';
import {MessageService} from '../../../core/services/message.service';
// import {NgxMasonryOptions} from '../../../masonry/ngx-masonry-options.interface';
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
    menuItems= [];
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
     * Masonry options
     * @type {{transitionDuration: string; resize: boolean}}
     */
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
     * Variable used to count the tweeter feed
     */
    tweetView: number;
    /**
     * Variable used to count the likes feed
     */
    fbView: number;
    /**
     * Variable used to count the share feed
     */
    shareView: number;
    contentNames: any;
    /**
     * Mansonry animation options
     * @type {{transitionDuration: string; resize: boolean}}
     */
    // public masonryOptions: NgxMasonryOptions = {
    //     transitionDuration: '0.4s',
    //     resize: true
    // };

    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService,
                private spinnerService: Ng4LoadingSpinnerService,
                private contentService: ContentService) {
    }
    /**
     * @ignore
     */
    ngOnInit(): void {
        this.sendContent();
        this.temporaryData();
        this.getContentListType();
    }

    /**
     * Function that allows us to retrieve the Content data from the server
     */
    public sendContent(): void {
        this.spinnerService.show();
        this.wsService.sendRequest({event: 'getContentList', data: {token: this.auth.getToken()}})
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        // TODO: Remove this functionality, when back-end fix multiple emits issue.
                        if(this.initContent){ return;} else {this.initContent = true;}
                        for(let item in data.body){
                            if(data.body[item]['type']){
                                data.body[item]['contentMachineName'] = data.body[item]['type'];
                                data.body[item]['type'] = this.contentNames[data.body[item]['type']];
                            }
                        }
                        this.contentList = data.body;
                        for(let sor in this.contentNames){
                            this.menuItems.push({
                                id: sor,
                                label: this.contentNames[sor]
                            });
                        }
                        // TODO: Remove this function. when back-end will give us the full url.
                        this.contentService.addFullPath(this.contentList);
                        this.tmpContentList = this.contentList;
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
                this.spinnerService.hide();
            });
    }

    /**
     * Returns Content body from the server
     * @param text
     * @return {Content}
     */
    bodySummary(text): Content {
        return this.contentService.summary(text);
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
        });
    }

    /**
     * Clear the filter functions
     */
    clearFilter(): void {
        this.contentList = this.tmpContentList;
    }

    /**
     * Function used to get the filter options dynamic
     */
    filterItems(): void {
        this.items = Array.from(new Set(this.tmpContentList.map(data => data.type)));
    }
    /**
     * Mock service for the tweet, facebook, share features
     */
    temporaryData(): void {
        this.tweetView = Math.floor((Math.random() * 100 + 1) + Math.random());
        this.fbView = Math.floor((Math.random() * 100 + 1) + Math.random());
        this.shareView = Math.floor((Math.random() * 100 + 1) + Math.random());
    }

    /**
     * Delete function
     * @param id
     */
    deleteContent(id): void {
        this.wsService.sendRequest({event: 'deleteEntity', data: {
            token: this.auth.getToken(), entityType: 'node', userId: id
            }});
        this.contentList = this.tmpContentList.filter( x => {
            this.selectedFilter.type = null;
            this.selectedFilter.status = null;
            this.selectedFilter.language = null;
            return x.nid !== id;
        });
    }

    getContentListType(){
        this.wsService.sendRequest({event: 'getEntitiesList', data: {token: this.auth.getToken(), entityTypeId: 'node'}})
            .subscribe(data => {
               this.contentNames = data.body;
            });
    }
}
