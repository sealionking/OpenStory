import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {OrderModule} from 'ngx-order-pipe';

import {MessagesComponent} from './components/messages/messages.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        FilterPipeModule,
        OrderModule
    ],
    declarations: [
        MessagesComponent
    ],
    exports: [
        CommonModule,
        MessagesComponent,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        FilterPipeModule,
        OrderModule
    ]
})
export class SharedModule {
}
