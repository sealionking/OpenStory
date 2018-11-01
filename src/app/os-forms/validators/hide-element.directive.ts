import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appHideElement]'
})
export class HideElementDirective implements OnInit {
    @Input() changeValue: boolean;
    @Input() initValue: boolean;
    @Input('appHideElement') maxItems: number;

    @HostListener('change') onChange() {
        this.hideOnChange();
    }

    constructor(private el: ElementRef) {
    }

    ngOnInit(): void {
        this.hideArrowInit();
    }

    private hideOnChange() {
        switch (this.maxItems) {
            case -1:
                this.el.nativeElement.querySelector('.ng-arrow-zone').style.display = 'flex';
                this.el.nativeElement.querySelector('.ng-clear-zone').style.display = 'flex';
                break;
            case 1:
                if (!this.initValue) {
                    this.el.nativeElement.querySelector('.ng-arrow-zone').style.display = 'none';
                    this.el.nativeElement.querySelector('.ng-clear-zone').style.display = 'none';
                } else {
                    this.el.nativeElement.querySelector('.ng-arrow-zone').style.display = 'flex';
                    this.el.nativeElement.querySelector('.ng-clear-zone').style.display = 'flex';
                }
                break;
            default:
                this.el.nativeElement.querySelector('.ng-arrow-zone').style.display = 'flex';
                this.el.nativeElement.querySelector('.ng-clear-zone').style.display = 'flex';
                if (this.changeValue) {
                    this.el.nativeElement.querySelector('.ng-arrow-zone').style.display = 'none';
                    this.el.nativeElement.querySelector('.ng-clear-zone').style.display = 'none';
                }
        }
    }

    private hideArrowInit() {
        if (this.initValue) {
            this.el.nativeElement.querySelector('.ng-arrow-zone').style.display = 'none';
        } else {
            this.el.nativeElement.querySelector('.ng-arrow-zone').style.display = 'flex';
        }
    }
}
