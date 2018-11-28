import {Component, ViewEncapsulation} from '@angular/core';

import {MessageService} from '../../../core/services/message.service';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';

/**
 * Message Component
 */
@Component({
    selector: 'app-messages',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
    /**
     * Array of strings used to display numerous messages
     */
    messages: any[] = [{
        msg: 'Demo alert!',
        type: 'success',
        timeout: 10000
    }];

    /**
     * @ignore
     * @param mService
     */
    constructor(private mService: MessageService) {
        this.messages = this.mService.messages;
    }

    /**
     * Removes the message
     */
    public clear(index: number) {
        this.messages.splice(index, 1);
    }

    /**
     * Add correct SVG to the correct type
     * @param type
     */
    public addCloseItem(type: string): string {
        switch (type) {
            case 'os-danger':
                return '../../../../assets/images/alerts/c_danger.svg';
            case 'os-info':
                return '../../../../assets/images/alerts/c_info.svg';
            case 'os-warning':
                return '../../../../assets/images/alerts/c_warning.svg';
            case 'os-success':
                return '../../../../assets/images/alerts/c_success.svg';
            default:
                return '../../../../assets/images/alerts/c_success.svg';
        }
    }

    /**
     * Add the custom OS types classes
     * @param type - string
     */
    public addClass(type: string): string {
        switch (type) {
            case 'os-danger':
                return 'os-danger';
            case 'os-info':
                return 'os-info';
            case 'os-warning':
                return 'os-warning';
            case 'os-success':
                return 'os-success';
            default:
                return 'os-success';
        }
    }
}
