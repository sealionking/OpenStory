import { Injectable } from '@angular/core';

import {AuthenticateService} from '../../core/services/authenticate.service';
import {Comment} from '../models/comments';
import {WebsocketService} from '../../core/services/websocket.service';
import * as moment from 'moment';

/**
 *Class that sends request to the server.
 */
@Injectable()
export class CommentsService {
    /**
     * @ignore
     */
    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService) { }

    /**
     * Function that sends token and request to the server.
     */
    public getCommentsList() {
            this.wsSocket.sendEvent({
                eventType: 'comment',
                event: 'ListComment',
                data: {
                    token: this.auth.getToken(), sorting: { created: 'DESC' }
            }
        });
    }

    /**
     * Populate filters from comments listing with data.
     * @param {Array<Comment>} comments - The comments from listing
     * @returns {Array<any>} - The filter data
     */
    public populateFilters(comments: Array<Comment>): Array<any> {
        const filterDate = [];
        comments.forEach(comm => {
            const date = moment(comm.created * 1000);
            comm['month'] = date.format('MM');
            if (filterDate.filter(d => d.id === date.format('MM')).length === 0) {
                filterDate.push({id: date.format('MM'), name: date.format('MMMM')});
            }
        });

        return filterDate;
    }

}
