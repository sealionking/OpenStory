import {Injectable} from '@angular/core';

import {MessageService} from './message.service';
import {WebsocketService} from './websocket.service';

@Injectable()
export class StatusCodesService {

    /**
     * @ignore
     * @param messageService - message service
     * @param wsService - web socket service
     */
    constructor(private messageService: MessageService,
                private wsService: WebsocketService) {
    }

    /**
     * Used to detect the correct status code sent from the server
     * also used to display the correct status code message
     * @param data
     */
    public checkStatusCode(data: any) {
        switch (data.statusCode) {
            case 400:
                this.messageService.add('Bad request.');
                break;
            case 401:
                if (data.hasOwnProperty('body')) {
                    if (data['body'].hasOwnProperty('message')) {
                        this.messageService.add(data.body.message);
                    } else {
                        this.messageService.add('Unauthorized.', 'danger');
                    }
                }
                break;
            case 403:
                this.messageService.add('Access denied.');
                break;
            case 404:
                this.messageService.add('Not Found.');
                break;
            case 422:
                if (data.hasOwnProperty('body')) {
                    if (data['body'].hasOwnProperty('message')) {
                        this.messageService.add(data.body.message);
                    } else {
                        this.messageService.add('Unprocessable Entity.', 'danger');
                    }
                }
                break;
            case 423:
                this.messageService.add('Locked');
                this.wsService.ioReconnect();
                break;
            case 500:
                this.messageService.add(data.body);
                break;
            default:
                this.messageService.add('Connection issues between UI and Server');
        }
    }
}
