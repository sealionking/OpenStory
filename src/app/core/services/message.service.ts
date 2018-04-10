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
    messages: Array<string> = [];

    /**
     * Adds a message and removes it after 3s
     * @param {string} message - The string which will display in the message.
     */
    add(message: string): void {
        this.messages.push(message);
        setTimeout(() => { this.clear();
        }, 3000 );
    }

    /**
     * Empties the Array
     */
    clear(): void {
        this.messages = [];
    }
}
