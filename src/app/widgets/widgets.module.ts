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

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LottieAnimationViewModule.forRoot(),
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
        ContentEvoComponent
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
        ContentEvoComponent
    ]
})
export class WidgetsModule {
}
