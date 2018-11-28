import {Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';

import {availableWidgets, WidgetModel} from '../../../shared/model/widget-model';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {GlobalObjectsRefService} from '../../../core/services/global-objects-ref.service';

declare var Packery: any;

@Component({
    selector: 'app-dashboard-library',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dashboard-library.component.html',
    styleUrls: ['./dashboard-library.component.scss']
})
export class DashboardLibraryComponent implements OnInit, OnDestroy {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    @Output() widgetValue = new EventEmitter();
    @Output() confirmWidget = new EventEmitter();
    tmpValue: any;
    widgetList: WidgetModel[];
    modalRef: BsModalRef;
    tmpList: WidgetModel[];
    view: string;
    selectedItem;
    packery: any;
    resizeSubs;

    constructor(private modalService: BsModalService,
                private globalObjectsRefService: GlobalObjectsRefService) {
        this.widgetList = availableWidgets;
        this.tmpList = this.widgetList;
        this.view = 'content';

        this.globalObjectsRefService.getWindowResizeObs().subscribe((e) => {
            setTimeout(() => {
                if (this.packery) {
                    this.packery.layout();
                }
            }, 100);
        });

        // Subscribe to resize event.
        this.resizeSubs = this.globalObjectsRefService.getWindowResizeObs().subscribe(e => this.onResize(e));
    }

    /**
     * @ignore
     */
    ngOnInit() {
        //this.filter();
    }

    /**
     * @ignore
     */
    ngOnDestroy(): void {
        if (this.resizeSubs) {
            this.resizeSubs.unsubscribe();
        }
    }

    /**
     * Filter function
     */
    filter() {
        this.widgetList = this.tmpList.filter( data => {
            return this.view === data.type;
        });
    }

    /**
     * Opens the library modal and initializes packery
     * @param template
     */
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'select-widget-modal'});

        setTimeout(() => {
            this.initGrid();
        }, 100);
    }

    /**
     * Changed the widget value
     * @param data
     */
    valueChanged(data) {
        this.tmpValue = data;
    }

    /**
     * Closes the modal
     * @param name
     */
    hideModal(name: string) {
        if (name === 'add') {
            this.confirmWidget.emit(true);
            this.widgetValue.emit(this.tmpValue);
            this.modalRef.hide();
        } else {
            this.modalRef.hide();
        }
    }

    /**
     * Click event action
     * @param event
     * @param newValue
     */
    clickedItem(event, newValue) {
        this.selectedItem = newValue;
    }

    /**
     * Creates the dashboard grid
     * Enables packery
     */
    public initGrid(): void {
        const grid = document.querySelector('.widget-list');
        if (grid) {
            this.packery = new Packery(grid, {
                itemSelector: 'app-widget-body',
                gutter: 15,
                columnWidth: 420,
                percentPosition: true,
                resize: false
            });
        }
    }


    /**
     * Layout resize helper
     * @param event
     */
    private onResize(event): void {
        setTimeout(() => {
            if (this.packery) {
                this.packery.layout();
            }
        }, 100);
    }
}
