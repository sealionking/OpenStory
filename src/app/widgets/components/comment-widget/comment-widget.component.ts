import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {MessageService} from '../../../core/services/message.service';
import {Comment} from '../../../comments/models/comments';
import {widgetsData} from '../../../shared/model/widget-model';

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
                private messageService: MessageService
    ) {
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
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        this.commentList = data.body.slice(0, 5);
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
                setTimeout(() => {
                    this.dataLoaded.emit(true);
                }, 0);
            });
    }

}
