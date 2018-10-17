import {Component, OnInit, OnDestroy} from '@angular/core';
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
export class DashboardContainerComponent implements OnInit, OnDestroy {
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

    /**
     * We initialize the packery contaier to avoid overlapping
     * @param {DashboardService} dashService
     * @param {GlobalObjectsRefService} globalObjectsRefService
     */
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

    /**
     * Initializing the grid and adding a setTimeout to allow the loading animation if the dashboard is empty
     */
    ngOnInit(): void {
        setTimeout(() => this.viewEnd = true, 1000);
        this.initDashboard();
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
     * Identifies the selected widget from the widget library to be added
     * @param {WidgetModel} data
     */
    public getIndex(data: WidgetModel): void {
        this.selectedWidget = data;
        this.addItem();
    }

    /**
     * Add widget function, initializing the packery layout
     */
    public addItem(): void {
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

    /**
     * Allows us to create a widget object
     * @param {WidgetModel} data
     * @return {WidgetModel}
     */
    createWidget(data: WidgetModel): WidgetModel {
        const widget = {
            type: data.type,
            weight: data.weight,
            name: data.name,
            key: data.key,
            id: data.id,
            dataStatic: data.dataStatic,
            viewMore: data.viewMore,
            filterItem: data.filterItem
        };
        return widget;
    }

    /**
     * Used to modify the dashboard items
     * @param i - current array index
     * @param {string} name - css class
     */
    public gridShitLayout(i?, name?: string): void {
        if (name) {
            switch (name) {
                case 'large':
                    this.large[i] = 'large';
                    this.mini[i] = null;
                    this.revert[i] = null;
                    this.expand[i] = null;
                    break;
                case 'mini':
                    this.large[i] = null;
                    this.mini[i] = 'mini';
                    this.revert[i] = null;
                    this.expand[i] = null;
                    break;
                case 'default':
                    this.large[i] = null;
                    this.mini[i] = null;
                    this.revert[i] = 'default';
                    this.expand[i] = null;
                    break;
                case 'expand':
                    this.large[i] = null;
                    this.mini[i] = null;
                    this.revert[i] = null;
                    this.expand[i] = 'expand';
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

    /**
     * Removes the desired widget from the dashboard
     * @param data - start point
     */
    public remove(data): void {
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

    /**
     * Creates the dashboard grid
     * Enables packery and draggabilly
     */
    public initGrid(): void {
        const grid = document.querySelector('.grid');
        if (grid) {
            this.packery = new Packery(grid, {
                itemSelector: '.grid-item',
                gutter: 10,
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
            this.packery.on('dragItemPositioned', () => {
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

    /**
     * Initialize the dashboard grid and display saved items.
     */
    public initDashboard(): void {
        this.dashService.getDashboardItems(this.items, this.widgets);
        setTimeout(() => {
            this.initGrid();
            if (this.packery) {
                this.packery.layout();
            }
        }, 1000);
    }

    /**
     * @ignore
     */
    public showModal(): void {
        this.draggedWidgets = true;
    }

    /**
     * Allows us to save the current dashboard items and item position to the server side
     */
    public saveConfig(): void {
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

    /**
     * @ignore
     */
    public closePopUp(): void {
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
    private onResize(event): void {
        setTimeout(() => {
            if (this.packery) {
                this.packery.layout();
            }
        }, 100);
    }

    /**
     * @ignore
     * @param value
     */
    public confirmWidgetFunction(value): void {
        this.confirmWidget = value;
        if (this.confirmWidget) {
            this.showModal();
        }
    }

    /**
     * @ignore
     */
    public resizeGrid(): void {
        if (this.packery) {
            this.packery.layout();
        }
    }

    /**
     * Function used to add save the selected filter to backend
     * @param item - used to save the filter value sent through the emit variable
     * @param current - selected widget ID, used to determine it
     */
    addFilter(item, current): void {
        this.dragWidget = false;
        const tmpElems = this.packery.getItemElements();
        if (tmpElems) {
            this.dragWidget = false;
            const currentWidget = this.widgets.find((widget) => widget.id.toString() === current);
            if (currentWidget) {
                currentWidget['filterItem'] = item;
            }
        }
        this.onResize(item);
        this.showModal();
    }

}

