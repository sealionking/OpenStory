import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

function getWindow(): any {
    return window;
}

function getObject(): any {
    return Object;
}

@Injectable()
export class GlobalObjectsRefService {
    get nativeWindow(): any {
        return getWindow();
    }

    get nativeObject(): any {
        return getObject();
    }

    /**
     * Creates a new observable that can be used in place of a window:resize event listener.
     * @param {number} throttle
     * Debounce timer, allow actions only after specific time has passed.
     * @returns {Observable<any>}
     */
    getWindowResizeObs(throttle = 100) {
        return Observable.fromEvent(getWindow(), 'resize').debounceTime(throttle).distinctUntilChanged();
    }
}
