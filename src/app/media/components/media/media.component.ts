import { Component, OnInit } from '@angular/core';

import {Media} from '../../models/media';
import {MediaService} from '../../services/media.service';
import {MessageService} from '../../../core/services/message.service';
// import {NgxMasonryOptions} from '../../../masonry/ngx-masonry-options.interface';
import {WebsocketService} from '../../../core/services/websocket.service';

/**
 * MediaComponent allows us to display the list of media .
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
    mediaList: Array<Media>;
    /**
     *Items for the filter type list.
     * @type {{id: string; name: string}[]}
     */
    type = [{id: 'image', name: 'Image'}, {id: 'video', name: 'Video'}, {id: 'audio', name: 'Audio'}, {id: 'application', name: 'Docs'}];
    /**
     * Items for the filter date list.
     * @type {any[]}
     */
    date = [];
    /**
     * Masonry option used to check the filter option
     * @type {null}
     */
    selectedType: string = null;
    /**
     * Masonry option used to check the filter option
     * @type {null}
     */
    selectedDate: string = null;
    /**
     * variable that stores the list of media.
     * @type {Array<Media>}
     */
    tmpMedia = this.mediaList;
    /**
     * Array used to store filtered items.
     * @type {any[]}
     */
    filteredMedia: Array<Media> = [];
    /**
     * Variable that count the items listed on page.
     * @type {number}
     */
    limit = 15;
    /**
     * Mansonry animation options
     * @type {{transitionDuration: string; resize: boolean}}
     */

    public lottieConfig: Object;
    /**
     * @ignore
     */
    constructor(private mediaService: MediaService,
                private messageService: MessageService,
                private wsSocket: WebsocketService) {
        this.lottieConfig = {
            path: 'assets/json/loader.json',
            autoplay: true,
            loop: true
        };
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.mediaService.getMedia();
        this.listenMedia();
    }
    /**
     * Get list of media.
     */
    public listenMedia(): void {
        this.wsSocket.eventListen('ListMedia')
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.mediaList = data.body.filter(x => {
                            return x.filemime !== 'application/octet-stream';
                        });
                        this.date = this.mediaService.populateFilters(this.mediaList);
                        this.mediaList.forEach(media => {
                            media['fileType'] = this.mediaService.fileMimeToType(media.filemime, this.type);
                        });
                        this.tmpMedia = this.mediaList;
                        this.filteredMedia = this.mediaList;
                        this.mediaList = this.tmpMedia.slice(0, this.limit);
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

    /**
     * Filter media by value from inputs..
     */
    filterMedia() {
        // Reset the limit of the show more.
        this.limit = 15;
        this.filteredMedia =  this.tmpMedia.filter(data => {
            return (
                (this.selectedType !== null ? data['fileType'] === this.selectedType : true) &&
                (this.selectedDate !== null ? data['month'] === this.selectedDate : true)
            );
        });
        this.mediaList = this.filteredMedia.slice(0, this.limit);
    }

    /**
     * Shows more media files.
     */
    showMoreImages() {
        this.limit += 15;
        this.mediaList = this.filteredMedia.slice(0, this.limit);
    }
    /**
     * Clears the filter functions.
     */
    clear() {
        this.mediaList = this.mediaList.slice(0, 15);
    }

    fileSize(size) {
        return size / 1024000;
    }
}
