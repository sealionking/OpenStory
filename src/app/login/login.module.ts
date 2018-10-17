import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    RECAPTCHA_SETTINGS,
    RecaptchaLoaderService,
    RecaptchaModule,
    RecaptchaSettings,
} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';

import {LoginComponent} from './components/login/login.component';
import {LoginRoutingModule} from './login-routing.module';

const globalSettings: RecaptchaSettings = {siteKey: '6LeLwGkUAAAAAB2JjAeM07b5nhZRw8yAWx5-Acj0'};

/**
 * Used to implement the Login Component and the Routing for it
 */
@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        RecaptchaModule.forRoot(),
        RecaptchaFormsModule
    ],
    providers: [
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: globalSettings
        }
    ],
    declarations: [LoginComponent]
})
export class LoginModule {
}
