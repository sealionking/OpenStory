import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {Comment} from '../../models/comments';
import {CommentsService} from '../../services/comments.service';
import {NgxMasonryOptions} from 'ngx-masonry';
import {WebsocketService} from '../../../core/services/websocket.service';
import {MessageService} from '../../../core/services/message.service';
import {StatusCodesService} from '../../../core/services/status-code.service';

/**
 * CommentsComponent allows us to display the list of comments .
 */
@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {
    private view: Subscription;
    /**
     * Array used to retrieve data from the server.
     */
    commentsList: Comment[];
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
    tmpList: Comment[];
    limit = 10;

    public lottieConfig: Object;
    public noContent: Object;
    /**
     * Masonry animation options
     */
    public masonryOptions: NgxMasonryOptions = {
        transitionDuration: '1s',
        percentPosition: true,
        resize: true,
        initLayout: true,
        columnWidth: 1
    };
    /**
     *@ignore
     */
    constructor(private commentsService: CommentsService,
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
        this.commentsService.getCommentsList();
        this.listenComments();
    }

    /**
     * @ignore
     */
    ngOnDestroy(): void {
        this.view.unsubscribe();
    }

    /**
     * Get list of Comments.
     */
    private listenComments(): void {
        this.view = this.wsSocket.eventListen('ListComment')
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.commentsList = data.body.slice(0, 10);
                    this.date = this.commentsService.populateFilters(this.commentsList);
                    this.tmpList = data.body;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     * Filter comments by values from inputs.
     */
    public filterComments(): void {
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
    public clear() {
        this.commentsList = this.tmpList.slice(0 , 10);
    }

    /**
     * Shows more.
     */
    public showMore() {
        this.limit += 10;
        this.commentsList = this.tmpList.slice(0, this.limit);
    }
}
