import {Component, OnInit, forwardRef, Input} from '@angular/core';
import {FormControl, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';

export interface TextSummary {
    summary: string;
    body: string;
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
    ckeConfig: any;
    inputVal: TextSummary = {
        summary: '',
        body: ''
    };
    propagateChange: any = () => {};

    constructor() {
    }

    validate(control: FormControl) {
        return (this.inputVal.summary === '' || this.inputVal.body === '') ?
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
