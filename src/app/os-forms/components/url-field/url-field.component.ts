import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface UrlField {
    title: string;
    url: string;
}

@Component({
    selector: 'app-url-field',
    templateUrl: './url-field.component.html',
    styleUrls: ['./url-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UrlFieldComponent),
            multi: true
        },
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => UrlFieldComponent), multi: true}]
})
export class UrlFieldComponent implements OnInit, ControlValueAccessor {
    @Input() placeholder = '';
    @Input() description: string;
    @Input() urlTitleDisabled: boolean;
    @Input() required: boolean;
    inputVal: UrlField = {
        title: '',
        url: ''
    };
    propagateChange: any = () => {};

    constructor() {
    }

    validate(control: FormControl) {
        const valid = ((control.value.title && control.value.title === '') || control.value.url === '') && this.required;
        return valid ?
            {'url-required': {valid: false}} : null;
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
    }

    onChange() {
        this.propagateChange(this.inputVal);
    }

}
