import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';

import {EventD} from '../../shared/model/eventData';

/**
 * Web-Socket service used to start a connection and maintain it with the server
 */
@Injectable()
export class WebsocketService {

    /**
     * Socket that connects to our socket.io server.
     */
    private socket;

    /**
     * Function that allows us to connect to our server via socket io websocket
     */
    public initSocket(): void {
        this.socket = io.connect(environment.ws_url);
        this.socket.on('disconnect', () => {this.socket.open(); });
        this.socket.on('Timeout', () => { setTimeout(() => {
            this.socket.open();
            this.sendEvent({eventType: 'timeout', event: 'TimeOutConnection', data: {
                   token: localStorage.getItem('token')}});
            }, 0); });
    }
    /**
     * Reconnect function on disconnect.
     */
    public ioReconnect(): void {
        this.socket.on('disconnect', () => {
            this.socket.open();
        });
    }

    /**
     * General function that allows us to
     * emit data to the server via socket io
     * @param {EventD} eventData
     */
    public sendEvent(eventData: EventD) {
        this.socket.emit('genericEvent', eventData);
    }

    /**
     * General function that allows us to listen for events from the server via socket io
     * @param events
     * @return {Observable<any>}
     */
    public eventListen(events): Observable<any> {
        return new Observable(observer => {
            this.socket.on(events, (data: any) => {
                observer.next(data);
            });
        });
    }

    /**
     * Allows us to send and receive events
     * @param {EventD} eventData
     * @return {Observable<any>}
     */
    public sendRequest(eventData: EventD) {
        this.sendEvent(eventData);
        return this.eventListen(eventData.event);
    }
}
