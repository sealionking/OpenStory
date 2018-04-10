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
    messages: Array<string>;

    /**
     * @ignore
     * @param {MessageService} message
     */
    constructor(private message: MessageService) {
        this.messages = this.message.messages;
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
        return this.message.messages.length;
    }

    /**
     * Removes the message
     */
    clear(): void {
        this.message.clear();
    }
}
