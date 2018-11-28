import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WidgetBodyComponent} from './container/widget-body/widget-body.component';
import {UsersWidgetComponent} from './components/users-widget/users-widget.component';
import {WidgetServiceService} from './services/widget-service.service';
import {ContentWidgetComponent} from './components/content-widget/content-widget.component';
import {CommentWidgetComponent} from './components/comment-widget/comment-widget.component';
import {MediaWidgetComponent} from './components/media-widget/media-widget.component';
import {UnknownWidgetComponent} from './components/unknown-widget/unknown-widget.component';
import {ActiveUsersComponent} from './components/active-users/active-users.component';
import {NewestUsersComponent} from './components/newest-users/newest-users.component';
import {TopContentComponent} from './components/top-content/top-content.component';
import {ContentEvoComponent} from './components/content-evo/content-evo.component';
import {SharedModule} from '../shared/shared.module';
import {LottieAnimationViewModule} from 'ng-lottie';
import {NgxEchartsModule} from 'ngx-echarts';
import { DeviceSessionComponent } from './components/device-session/device-session.component';
import {BrowserSessionComponent} from './components/browser-session/browser-session.component';
import { RushHoursComponent } from './components/rush-hours/rush-hours.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LottieAnimationViewModule.forRoot(),
        NgxEchartsModule
    ],
    providers: [WidgetServiceService],
    declarations: [
        WidgetBodyComponent,
        UsersWidgetComponent,
        ContentWidgetComponent,
        CommentWidgetComponent,
        MediaWidgetComponent,
        UnknownWidgetComponent,
        ActiveUsersComponent,
        NewestUsersComponent,
        TopContentComponent,
        ContentEvoComponent,
        DeviceSessionComponent,
        BrowserSessionComponent,
        RushHoursComponent
    ],
    exports: [WidgetBodyComponent],
    entryComponents: [
        UsersWidgetComponent,
        ContentWidgetComponent,
        CommentWidgetComponent,
        MediaWidgetComponent,
        UnknownWidgetComponent,
        ActiveUsersComponent,
        NewestUsersComponent,
        TopContentComponent,
        ContentEvoComponent,
        DeviceSessionComponent,
        BrowserSessionComponent,
        RushHoursComponent
    ]
})
export class WidgetsModule {
}
