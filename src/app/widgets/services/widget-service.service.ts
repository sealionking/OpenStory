import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';

import {UsersWidgetComponent} from '../components/users-widget/users-widget.component';
import {ContentWidgetComponent} from '../components/content-widget/content-widget.component';
import {CommentWidgetComponent} from '../components/comment-widget/comment-widget.component';
import {MediaWidgetComponent} from '../components/media-widget/media-widget.component';
import {UnknownWidgetComponent} from '../components/unknown-widget/unknown-widget.component';
import {ActiveUsersComponent} from '../components/active-users/active-users.component';
import {NewestUsersComponent} from '../components/newest-users/newest-users.component';
import {TopContentComponent} from '../components/top-content/top-content.component';
import {ContentEvoComponent} from '../components/content-evo/content-evo.component';
import {DeviceSessionComponent} from '../components/device-session/device-session.component';
import {BrowserSessionComponent} from '../components/browser-session/browser-session.component';
import {RushHoursComponent} from '../components/rush-hours/rush-hours.component';

@Injectable()
export class WidgetServiceService {
    /**
     * @ignore
     * @param factoryResolver
     */
    constructor(private factoryResolver: ComponentFactoryResolver) {
    }

    /**
     * Function used to retrieve and add the selected widget to the dashboard dynamically
     * @param widgetName - the widget type
     * @param rootViewContainer - angular directive
     * @param dataStatic - used to determine if we should send live data to the widget
     * @param filter - used to filter the content widget, for now
     * @param mini
     */
    public addDynamicComponent(widgetName: string, rootViewContainer: ViewContainerRef, dataStatic?: boolean,
                               filter?: string, mini?: any) {
        let factory: any;
        let component: any;
        switch (widgetName) {
            case 'usersList':
                factory = this.factoryResolver.resolveComponentFactory(UsersWidgetComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'contentList':
                factory = this.factoryResolver.resolveComponentFactory(ContentWidgetComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'commentList':
                factory = this.factoryResolver.resolveComponentFactory(CommentWidgetComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'mediaList':
                factory = this.factoryResolver.resolveComponentFactory(MediaWidgetComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'activeUsers':
                factory = this.factoryResolver.resolveComponentFactory(ActiveUsersComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'newestUsers':
                factory = this.factoryResolver.resolveComponentFactory(NewestUsersComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'top5':
                factory = this.factoryResolver.resolveComponentFactory(TopContentComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'contentStories':
                factory = this.factoryResolver.resolveComponentFactory(ContentEvoComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'deviceSession':
                factory = this.factoryResolver.resolveComponentFactory(DeviceSessionComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'browserSession':
                factory = this.factoryResolver.resolveComponentFactory(BrowserSessionComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            case 'rushhours':
                factory = this.factoryResolver.resolveComponentFactory(RushHoursComponent);
                component = factory.create(rootViewContainer.parentInjector);
                break;
            default:
                factory = this.factoryResolver.resolveComponentFactory(UnknownWidgetComponent);
                component = factory.create(rootViewContainer.parentInjector);
        }
        if (dataStatic) {
            component.instance.dataStatic = dataStatic;
        }
        if (filter) {
            component.instance.filterItem = filter;
        }
        if (mini) {
            component.instance.mini = mini;
        }
        return component;
    }

}
