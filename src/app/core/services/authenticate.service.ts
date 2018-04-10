import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {MessageService} from './message.service';
import {WebsocketService} from './websocket.service';

/**
 * Authenticate service used mainly for Login
 */
@Injectable()
export class AuthenticateService {
    /**
     * @ignore
     */
    initLogin: any;

    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
                private route: Router,
                private messageService: MessageService) {
    }

    /**
     * Function used to listen to the http codes sent from the server
     * after the login event
     */
    initLoginConnection(): void {
        this.initLogin = this.wsService.eventListen('user.login')
            .subscribe((data) => {
                switch (data.statusCode) {
                    case 200:
                        localStorage.setItem('token', data.body.token);
                        this.route.navigate(['/dashboard']);
                        break;
                    case 400:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Bad request.');
                        break;
                    case 401:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Access denied.');
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
                    case 423:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Unprocessable Entity.');
                        this.wsService.ioReconnect();
                        break;
                    case 500:
                        // TODO: add general messages - bootstrap.
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
                return data;
            });
    }

    /**
     * Allows us to logout the user.
     */
    logout(): void {
        this.serverEvent({event: 'user.logout', data: {token: this.getToken()}});
        localStorage.removeItem('token');
    }

    /**
     * Used to check if the token is present in the local storage
     * @return {boolean}
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    /**
     * Retrieves the token from local storage
     * @return {string | null}
     */
    getToken(): string|null {
        return localStorage.getItem('token');
    }

    /**
     * Allows us to emit any server event
     * @param eventData
     */
    serverEvent(eventData): void {
        this.wsService.sendEvent(eventData);
    }
}
