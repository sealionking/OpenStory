import {Component, OnInit} from '@angular/core';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {AuthenticatedUser} from '../../model/authenticated-user';
import {Router} from '@angular/router';
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

    /**
     * Used as input reference for the login form.
     * @type {{name: string; password: string}}
     */
    model: AuthenticatedUser = {
        name: '',
        password: ''
    };

    /**
     * @ignore
     */
    constructor(private wsService: WebsocketService,
                private auth: AuthenticateService,
                private router: Router) {
    }

    /**
     * Initiates a socket connection with the server
     * Verifies if we have a token present.
     */
    ngOnInit(): void {
        this.auth.initLoginConnection();
        if (this.auth.getToken() !== null) {
            this.router.navigate(['']);
        }
    }

    /**
     * User login function
     */
    onSubmit(): void {
        this.auth.serverEvent({event: 'user.login', data: {name: this.model.name, password: this.model.password}});
    }
}
