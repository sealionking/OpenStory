import { Injectable } from '@angular/core';

/**
 * Messages service used to relay different types of global messages to the user
 */
@Injectable()
export class MessageService {
    /**
     * Array of strings used to display numerous messages
     * @type {any[]}
     */
    messages = [];

    /**
     * Adds a message and removes it after 3s
     * @param {string} message - The string which will display in the message.
     * @param type
     */
    add(message: string, type?: string): void {
        this.messages.push({
            msg: message,
            type: type,
            timeout: 10000
        });
    }
}
