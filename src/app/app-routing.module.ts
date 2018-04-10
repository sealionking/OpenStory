import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AuthGuard} from './core/guard/auth-guard';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'login', loadChildren: 'app/login/login.module#LoginModule' },
    { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
    { path: 'users', loadChildren: 'app/users/users.module#UsersModule', canActivate: [AuthGuard] },
    { path: 'comments', loadChildren: 'app/comments/comments.module#CommentsModule', canActivate: [AuthGuard] },
    { path: 'content', loadChildren: 'app/content/content.module#ContentModule', canActivate: [AuthGuard] },
    { path: 'media', loadChildren: 'app/media/media.module#MediaModule', canActivate: [AuthGuard] }
];

@NgModule({
    exports: [ RouterModule ],
    imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
