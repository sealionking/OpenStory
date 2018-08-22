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
                        this.messageService.add('Locked');
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

    /**
     * Allows us to perform checks on the resulting form after submit
     * @param data
     * @param array
     */
    checkForm(data, list, defaultList) {
        for (const i in data) {
            const prop = data[i];
            if (prop instanceof Object && Object.keys(prop).length > 0) {
                const propLength = Object.keys(prop).length;
                for (let j = 0; j < propLength; j++) {
                    const propItem = prop[j];
                    if (propItem instanceof Object) {
                        if (Object.keys(propItem).length > 0) {
                            for (const k in propItem) {
                                if (propItem[k] instanceof Array) {
                                    const propValue = propItem[k];
                                    const values = [];
                                    for (const value in propValue) {
                                        if (Object.keys(list).length > 0) {
                                            if (list.hasOwnProperty(i)) {
                                                if (propValue[value] === 'true') {
                                                    values.push({value: true});
                                                } else if (propValue[value] === 'false') {
                                                    values.push({value: false});
                                                } else {
                                                    values.push({value: propValue[value]});
                                                }
                                            } else {
                                                values.push({value: propValue[value]});
                                            }
                                        } else {
                                            values.push({value: propValue[value]});
                                        }
                                    }
                                    data[i] = values;
                                }
                            }
                        }
                    }
                }
            }
        }
        for (const m in defaultList) {
            if (!data.hasOwnProperty(m)) {
                data[m] = [];
            }
        }
    }

    /**
     * Allow us to create an array with the keys from the schema Form
     * We use this to check the 'checkbox' type in order to change string to boolean
     * @param data
     * @param array
     */
    checkboxCheck(data, list) {
        for (const i in data) {
            const prop = data[i];
            if (typeof prop === 'object') {
                let fieldKey = '';
                if (prop.hasOwnProperty('key')) {
                    fieldKey = prop['key'];
                }
                if (prop.hasOwnProperty('items')) {
                    const items = prop['items'];
                    if (items.hasOwnProperty('items')) {
                        const nestedItems = items['items'];
                        if (nestedItems instanceof Array) {
                            const itemObject = nestedItems[0];
                            if (itemObject.hasOwnProperty('type')) {
                                if (itemObject['type'] === 'checkboxes') {
                                    list[fieldKey] = itemObject['type'];
                                } else if (itemObject['type'] === 'radios') {
                                    list[fieldKey] = itemObject['type'];
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Allows us to send empty data needed for the CSM
     * @param schema
     * @param defaultList
     */
    neededList(schema, defaultList) {
        for (const i in schema) {
            defaultList[i] = i;
        }
    }
}

