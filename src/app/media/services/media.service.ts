import {Injectable} from '@angular/core';

import {Media} from '../models/media';
import * as moment from 'moment';

/**
 * Media module service file
 */
@Injectable()
export class MediaService {
    /**
     * @ignore
     */
    constructor() {
    }

    /**
     * Populate type from media
     * @param {string} mime
     * @param {Array<any>} types
     * @returns {string}
     */
    fileMimeToType(mime: string, types: Array<any>): string {
        let type = null;
        if (mime) {
            types.forEach(t => {
                if (mime.indexOf(t.id) >= 0) {
                    type = t.id;
                }
            });
        } else {
            type = 'value';
        }
        return type;
    }

    /**
     * Populate the data filter from media listing
     * the object built contains the start and end date of any month, regardless of year
     * @param {Array<Media>} medias - The media from listing
     * @returns {Array<any>} - The filter data
     */
    public populateFilters(medias: Array<Media>): Array<any> {
        const filterDate = [];
        const now = new Date();
        const currentMonth = moment(now).format('MMMM');
        for (let x = 0; x < 6; x++) {
            filterDate.push({
                id: moment().month(currentMonth).subtract(x, 'months').format('MM'),
                interval: {
                    start: moment().month(currentMonth).subtract(x, 'months').utc().startOf('month').unix().valueOf(),
                    end: moment().month(currentMonth).subtract(x, 'months').endOf('month').unix().valueOf()
                },
                name: moment().month(currentMonth).subtract(x, 'months').format('MMMM') + ' ' +
                    moment().month(currentMonth).subtract(x, 'months').format('YYYY')
            });
        }
        return filterDate;
    }
}
