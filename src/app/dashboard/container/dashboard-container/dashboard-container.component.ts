import {AfterViewInit, Component, OnInit, OnDestroy} from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import {WidgetModel} from '../../../shared/model/widget-model';
import {GlobalObjectsRefService} from '../../../core/services/global-objects-ref.service';

declare var Packery: any;
declare var Draggabilly: any;

@Component({
    selector: 'app-dashboard-container',
    templateUrl: './dashboard-container.component.html',
    styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements AfterViewInit, OnInit, OnDestroy {
    packery: any;
    gridReact = false;
    large = [];
    mini = [];
    revert = [];
    expand = [];
    selectedWidget: WidgetModel;
    widgets: WidgetModel[] = [];
    dragWidget: boolean;
    viewEnd = false;
    items: any;
    resizeSubs;
    allWidget: any;
    confirmWidget = false;

    optionCollapse = false;
    optionResize = false;
    draggedWidgets = false;
    closeDialog = false;

    public lottieConfig: Object;

    constructor(
        private dashService: DashboardService,
        private globalObjectsRefService: GlobalObjectsRefService
    ) {
        this.globalObjectsRefService.getWindowResizeObs().subscribe((e) => {
            setTimeout(() => {
                if (this.packery) {
                    this.packery.layout();
                }
            }, 100);
        });

        // Subscribe to resize event.
        this.resizeSubs = this.globalObjectsRefService.getWindowResizeObs().subscribe(e => this.onResize(e));

        this.lottieConfig = {
            path: 'assets/json/loader.json',
            autoplay: true,
            loop: true
        };
    }

    ngOnInit() {
        setTimeout( () =>  this.viewEnd = true, 1000);
        this.initDashboard();
    }

    ngOnDestroy() {
        if (this.resizeSubs) {
            this.resizeSubs.unsubscribe();
        }
    }

    ngAfterViewInit() {
    }

    getIndex(data: WidgetModel) {
        this.selectedWidget = data;
        this.addItem();
    }

    // TODO: Redo function after widget library is done
    addItem() {
        this.selectedWidget.dataStatic = false;
        this.widgets.push(this.createWidget(this.selectedWidget));
        setTimeout(() => {
            this.initGrid();
            if (this.packery) {
                this.packery.layout();
            }
            this.selectedWidget.dataStatic = true;
        }, 0);
    }

    createWidget(data: WidgetModel) {
        const widget = {
            type: data.type,
            weight: data.weight,
            name: data.name,
            key: data.key,
            id: data.id,
            dataStatic: data.dataStatic,
            viewMore: data.viewMore,
        };
        return widget;
    }

    // TODO: Redo function after widget library is done
    gridShitLayout(i?, name?: string) {
        if (name) {
            switch (name) {
                case 'large':
                    this.large[i] = 'large';
                    this.mini[i] = null;
                    this.revert[i] = null;
                    this.expand[i] = null;
                    this.optionResize = true;
                    this.optionCollapse = false;
                    break;
                case 'mini':
                    this.large[i] = null;
                    this.mini[i] = 'mini';
                    this.revert[i] = null;
                    this.expand[i] = null;
                    this.optionCollapse = true;
                    this.optionResize = false;
                    break;
                case 'default':
                    this.large[i] = null;
                    this.mini[i] = null;
                    this.revert[i] = 'default';
                    this.expand[i] = null;
                    this.optionCollapse = false;
                    this.optionResize = false;
                    break;
                case 'expand':
                    this.large[i] = null;
                    this.mini[i] = null;
                    this.revert[i] = null;
                    this.expand[i] = 'expand';
                    this.optionCollapse = false;
                    break;
                default:
                    break;
            }
        }
        setTimeout(() => {
            if (this.packery) {
                this.packery.layout();
            }
        }, 0);
    }

    // TODO: Redo function after widget library is done
    remove(data) {
        // show the modal.
        this.showModal();
        const tmpElems = this.packery.getItemElements();
        if (tmpElems) {
            // delete the clicked widget from the array.
            this.widgets.splice(data, 1);
        }
        // used to reload the packery layout.
        setTimeout(() => {
            if (this.packery) {
                this.packery.layout();
            }
        }, 0);

    }

    // TODO: Redo function after widget library is done
    initGrid() {
        const grid = document.querySelector('.grid');
        if (grid) {
            this.packery = new Packery(grid, {
                itemSelector: '.grid-item',
                gutter: 15,
                columnWidth: 420,
                percentPosition: true,
                resize: false
            });
        }
        if (this.packery) {
            const elems = this.packery.getItemElements();
            elems.forEach(gridItem => {
                const draggie = new Draggabilly(gridItem, {
                    handle: '.handle'
                });
                this.packery.bindDraggabillyEvents(draggie);
            });
        }

        // Subscribes to 'dragItemPositioned' to save dashboard items positions if have changed.
        if (this.packery) {
            this.packery.on('dragItemPositioned', (draggedItem) => {
                this.gridReact = false;
                this.confirmWidget = false;
                const allWidgets = [];
                const tmpElems = this.packery.getItemElements();
                if (tmpElems) {
                    this.dragWidget = true;
                    for (let i = 0; i < tmpElems.length; i++) {
                        const currentWidget = this.widgets.find((widget) => widget.id.toString() === tmpElems[i].id);
                        if (currentWidget) {
                            currentWidget.weight = i;
                            allWidgets.push(currentWidget);
                        }
                    }
                }
                if (allWidgets.length > 0) {
                    this.allWidget = allWidgets;
                    this.showModal();
                }
            });
        }
    }

    initDashboard() {
        this.dashService.getDashboardItems(this.items, this.widgets);
        setTimeout(() => {
            this.initGrid();
            if (this.packery) {
                this.packery.layout();
            }
        }, 1000);
    }

    showModal() {
        this.draggedWidgets = true;
    }

    saveConfig() {
        const tmpElems = this.packery.getItemElements();
        this.dashService.buildWidget(this.widgets, tmpElems);
        // If widget was dragged, save the current position and send it to back end,
        // Else if widget wasn't dragged and the delete button was pressed, remove it from back end.
        if (this.dragWidget) {
            this.dashService.savePositions(this.allWidget);
        } else {
            this.dashService.savePositions(this.widgets);
        }
        this.closePopUp();
    }

    closePopUp() {
        setTimeout(() => {
            this.draggedWidgets = false;
            this.closeDialog = false;
        }, 400);

        this.closeDialog = true;
    }

    /**
     * Function called on window resize event.
     * @param event - Event with window details.
     */
    onResize(event) {
        setTimeout(() => {
            if (this.packery) {
                this.packery.layout();
            }
        }, 100);
    }

    confirmWidgetFunction(value) {
        this.confirmWidget = value;
        if (this.confirmWidget) {
            this.showModal();
        }
    }

    resizeGrid() {
        if (this.packery) {
            this.packery.layout();
        }
    }
}

