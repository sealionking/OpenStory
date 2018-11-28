import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {Comment} from '../../../comments/models/comments';
import {widgetsData} from '../../../shared/model/widget-model';
import {StatusCodesService} from '../../../core/services/status-code.service';

@Component({
    selector: 'app-comment-widget',
    templateUrl: './comment-widget.component.html',
    styleUrls: ['./comment-widget.component.scss']
})
export class CommentWidgetComponent implements OnInit {
    @Input() dataStatic: boolean;
    @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    commentList: Comment[];

    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private statusCodes: StatusCodesService) {
    }

    ngOnInit() {
        if (this.dataStatic === true) {
            this.commentList = widgetsData.commentList;
        } else {
            this.getCommentsList();
        }
    }

    /**
     * Comment listing
     */
    private getCommentsList() {
        this.wsSocket.sendRequest({
            eventType: 'comment',
            event: 'ListComment',
            data: {
                token: this.auth.getToken()
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    this.commentList = data.body.slice(0, 5);
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
                setTimeout(() => {
                    this.dataLoaded.emit(true);
                }, 0);
            });
    }

}
