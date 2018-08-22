import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';

import {AuthenticateService} from './core/services/authenticate.service';
import {WebsocketService} from './core/services/websocket.service';

/**
 * Root component of the application
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    /**
     * Used to hide or show the side-menu and header
     */
    routeHidden: boolean;

    /**
     * In the Root Constructor we hide or show the Header and Side-menu
     * @param {AuthenticateService} auth - used in order to authenticate the user
     * @param {WebsocketService} wsService - used in order to connect to the server via socket
     * @param {Location} location - allows us to get the current url location
     * @param {Router} router - used to navigate through out the application
     */
    constructor(private auth: AuthenticateService,
                private location: Location,
                private router: Router,
                private wsService: WebsocketService) {
        // Checks to see if we have a token, hides/shows the side-menu  & header.
        this.routeHidden = (this.auth.getToken() !== null);
        // Subscribe to change page event, to show or hide the header.
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                this.routeHidden = (this.auth.getToken() !== null);
            }
            if (this.router.url === '/page-not-found') {
                this.routeHidden = false;
            }
        });
    }

    /**
     * @ignore
     */
    ngOnInit(): void {
        this.wsService.initSocket();
    }
}
