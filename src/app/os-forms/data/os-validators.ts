import {Validators} from '@angular/forms';
import {DecimalNumber} from '../validators/decimalNumber';


export const OsValidators = [
    {
        name: 'required',
        func: Validators.required,
        errorMsg: 'This field is required.',
        onFormSubmit: true
    },
    {
        name: 'max-length',
        func: Validators.maxLength(1000),
        errorMsg: 'This field accept only the 1000 characters',
        onFormSubmit: true
    },
    {
        name: 'summary-required',
        func: Validators.required,
        errorMsg: 'Both fields are required.',
        onFormSubmit: true
    },
    {
        name: 'email',
        func: Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$'),
        errorMsg: 'Wrong email format',
        onFormSubmit: true
    },
    {
        name: 'url-required',
        func: Validators.required,
        errorMsg: 'This field is required.',
        onFormSubmit: true
    }
];
