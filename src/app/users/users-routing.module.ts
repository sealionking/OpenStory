import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UsersComponent} from './components/users/users.component';
import {NewUserComponent} from './components/new-user/new-user.component';
import {EditUserComponent} from './components/edit-user/edit-user.component';

const routes: Routes = [
    {
        path: '',
        component: UsersComponent
    },
    {
        path: 'new-user',
        component: NewUserComponent
    },
    {
        path: 'user/:id',
        component: EditUserComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
