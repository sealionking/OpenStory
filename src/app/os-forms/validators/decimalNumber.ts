import {FormControl} from '@angular/forms';

export class DecimalNumber {
    static decimalNumber(control?: FormControl, compare?: number) {
        const decimals = control.value % 1;
        if (isNaN(control.value) || decimals.toString().length !== compare) {
            return {'decimalNumber': true };
        }
    }
}
