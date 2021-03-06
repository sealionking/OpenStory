import {Component, OnInit, forwardRef, Input} from '@angular/core';
import {FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';

export interface TextSummary {
    summary: string;
    body: string;
    format?: string;
}

@Component({
    selector: 'app-text-summary',
    templateUrl: './text-summary.component.html',
    styleUrls: ['./text-summary.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextSummaryComponent),
            multi: true
        },
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => TextSummaryComponent), multi: true}]
})
export class TextSummaryComponent implements OnInit, ControlValueAccessor {
    @Input() placeholder = '';
    @Input() maxLength: number;
    @Input() description: string;
    @Input() required: boolean;
    ckeConfig: any;
    inputVal: TextSummary = {
        summary: '',
        body: '',
        format: ''
    };
    propagateChange: any = () => {};

    constructor() {
    }

    validate(control: FormControl) {
        const valid = (control.value.summary === '' || control.value.body === '') && this.required;
        return valid ?
            {'summary-required': {valid: false}} : null;
    }

    writeValue(value: any) {
        if (value !== '' && value !== null) {
            this.inputVal = value;
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
    }

    ngOnInit() {
        this.ckeConfig = {
            uiColor: '#EFF0F3',
            allowedContent: false,
            contenteditable: true,
            toolbar: [
                {name: 'insert', items: ['Image']},
                {name: 'basicStyle', items: ['Bold', 'Italic']},
                {name: 'paragraph', items: ['BulletedList', 'NumberedList', 'Blockquote']},
                {name: 'styles', items: ['Styles', 'Format']},
                {name: 'clipboard', items: ['Undo', 'Redo']}
            ]
        };
    }

    onChange() {
        // Send data to the parent form.
        this.propagateChange(this.inputVal);
    }
}
