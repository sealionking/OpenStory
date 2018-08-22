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

@Injectable()
export class WidgetServiceService {
    constructor(private factoryResolver: ComponentFactoryResolver) {
    }

    public addDynamicComponent(widgetName: string, rootViewContainer: ViewContainerRef, dataStatic?: boolean) {
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
            default:
                factory = this.factoryResolver.resolveComponentFactory(UnknownWidgetComponent);
                component = factory.create(rootViewContainer.parentInjector);
        }
        if (dataStatic) {
            component.instance.dataStatic = dataStatic;
        }
        return component;
    }
}