import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OsFormComponent} from './components/os-form/os-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {TextSummaryComponent} from './components/text-summary/text-summary.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { NouisliderModule } from 'ng2-nouislider';
import { UrlFieldComponent } from './components/url-field/url-field.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NouisliderModule
    ],
    declarations: [
        OsFormComponent,
        TextSummaryComponent,
        TextEditorComponent,
        UrlFieldComponent,
        CheckboxComponent,
        RadioButtonComponent
    ],
    exports: [OsFormComponent]
})
export class OsFormsModule {
}
