import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';

import {availableWidgets, WidgetModel} from '../../../shared/model/widget-model';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    selector: 'app-dashboard-library',
    templateUrl: './dashboard-library.component.html',
    styleUrls: ['./dashboard-library.component.scss']
})
export class DashboardLibraryComponent implements OnInit {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    @Output() widgetValue = new EventEmitter();
    @Output() confirmWidget = new EventEmitter();
    tmpValue: any;
    widgetList: WidgetModel[];
    modalRef: BsModalRef;
    tmpList: WidgetModel[];
    view: string;
    selectedItem;

    constructor(private modalService: BsModalService) {
        this.widgetList = availableWidgets;
        this.tmpList = this.widgetList;
        this.view = 'content';
    }

    ngOnInit() {
        this.filter();
    }

    filter() {
        this.widgetList = this.tmpList.filter( data => {
            return this.view === data.type;
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    valueChanged(data) {
        this.tmpValue = data;
    }

    hideModal(name: string) {
        if (name === 'add') {
            this.confirmWidget.emit(true);
            this.widgetValue.emit(this.tmpValue);
            this.modalRef.hide();
        } else {
            this.modalRef.hide();
        }
    }

    clickedItem(event, newValue) {
        this.selectedItem = newValue;
    }
}
