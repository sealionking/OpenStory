import {Component, OnInit} from '@angular/core';

import {Comment} from '../../models/comments';
import {CommentsService} from '../../services/comments.service';
// import {NgxMasonryOptions} from '../../../masonry/ngx-masonry-options.interface';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {WebsocketService} from '../../../core/services/websocket.service';
import {MessageService} from '../../../core/services/message.service';

/**
 * CommentsComponent allows us to display the list of comments .
 */
@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
    /**
     * Array used to retrieve data from the server.
     */
    commentsList: Array<Comment>;
    /**
     * Items for the filter status list.
     * @type {{id: string; name: string}[]}
     */
    status = [{id: '1', name: 'Published'}, {id: '0', name: 'Unpublished'}];
    /**
     * Items for the filter date list.
     * @type {any[]}
     */
    date = [];
    /**
     * asonry option used to check the filter option.
     * @type {null}
     */
    selectedDate: string = null;
    /**
     * asonry option used to check the filter option.
     * @type {null}
     */
    selectedType: string = null;
    /**
     * variable that stores the list of media.
     * @type {Array<Comment>}
     */
    tmpList = this.commentsList;
    /**
     * Mansonry animation options
     * @type {{transitionDuration: string; resize: boolean}}
     */
    // public masonryOptions: NgxMasonryOptions = {
    //     transitionDuration: '0.4s',
    //     resize: true
    // };
    /**
     *@ignore
     */
    constructor(private commentsService: CommentsService,
                private messageService: MessageService,
                private spinnerService: Ng4LoadingSpinnerService,
                private wsSocket: WebsocketService) {
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.commentsService.getCommentsList();
        this.listenComments();
    }

    /**
     * Get list of Comments.
     */
    public listenComments(): void {
        this.spinnerService.show();
        this.wsSocket.eventListen('getCommentsList')
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.commentsList = data.body;
                        this.date = this.commentsService.populateFilters(this.commentsList);
                        this.tmpList = this.commentsList;
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
     * Filter comments by values from inputs.
     */
    filterComments(): void {
        this.commentsList = this.tmpList.filter(data => {
            return (
                (this.selectedType !== null ? data.status === this.selectedType : true) &&
                (this.selectedDate !== null ? data['month'] === this.selectedDate : true)
            );
        });
    }

    /**
     * Clears the filter functions.
     */
    clear() {
        this.commentsList = this.tmpList;
    }
}
