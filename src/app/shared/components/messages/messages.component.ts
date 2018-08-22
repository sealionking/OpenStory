import {Component, OnInit} from '@angular/core';

import {MessageService} from '../../../core/services/message.service';

/**
 * Message Component
 */
@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    /**
     * Array of strings used to display numerous messages
     */
    messages = [];

    /**
     * @ignore
     * @param mService
     */
    constructor(private mService: MessageService) {
        this.messages = this.mService.messages;
    }

    /**
     * @ignore
     */
    ngOnInit(): void {
    }

    /**
     * Allows us to see if there is a message
     * @return {number}
     */
    messageLength(): number {
        return this.mService.messages.length;
    }

    /**
     * Removes the message
     */
    clear() {
        this.messages.length = 0;
    }
}
