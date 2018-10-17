import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {OsFormComponent} from './components/os-form/os-form.component';
import {SharedModule} from '../shared/shared.module';
import {TextSummaryComponent} from './components/text-summary/text-summary.component';
import {TextEditorComponent} from './components/text-editor/text-editor.component';
import {NouisliderModule} from 'ng2-nouislider';
import {UrlFieldComponent} from './components/url-field/url-field.component';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {RadioButtonComponent} from './components/radio-button/radio-button.component';
import {ModalModule, BsDatepickerModule} from 'ngx-bootstrap';
import {AngularDateTimePickerModule} from 'angular2-datetimepicker';
import { DateComponent } from './components/date/date.component';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import { ngfModule} from 'angular-file';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NouisliderModule,
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        AngularDateTimePickerModule,
        ngfModule
    ],
    declarations: [
        OsFormComponent,
        TextSummaryComponent,
        TextEditorComponent,
        UrlFieldComponent,
        CheckboxComponent,
        RadioButtonComponent,
        DateComponent,
        FileUploadComponent
    ],
    exports: [OsFormComponent]
})
export class OsFormsModule {
}
