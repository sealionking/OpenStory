export interface FormElement {
    id: string;
    type: string;
    label: string;
    description?: string;
    required: boolean;
    validators: Array<string>;
    placeholder:  string;
    multiValues: number;
    processedValidators?: Array<any>;
    defaultValue?: any;
    options?: Array<{id: string, name: string}>;
    prefix?: any;
    suffix?: any;
    decimals?: number;
    minimumValue?: number;
    maximumValue?: number;
    maxLength?: number;
    step?: number;
    urlTitleDisabled?: boolean;
}
