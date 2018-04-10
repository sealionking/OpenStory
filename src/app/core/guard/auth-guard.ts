import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthenticateService} from '../services/authenticate.service';

/**
 * Guard Interface used to tell the router whether or not it should allow navigation to a requested route
 */
@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * @ignore
     */
    constructor(private auth: AuthenticateService,
                private router: Router) {
    }

    /**
     * Performs a check to see if we have a token
     * Redirects if TRUE
     * @return {boolean}
     */
    canActivate(): boolean {
        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
