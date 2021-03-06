import {FormElement} from '../models/form-element';

export const FormData: FormElement[] = [
    {
        id: 'title',
        type: 'text',
        label: 'Title',
        required: true,
        multiValues: 1,
        defaultValue: [],
        validators: ['required'],
        placeholder: 'This is placeholder',
        prefix: 'Prefix',
        suffix: 'Suffix'
    },
    {
        id: 'Reference field',
        type: 'reference',
        label: 'Reference Field Here',
        description: 'What a reference',
        required: false,
        multiValues: 1,
        defaultValue: ['ID'],
        validators: [''],
        placeholder: 'This is a placeholder',
        targetType: 'user',
        targetBundles: ['array'],
    },
    {
        id: 'upload-file',
        type: 'upload',
        label: 'Upload a file or two',
        accept: {
            type: '*'
        },
        required: false,
        multiValues: 3,
        defaultValue: [{
            id: 0,
            type: 'image',
            name: 'people',
            path: 'http://google.com'
        }],
        validators: ['required', 'max-length'],
        placeholder: 'This is placeholder'
    },
    {
        id: 'date',
        type: 'date',
        label: 'Birthday',
        required: false,
        multiValues: 3,
        defaultValue: ['2018-09-11T07:55:00Z'],
        timePicker: true,
        validators: [''],
    },
    {
        id: 'password',
        type: 'input',
        label: 'Password',
        required: true,
        multiValues: 1,
        defaultValue: [],
        validators: []
    },
    {
        id: 'address',
        type: 'text',
        label: 'Home Address',
        required: false,
        multiValues: 3,
        defaultValue: [''],
        validators: ['required', 'max-length'],
        placeholder: 'This is placeholder'
    },
    {
        id: 'password',
        type: 'input',
        label: 'Password',
        required: true,
        multiValues: 1,
        defaultValue: [''],
        validators: ['required'],
        placeholder: 'This is placeholder'
    },
    {
        id: 'rest',
        type: 'text',
        label: 'Home rest',
        required: false,
        multiValues: -1,
        defaultValue: ['demo', 'demo1'],
        validators: ['required', 'max-length'],
        placeholder: 'This is placeholder'
    },
    {
        id: 'gender',
        type: 'select',
        label: 'Select your gender',
        required: false,
        multiValues: 1,
        defaultValue: 'm',
        validators: ['required'],
        placeholder: 'Gender',
        options: [{id: 'm', name: 'Male'}, {id: 'f', name: 'Female'}]
    },
    {
        id: 'bio',
        type: 'text-area',
        label: 'Add bio',
        required: false,
        multiValues: 1,
        defaultValue: ['demo text'],
        validators: ['required', 'max-length'],
        placeholder: 'This is placeholder'
    },
    {
        id: 'summary',
        type: 'text-summary',
        label: 'This is text + summary',
        required: false,
        multiValues: 1,
        defaultValue: [{
            summary: '',
            body: 'vasea b'
        }],
        validators: ['summary-required'],
        placeholder: 'This is placeholder',
        maxLength: 10
    },
    {
        id: 'editor',
        type: 'text-editor',
        label: 'This is text editor',
        required: false,
        multiValues: 1,
        defaultValue: ['TEST'],
        validators: [''],
        placeholder: 'This is placeholder'
    },
    {
        id: 'numbers',
        type: 'number',
        label: 'Number',
        required: false,
        multiValues: 3,
        defaultValue: ['3', '4'],
        validators: ['required', 'max-length'],
        placeholder: 'This is placeholder',
        decimals: 3,
        step: 0.01
    },
    {
        id: 'agegap',
        type: 'slider',
        label: 'Your Age?',
        required: false,
        defaultValue: [ 25 ],
        multiValues: 1,
        validators: ['required'],
        placeholder: 'This is placeholder',
        minimumValue: 15,
        maximumValue: 40,
        step: 1
    },
    {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        multiValues: 1,
        defaultValue: [''],
        validators: ['email', 'required'],
        placeholder: 'This is placeholder'
    },
    {
        id: 'homepage',
        type: 'url',
        label: 'Add your url here:',
        urlTitleDisabled: false,
        required: false,
        multiValues: 1,
        defaultValue: [{
            title: '',
            url: ''
        }],
        validators: [''],
        placeholder: 'This is placeholder'
    },
    {
        id: 'levels',
        type: 'checkbox',
        label: 'Select your Level',
        description: 'This is your level',
        required: false,
        multiValues: 1,
        defaultValue: [],
        validators: ['required'],
        placeholder: null,
        options: [{id: 'l1', name: 'Level1'}, {id: 'l2', name: 'Level2'}, {id: 'l3', name: 'Level3'}],
        permissions: 'TEST'
    },
    {
        id: 'size',
        type: 'radio',
        label: 'Select your size',
        description: 'This is your size',
        required: false,
        multiValues: 1,
        defaultValue: '',
        validators: ['required'],
        placeholder: null,
        options: [{id: 's1', name: 'L'}, {id: 's2', name: 'XL'}, {id: 's3', name: 'XXL'}]
    },
    {
        id: 'unsupported',
        type: 'unsupported',
        label: 'Label for uns',
        description: '',
        required: null,
        multiValues: null,
        defaultValue: '',
        validators: [],
        placeholder: null
    }
];
