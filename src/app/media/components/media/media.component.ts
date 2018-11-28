import {Component, OnInit} from '@angular/core';

import {Media} from '../../models/media';
import {MediaService} from '../../services/media.service';
import {MessageService} from '../../../core/services/message.service';
import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {NgxMasonryOptions} from 'ngx-masonry';
import {StatusCodesService} from '../../../core/services/status-code.service';

/**
 * MediaComponent allows us to display and filter the available files on the CMS.
 */
@Component({
    selector: 'app-media',
    templateUrl: './media.component.html',
    styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
    /**
     *Array used to retrieve data from the server.
     */
    mediaList: Media[] = [];
    /**
     * *Items for the filter type list.
     * @type {Array<Object>}
     */
    type = [{id: 'image', name: 'Image'}, {id: 'video', name: 'Video'}, {id: 'audio', name: 'Audio'},
        {id: 'application', name: 'Documents'}, {id: 'text', name: 'Text'}];
    /**
     * Items for the filter date list.
     * @type {any[]}
     */
    date: Array<any> = [];
    /**
     * Masonry option used to check the filter option
     * @type {null}
     */
    selectedType: string = null;
    /**
     * Masonry option used to check the filter option
     * @type {null}
     */
    selectedDate: number = null;
    /**
     * The lower range for the items per page
     * @type {number}
     */
    lowerLimit = 0;
    /**
     * The upper range for the items per page
     * @type {number}
     */
    upperLimit = 10;
    /**
     * Conditional variable
     */
    initContent = false;
    /**
     /**
     * Masonry animation options
     */
    public lottieConfig: Object;
    public noContent: Object;
    /**
     * Masonry animation options
     */
    public masonryOptions: NgxMasonryOptions = {
        transitionDuration: '1s',
        percentPosition: true,
        resize: true,
        initLayout: true
    };
    /**
     * Used to get the filtered list length
     */
    bodyLength: number;
    /**
     * show or hide the lottie animations
     */
    lottieShow = false;
    /**
     * show hide the no media found message
     */
    message = false;


    /**
     * @ignore
     */
    constructor(private mediaService: MediaService,
                private auth: AuthenticateService,
                private messageService: MessageService,
                private statusCodes: StatusCodesService,
                private wsSocket: WebsocketService) {
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
    ngOnInit() {
        this.getDates();
    }

    /**
     * Function used to initialize the media library view
     * also used to filter and display more items
     */
    public getMediaLibrary(): void {
        let listing: any;
        listing = this.listingOptions(this.selectedType, this.selectedDate, this.lowerLimit, this.upperLimit);
        // TODO: Add unsubscribe on SOS-490
        this.wsSocket.sendRequest({
            eventType: 'media',
            event: 'ListMedia',
            data: listing
        })
            .take(1)
            .subscribe(data => {
                if (data.statusCode === 200) {
                    this.message = data.body.length === 0;
                    if (this.lowerLimit === 0) {
                        this.mediaList = data.body;
                        this.lottieShow = true;
                    } else {
                        this.mediaList = [...this.mediaList, ...data.body].slice(0, this.lowerLimit + 10);
                        this.lottieShow = true;
                    }
                } else if (this.statusCodes.checkStatusCode(data)) {
                    this.message = true;
                    return true;
                }
            });
    }

    /**
     * Allows us to reset the items per page and filter the view
     */
    public filterMediaLibrary(): void {
        this.bodyLength = 0;
        this.lowerLimit = 0;
        if (this.selectedType !== null || this.selectedDate !== null) {
            this.getMediaLibrary();
            setTimeout( () => this.getBodyLength(), 800);
        }
    }

    /**
     * Used to add 10 more files on the current view
     */
    public showMoreImages(): void {
        this.bodyLength = 0;
        this.lowerLimit += 10;
        this.getMediaLibrary();
        setTimeout( () => this.getBodyLength(), 800);
    }

    /**
     * Clears the filter functions.
     */
    public clear(): void {
        this.bodyLength = 0;
        this.lowerLimit = 0;
        this.getMediaLibrary();
        setTimeout( () => this.getBodyLength(), 800);
    }

    /**
     * Public function used to populate the date filter
     * also used to initialize the grid
     */
    public getDates(): void {
        // TODO: Add unsubscribe on SOS-490
        this.wsSocket.sendRequest({
            eventType: 'media',
            event: 'ListMedia',
            data: {
                token: this.auth.getToken()
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.statusCode === 200) {
                    if (this.initContent) {
                        return;
                    } else {
                        this.initContent = true;
                    }
                    this.date = this.mediaService.populateFilters(data.body);
                    this.getMediaLibrary();
                    setTimeout( () => this.bodyLength = data.body.length, 1100);
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     *  Public function used to retrieve the current filtered array length
     */
    public getBodyLength(): void {
        // TODO: Add unsubscribe on SOS-490
        let listing: any;
        let init = false;
        listing = this.listingOptions(this.selectedType, this.selectedDate, 0, this.lowerLimit + 20);
        this.wsSocket.sendRequest({
            eventType: 'media',
            event: 'ListMedia',
            data: listing
        })
            .take(1)
            .subscribe(data => {
                if (init) {
                    return;
                } else {
                    init  = true;
                }
                if (data.statusCode === 200) {
                    this.bodyLength = data.body.length;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     * Private function that allows us to determine what to display for the media listing
     * @param type - filter option used to determine the selected file type
     * @param date - filter option used to determine the selected month
     * @param start - used to determine where the array starts
     * @param limit - items per page
     */
    private listingOptions(type: string, date: any, start: number, limit: number): any {
        let listing: any;
        if ((this.selectedType === null && this.selectedDate === null)) {
            listing = {
                token: this.auth.getToken(),
                filters: {
                    start_limit: start,
                    end_limit: limit
                }
            };
        } else if ((this.lowerLimit >= 0 && this.selectedType !== null && this.selectedDate === null)) {
            listing = {
                token: this.auth.getToken(),
                filters: {
                    filemime: type,
                    start_limit: start,
                    end_limit: limit
                }
            };
        } else if ((this.lowerLimit >= 0 && this.selectedDate !== null && this.selectedType === null)) {
            listing = {
                token: this.auth.getToken(),
                filters: {
                    start_date: date['start'], end_date: date['end'],
                    start_limit: start, end_limit: limit
                }
            };
        } else if (this.selectedDate !== null && this.selectedType !== null) {
            listing = {
                token: this.auth.getToken(),
                filters: {
                    filemime: type,
                    start_date: date['start'], end_date: date['end'],
                    start_limit: start, end_limit: limit
                }
            };
        }
        return listing;
    }
}
