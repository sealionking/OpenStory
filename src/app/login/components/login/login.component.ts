import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {AuthenticatedUser} from '../../model/authenticated-user';
import {WebsocketService} from '../../../core/services/websocket.service';
import {StatusCodesService} from '../../../core/services/status-code.service';

/**
 * Login Component
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private loginInit: Subscription;
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
                private statusCodes: StatusCodesService,
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
    ngOnInit(): void {
    }

    /**
     * User login function
     */
    onSubmit(): void {
        this.loginInit = this.wsService.sendRequest({
            eventType: 'authenticate',
            event: 'UserLogin',
            data: {name: this.model.name, password: this.model.password}
        })
            .take(1)
            .subscribe((data) => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    localStorage.setItem('token', data.body.token);
                    this.router.navigate(['/dashboard']);
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }
}
