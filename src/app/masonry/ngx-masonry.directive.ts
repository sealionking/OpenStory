import {Directive, Inject, ElementRef, forwardRef, OnDestroy, AfterViewInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import {NgxMasonryComponent} from './ngx-masonry.component';

/**
 * Allows reacting to DOM changes without killing browser performance.
 */
interface MutationWindow extends Window {
    MutationObserver: any;
    WebKitMutationObserver: any;
}

/**
 * @ignore
 */
declare var window: MutationWindow;

/**
 * Masonry child - masonry item
 */
@Directive({
    selector: '[appMasonryItem], appMasonryItem'
})
export class NgxMasonryDirective implements OnDestroy, AfterViewInit {
    constructor(private _element: ElementRef,
                @Inject(forwardRef(() => NgxMasonryComponent))
                private _parent: NgxMasonryComponent,
                @Inject(PLATFORM_ID) private platformId: any) {
    }

    /**
     * @ignore
     */
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this._parent.add(this._element.nativeElement);
            this.watchForHtmlChanges();
        }
    }

    /**
     * @ignore
     */
    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
            this._parent.remove(this._element.nativeElement);
        }
    }

    /**
     * When HTML in brick changes dynamically, observe that and change layout
     */
    private watchForHtmlChanges(): void {
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        if (MutationObserver) {
            /** Watch for any changes to subtree */
            const self = this;
            const observer = new MutationObserver(function (mutations, observerFromElement) {
                self._parent.layout();
            });

            // define what element should be observed by the observer
            // and what types of mutations trigger the callback
            observer.observe(this._element.nativeElement, {
                subtree: true,
                childList: true
            });
        }
    }
}
