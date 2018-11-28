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
    @Input() fieldRef;
    @Input() referenceCheck;
    @Input() buttonValue: boolean;
    @Output() sentData: EventEmitter<any> = new EventEmitter();
    @Output() sendReferenceData: EventEmitter<any> = new EventEmitter();
    osValidators = [];
    configForm: FormGroup = new FormGroup({});
    formSubmitted = false;
    multiValuesData: any = {};
    confirmPassword: boolean;

    private notChangeDefault = ['select', 'checkbox', 'radio', 'upload', 'reference'];
    private arrayListControls = ['text', 'number', 'email', 'text-area',
        'slider', 'text-editor', 'url', 'text-summary', 'date', 'password'];

    constructor(
        private _fb: FormBuilder,
        private msgService: MessageService
    ) {
        this.osValidators = OsValidators;
    }

    ngOnInit() {
        // this.formData = FormData;
        // this.initForm();
        // console.log(this.formData);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.formData && changes.formData) {
            this.initForm();
        }
    }

    onSubmit(values, valid) {
        this.formSubmitted = true;
        if (this.confirmPassword !== undefined) {
            if (this.confirmPassword && valid) {
                this.sentData.emit(values);
                this.sendReferenceData.emit(values);
            } else {
                this.msgService.add('The required fields must not be empty.', 'os-warning');
            }
        } else  if (valid) {
            this.sentData.emit(values);
            this.sendReferenceData.emit(values);
        } else {
            this.msgService.add('The required fields must not be empty.', 'os-warning');
        }
    }

    private initForm() {
        this.configForm = this._fb.group(this.addFormControl(this.formData));
    }

    private addFormControl(formData: FormElement[]): Object {
        const controls = {};
        formData.forEach(formElement => {
            if (formElement.defaultValue.length === 0 && this.notChangeDefault.indexOf(formElement.type) === -1) {
                formElement['defaultValue'] = formElement.type === 'slider' ? [formElement.minimumValue] : [''];
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
        if (formType && formType === 'slider') {
            this.multiValuesData[formName].push(this.addNewItem(formName, [0], validators.map(val => val.func)));
        } else if (formType && formType === 'date') {
            this.multiValuesData[formName].push(this.addNewItem(formName, new Date(), validators.map(val => val.func)));
        } else {
            this.multiValuesData[formName].push(this.addNewItem(formName, null, validators.map(val => val.func)));
        }
    }

    removeElement(formName: string, index: number) {
        this.multiValuesData[formName] = this.configForm.get(formName) as FormArray;
        this.multiValuesData[formName].removeAt(index);
    }

    /**
     * Checks to see if the password matches the confirm password
     * @param p - password input type string
     * @param c - confirm password input type string
     */
    public valuesCheck(p: string[], c: string) {
        this.confirmPassword = !!(p.indexOf(c) > -1 && p.length);
        if (p.length && p[0] === '' && c.length && c[0] !== '') {
            this.confirmPassword = undefined;
        }
    }

    /**
     * Omits the current password field
     * @param item
     * @param value
     */
    public checkPassword(item: string, value: string[]) {
        if (item === 'pass' && value.length && value[0] !== '') {
            this.confirmPassword = false;
        } else {
            this.confirmPassword = undefined;
        }
    }
}
