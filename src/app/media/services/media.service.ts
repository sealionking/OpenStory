import { Injectable } from '@angular/core';

import {AuthenticateService} from '../../core/services/authenticate.service';
import {Media} from '../models/media';
import {WebsocketService} from '../../core/services/websocket.service';
import * as moment from 'moment';

/**
 *Class that sends request to the server.
 */
@Injectable()
export class MediaService {
    /**
     * @ignore
     */
    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService) { }

    /**
     * Function that sends token and request to the server.
     */
    public getMedia() {
        this.wsSocket.sendEvent({
            event: 'getMedia',
            data: {
                token: this.auth.getToken()
            }
        });
    }

    /**
     * Populate type from media
     * @param {string} mime
     * @param {Array<any>} types
     * @returns {string}
     */
    fileMimeToType(mime: string, types: Array<any>): string {
        let type = null;
        types.forEach(t => {
            if (mime.indexOf(t.id) >= 0) {
                type = t.id;
            }
        });

        return type;
    }

    /**
     * Populate filters from media listing with date.
     * @param {Array<Media>} medias - The media from listing
     * @returns {Array<any>} - The filter data
     */
    public populateFilters(medias: Array<Media>): Array<any> {
        const filterDate = [];
        medias.forEach(med => {
            const date = moment(med.created * 1000);
            med['month'] = date.format('MM');
            if (filterDate.filter(d => d.id === date.format('MM')).length === 0) {
                filterDate.push({id: date.format('MM'), name: date.format('MMMM')});
            }
        });

        return filterDate;
    }
}
