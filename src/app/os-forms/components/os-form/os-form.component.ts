import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormData} from '../../data/form-data';
import {FormElement} from '../../models/form-element';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {OsValidators} from '../../data/os-validators';
import {MessageService} from '../../../core/services/message.service';

@Component({
    selector: 'app-os-form',
    templateUrl: './os-form.component.html',
    styleUrls: ['./os-form.component.scss']
})
export class OsFormComponent implements OnInit, OnChanges {
    @Input() formData: FormElement[] = [];
    @Output() sentData: EventEmitter<any> = new EventEmitter();
    osValidators = [];
    configForm: FormGroup = new FormGroup({});
    formSubmitted = false;
    multiValuesData: any = {};

    private notChangeDefault = ['select', 'checkbox', 'radio'];
    private arrayListControls = ['text', 'number', 'email', 'text-area', 'slider', 'text-editor', 'url', 'text-summary', 'password'];

    constructor(
        private _fb: FormBuilder,
        private msgService: MessageService
    ) {
        // this.formData = FormData;
        this.osValidators = OsValidators;
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.formData && changes.formData) {
            this.initForm();
        }
    }

    onSubmit(values, valid) {
        this.formSubmitted = true;
        if (valid) {
            this.sentData.emit(values);
        } else {
            this.msgService.add('The required fields must not be empty.');
        }
    }

    private initForm() {
        this.configForm = this._fb.group(this.addFormControl(this.formData));
    }

    private addFormControl(formData: FormElement[]): Object {
        const controls = {};
        formData.forEach(formElement => {
            if (formElement.defaultValue.length === 0 && this.notChangeDefault.indexOf(formElement.type) === -1) {
                formElement['defaultValue'] = formElement.type === 'slider' ? [formElement.minimumValue] : [''] ;

            }
            const validators = this.extractValidators(formElement.validators);
            const value = formElement.defaultValue;
            // Create form array for multiple values fields.
            if (this.arrayListControls.indexOf(formElement.type) !== -1) {
                const formArray = this._fb.array([]);
                value.forEach(v => {
                    formArray.push(this.addNewItem(formElement.id, v, validators.map(val => val.func)));
                });
                controls[formElement.id] = formArray;
            } else {
                // Create control for single values fields.
                controls[formElement.id] = new FormControl(value, validators.map(val => val.func));
            }
            formElement.processedValidators = validators;
        });

        return controls;
    }

    private extractValidators(validatorsName: Array<any>) {
        return this.osValidators.filter(osValidator => {
            return validatorsName.indexOf(osValidator.name) !== -1;
        });
    }

    addNewItem(formName: string, defaultValue?: any, validators?: any) {
        return new FormControl(defaultValue, validators);
    }

    addNewElement(formName: string, formType?: string) {
        const validators = this.formData.find(f => f.id === formName).processedValidators;
        // Get the rendered controls and store in custom variables.
        this.multiValuesData[formName] = this.configForm.get(formName) as FormArray;
        if (formType) {
            this.multiValuesData[formName].push(this.addNewItem(formName, [0], validators.map(val => val.func)));
        } else {
            this.multiValuesData[formName].push(this.addNewItem(formName, null, validators.map(val => val.func)));
        }
    }

    removeElement(formName: string, index: number) {
        this.multiValuesData[formName] = this.configForm.get(formName) as FormArray;
        this.multiValuesData[formName].removeAt(index);
    }
}
