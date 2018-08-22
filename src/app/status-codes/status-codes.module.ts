import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {AccessDeniedComponent} from './components/access-denied/access-denied.component';
import {NotFoundComponent} from './components/not-found/not-found.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [AccessDeniedComponent, NotFoundComponent]
})
export class StatusCodesModule {
}
