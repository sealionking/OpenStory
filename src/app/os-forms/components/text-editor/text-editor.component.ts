import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface SimpleEditor {
    body: string;
    format?: string;
}

@Component({
    selector: 'app-text-editor',
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextEditorComponent),
            multi: true
        }]
})
export class TextEditorComponent implements OnInit, ControlValueAccessor {
    @Input() placeholder = '';
    @Input() maxLength: number;
    @Input() description: string;
    ckeConfig: any;
    inputVal: SimpleEditor = {
        body: '',
        format: ''
    };
    propagateChange: any = () => { };

    constructor() {
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
