import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';

import {WebsocketService} from './websocket.service';
import {StatusCodesService} from './status-code.service';

/**
 * Authenticate service used mainly for Login
 */
@Injectable()
export class AuthenticateService {
    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
                private statusCodes: StatusCodesService,
                private route: Router
    ) {
    }

    /**
     * Function used to listen to the http codes sent from the server
     * after the login event
     */
    initLoginConnection(): void {
        this.wsService.eventListen('UserLogin')
            .take(1)
            .subscribe((data) => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    localStorage.setItem('token', data.body.token);
                    this.route.navigate(['/dashboard']);
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     * Allows us to logout the user.
     */
    public logout(): void {
        this.serverEvent({event: 'UserLogout', data: {token: this.getToken()}});
        localStorage.removeItem('token');
        this.route.navigate(['/login']);
    }

    /**
     * Used to check if the token is present in the local storage
     * @return {boolean}
     */
    public isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    /**
     * Retrieves the token from local storage
     * @return {string | null}
     */
    public getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Allows us to emit any server event
     * @param eventData
     */
    public serverEvent(eventData): void {
        this.wsService.sendEvent(eventData);
    }

    /**
     * Allows us to decode the JWT token from storage.
     * @param {string} token
     * @return {any}
     */
    private getDecodedAccessToken(token: string): any {
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
    public getUserInfo(): any {
        const token = this.getToken();
        const tokenInfo = this.getDecodedAccessToken(token);
        return tokenInfo;
    }

    /**
     * Allows us to get the current year
     */
    public getYear(): number {
        const data = new Date().getFullYear();
        return data;
    }
}

