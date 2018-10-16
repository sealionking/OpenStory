import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';

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
                private messageService: MessageService
    ) {
    }

    /**
     * Function used to listen to the http codes sent from the server
     * after the login event
     */
    initLoginConnection(): void {
        this.initLogin = this.wsService.eventListen('UserLogin')
            .subscribe((data) => {
                switch (data.statusCode) {
                    case 200:
                        localStorage.setItem('token', data.body.token);
                        this.route.navigate(['/dashboard']);
                        break;
                    case 400:
                        this.messageService.add('Bad request.');
                        break;
                    case 401:
                        this.messageService.add('Access denied.');
                        break;
                    case 403:
                        this.messageService.add('Access denied.');
                        break;
                    case 404:
                        this.messageService.add('Not Found.');
                        break;
                    case 422:
                        this.messageService.add('Unprocessable Entity.');
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
                return data;
            });
    }

    /**
     * Allows us to logout the user.
     */
    logout(): void {
        this.serverEvent({event: 'UserLogout', data: {token: this.getToken()}});
        localStorage.removeItem('token');
        this.route.navigate(['/login']);
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
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Allows us to emit any server event
     * @param eventData
     */
    serverEvent(eventData): void {
        this.wsService.sendEvent(eventData);
    }

    /**
     * Allows us to decode the JWT token from storage.
     * @param {string} token
     * @return {any}
     */
    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        } catch (Error) {
            return null;
        }
    }

    /**
     * Using the jwt decoding function we can now break down the token properties
     * Allowing us to manipulate the data stored within
     * @return {any}
     */
    getUserInfo(): any {
        const token = this.getToken();
        const tokenInfo = this.getDecodedAccessToken(token);
        return tokenInfo;
    }

    /**
     * Allows us to get the curreny year
     */
    getYear(): number {
        const data = new Date().getFullYear();
        return data;
    }
}

