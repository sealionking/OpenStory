import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LoginComponent} from './components/login/login.component';
import {LoginRoutingModule} from './login-routing.module';

/**
 * Used to implement the Login Component and the Routing for it
 */
@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {
}
