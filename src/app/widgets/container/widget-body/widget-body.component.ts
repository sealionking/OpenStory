import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {WidgetServiceService} from '../../services/widget-service.service';
import {WidgetModel} from '../../../shared/model/widget-model';
import {Router} from '@angular/router';
import {availableWidgets} from '../../../shared/model/widget-model';

@Component({
    selector: 'app-widget-body',
    template: `
        <div class="grid-item-inner d-flex flex-column justify-content-between"
             (click)="onClick()"
             [class.highlight]="hightlightStatus == true" >
            <div>
                <div class="widget-title">{{widget.name}}</div>
                <template #dynamic ></template>
            </div>
            <div class="widget-footer">
                <span *ngIf="showButton" class="" (click)="viewMoreEvent(widget.key)">View More</span>
            </div>
        </div>
    `,
    styleUrls: ['./widget-body.component.scss']
})
export class WidgetBodyComponent implements OnInit {
    @ViewChild('dynamic', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;
    @Input() widget: WidgetModel;
    @Input() visible: boolean;
    @Input() indent: number;
    @Input() selectedWidget: string;
    @Input() viewLibrary: string;
    @Output() resizeGrid: EventEmitter<boolean> = new EventEmitter<boolean>();
    showButton = true;

    hightlightStatus = false;

    constructor(
        private widgetService: WidgetServiceService,
        private route: Router,
    ) {
    }

    ngOnInit() {
        if (this.indent && this.selectedWidget) {
            this.widget.weight = this.indent;
        }
        const viewRef = this.widgetService.addDynamicComponent(this.selectedWidget, this.viewContainerRef,
            this.widget.dataStatic);
        if (viewRef.instance.hasOwnProperty('dataLoaded')) {
            viewRef.instance.dataLoaded.subscribe(() => this.resizeGrid.emit(true));
        }
        this.viewContainerRef.insert(viewRef.hostView);
        this.showButton = !!(this.visible && this.widget.viewMore);
    }

    onClick() {
        this.hightlightStatus = true;
        if (this.hightlightStatus === true) {
            this.hightlightStatus = false;
        }
    }

    /**
     * Function used to redirect users to the page based on the button they clicked.
     * @param key - the name of the widget
     */
    viewMoreEvent(key) {
        const currentWidget = availableWidgets.find((widget) => {
            return widget.key === key;
        });
        if (currentWidget.viewMore) {
            this.route.navigate([currentWidget.viewMoreLink]);
        }
    }
}
