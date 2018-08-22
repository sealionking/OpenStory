import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {InlineSVGModule} from 'ng-inline-svg';
import {HttpClientModule} from '@angular/common/http';

import {MessagesComponent} from './components/messages/messages.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {OrderModule} from 'ngx-order-pipe';
import {TooltipModule} from 'ngx-bootstrap';
import {CKEditorModule} from 'ng2-ckeditor';
import {AlertModule} from 'ngx-bootstrap';
import {TruncateModule} from '@yellowspot/ng-truncate';
import {DoublebounceComponent} from './components/doublebounce/doublebounce.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        FilterPipeModule,
        OrderModule,
        HttpClientModule,
        InlineSVGModule,
        TooltipModule.forRoot(),
        CKEditorModule,
        AlertModule.forRoot(),
        TruncateModule
    ],
    declarations: [
        MessagesComponent,
        DoublebounceComponent
    ],
    exports: [
        CommonModule,
        MessagesComponent,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        FilterPipeModule,
        OrderModule,
        InlineSVGModule,
        TooltipModule,
        CKEditorModule,
        AlertModule,
        TruncateModule,
        DoublebounceComponent
    ]
})
export class SharedModule {
}
