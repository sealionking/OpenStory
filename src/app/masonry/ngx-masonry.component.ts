import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    ElementRef,
    EventEmitter,
    PLATFORM_ID,
    Inject
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import {NgxMasonryOptions} from './ngx-masonry-options.interface';

/**
 * Global variables
 */
declare var require: any;
let imagesLoaded: any;
let masonryConstructor: any;

/**
 * Masonry Constructor
 */
@Component({
    selector: '[app-masonry], app-masonry',
    template: '<ng-content></ng-content>',
    styles: [
            `
            :host {
                display: block;
            }
        `
    ]
})
export class NgxMasonryComponent implements OnInit, OnDestroy {
    constructor(@Inject(PLATFORM_ID) private platformId: any,
                private _element: ElementRef) {
    }

    public _msnry: any;

    /**
     * Inputs
     */
    @Input() public options: NgxMasonryOptions;
    @Input() public useImagesLoaded: Boolean = false;

    /**
     * Outputs
     * @type {EventEmitter<any[]>}
     */
    @Output() layoutComplete: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() removeComplete: EventEmitter<any[]> = new EventEmitter<any[]>();

    /**
     * @ignore
     */
    ngOnInit() {
        // TODO: How to load imagesloaded only if this.useImagesLoaded===true?
        if (this.useImagesLoaded && imagesLoaded === undefined) {
            imagesLoaded = require('imagesloaded');
        }
        if (isPlatformBrowser(this.platformId) && masonryConstructor === undefined) {
            masonryConstructor = require('masonry-layout');
        }

        // Create masonry options object
        if (!this.options) {
            this.options = {};
        }

        // Set default itemSelector
        if (!this.options.itemSelector) {
            this.options.itemSelector = '[appMasonryItem], appMasonryItem';
        }

        if (isPlatformBrowser(this.platformId)) {
            // Initialize Masonry
            this._msnry = new masonryConstructor(this._element.nativeElement, this.options);

            // Bind to events
            this._msnry.on('layoutComplete', (items: any) => {
                this.layoutComplete.emit(items);
            });
            this._msnry.on('removeComplete', (items: any) => {
                this.removeComplete.emit(items);
            });
        }
    }

    /**
     * @ignore
     */
    ngOnDestroy() {
        if (this._msnry) {
            this._msnry.destroy();
        }
    }

    /**
     * Delay when loading the masonry page
     */
    public layout() {
        setTimeout(() => {
            this._msnry.layout();
        });
    }

    /**
     * public add(element: HTMLElement, prepend: boolean = false)
     * @param {HTMLElement} element
     */
    public add(element: HTMLElement) {
        let isFirstItem = false;
        // Check if first item
        if (this._msnry.items.length === 0) {
            isFirstItem = true;
        }
        if (this.useImagesLoaded) {
            imagesLoaded(element, () => {
                this._element.nativeElement.appendChild(element);
                // Tell Masonry that a child element has been added
                this._msnry.appended(element);
                // layout if first item
                if (isFirstItem) {
                    this.layout();
                }
            });
            // TODO: Modify this when bug is fixed.
            this._element.nativeElement.removeChild(element);
        } else {
            // Tell Masonry that a child element has been added
            this._msnry.appended(element);

            // layout if first item
            if (isFirstItem) {
                this.layout();
            }
        }
    }

    /**
     * Allows us to remove an element from the masonry layout
     * @param {HTMLElement} element
     */
    public remove(element: HTMLElement) {
        // Tell Masonry that a child element has been removed
        this._msnry.remove(element);
        // Layout items
        this.layout();
    }
}
