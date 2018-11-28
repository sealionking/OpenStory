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
     * Easy to change messages/alerts
     * @param key
     */
    public getMessageType(key) {
        const messages = {
            'content-edit': 'Content has been successfully edited.',
            'content-create': 'Content has been successfully created.',
            'user-edit': 'User has been successfully edited.',
            'user-create': 'User has been successfully created.',
            'reference-create': 'Entity created. You can now add the reference.',
            '400': 'Bad request.',
            '403': 'Access denied.',
            '404': 'Item not found.',
            '423': 'Locked'
        };
        if (messages.hasOwnProperty(key)) {
            return messages[key];
        } else {
            return key;
        }
    }

    /**
     * Used to detect the correct status code sent from the server
     * also used to display the correct status code message
     * @param data
     */
    public checkStatusCode(data: any) {
        if (data.hasOwnProperty('statusCode')) {
            switch (data.statusCode) {
                case 400:
                    this.messageService.add(this.getMessageType('400'), 'os-danger');
                    break;
                case 401:
                    if (data.hasOwnProperty('body')) {
                        this.messageService.add(data.body, 'os-warning');
                    } else {
                        this.messageService.add('Unauthorized.', 'os-warning');
                    }
                    break;
                case 403:
                    if (data.hasOwnProperty('body')) {
                        this.messageService.add(data.body, 'os-danger');
                    } else {
                        this.messageService.add(this.getMessageType('403'), 'os-danger');
                    }
                    break;
                case 404:
                    this.messageService.add(this.getMessageType('404'), 'os-danger');
                    break;
                case 422:
                    if (data.hasOwnProperty('body')) {
                        data.body.forEach((item) => {
                            if (typeof item === 'object' && item.hasOwnProperty('message')) {
                                this.messageService.add(item['message'], 'os-info');
                            } else {
                                this.messageService.add('Unprocessable entity', 'os-danger');
                            }
                        });
                    } else {
                        this.messageService.add('Unprocessable entity', 'os-danger');
                    }
                    break;
                case 423:
                    this.messageService.add(this.getMessageType('423'), 'os-warning');
                    this.wsService.ioReconnect();
                    break;
                case 500:
                    if (data.hasOwnProperty('body')) {
                        this.messageService.add(data.body, 'os-danger');
                    } else {
                        this.messageService.add('Internal Server Error', 'os-danger');
                    }
                    break;
                default:
                    this.messageService.add('Connection issues between UI and Server', 'os-danger');
            }
        }
    }
}
