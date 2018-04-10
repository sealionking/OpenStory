import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JsonSchemaFormModule} from 'angular2-json-schema-form';

import {UsersComponent} from './components/users/users.component';
import {NewUserComponent} from './components/new-user/new-user.component';
import {SharedModule} from '../shared/shared.module';
import {UsersRoutingModule} from './users-routing.module';
import {UsersService} from './services/users.service';
import {EditUserComponent} from './components/edit-user/edit-user.component';


/**
 * The Users Page module
 * Just embedding <users> component and it's routing definition in {@link UsersRoutingModule}
 */
@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule,
        SharedModule,
        JsonSchemaFormModule
    ],
    providers: [UsersService],
    declarations: [UsersComponent, NewUserComponent, EditUserComponent],
    exports: [UsersComponent, NewUserComponent, EditUserComponent]
})
export class UsersModule {}
