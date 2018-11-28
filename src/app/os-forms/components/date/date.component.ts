import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import * as moment from 'moment';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateComponent),
            multi: true
        }]
})
export class DateComponent implements OnInit, ControlValueAccessor {
    @Input() timePicker: boolean;
    settings = {
        bigBanner: true,
        defaultOpen: false,
    };
    inputVal: Date = new Date();
    propagateChange: any = () => { };

    constructor() {
    }

    writeValue(value: any) {
        let tmpDate: any;
        if (value !== '') {
            if (this.timePicker === true) {
                this.settings['timePicker'] = true;
                tmpDate = moment(value).utc().format('YYYY-MM-DD HH:mm:ss');
            } else {
                this.settings['timePicker'] = false;
                this.settings['format'] = 'dd-MMM-yyyy';
                tmpDate = moment(value).utc().format('YYYY-MM-DD');
            }
        } else {
            if (this.timePicker === true) {
                this.settings['timePicker'] = true;
                tmpDate = new Date();
            } else {
                this.settings['timePicker'] = false;
                this.settings['format'] = 'dd-MMM-yyyy';
                tmpDate = new Date();
            }
        }
        this.inputVal = tmpDate;
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
    }

    ngOnInit() {
    }

    onChange() {
        const rTime = moment.utc(this.inputVal).format();
        // Send data to the parent form.
        this.propagateChange(rTime);
    }

}
