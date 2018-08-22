import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {AuthenticatedUser} from '../../model/authenticated-user';
import {WebsocketService} from '../../../core/services/websocket.service';

/**
 * Login Component
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    currentYear: number;
    /**
     * Used as input reference for the login form.
     * @type {{name: string; password: string}}
     */
    model: AuthenticatedUser = {
        name: '',
        password: '',
    };

    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
                private router: Router,
                private auth: AuthenticateService) {
        if (this.auth.isAuthenticated() && this.router.url === '/login') {
            this.auth.logout();
        }
        this.currentYear = this.auth.getYear();
    }

    /**
     * Initiates a socket connection with the server
     * Verifies if we have a token present.
     */
    ngOnInit(): void { }

    /**
     * User login function
     */
    onSubmit(): void {
        this.auth.serverEvent(
            {eventType: 'authenticate', event: 'UserLogin', data: {name: this.model.name, password: this.model.password}});
        this.auth.initLoginConnection();
    }
}
