import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AuthGuard} from './core/guard/auth-guard';
import {NotFoundComponent} from './status-codes/components/not-found/not-found.component';
import {AccessDeniedComponent} from './status-codes/components/access-denied/access-denied.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', loadChildren: 'app/login/login.module#LoginModule' },
    { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
    { path: 'users', loadChildren: 'app/users/users.module#UsersModule', canActivate: [AuthGuard] },
    { path: 'comments', loadChildren: 'app/comments/comments.module#CommentsModule', canActivate: [AuthGuard] },
    { path: 'content', loadChildren: 'app/content/content.module#ContentModule', canActivate: [AuthGuard] },
    { path: 'media', loadChildren: 'app/media/media.module#MediaModule', canActivate: [AuthGuard] },
    { path: 'charts', loadChildren: 'app/echarts/echarts.module#EchartsModule', canActivate: [AuthGuard] },
    { path: 'page-not-found', component: NotFoundComponent, canActivate: [AuthGuard] },
    { path: 'access-denied', component: AccessDeniedComponent },
    { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
    exports: [ RouterModule ],
    imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
