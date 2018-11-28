import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContentComponent} from './components/content/content.component';
import {ContentRoutingModule} from './content-routing.module';
import {ContentService} from './services/content.service';
import {NgxMasonryModule} from 'ngx-masonry';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from '../shared/shared.module';
import { NewContentComponent } from './components/new-content/new-content.component';
import { EditContentComponent } from './components/edit-content/edit-content.component';
import {OsFormsModule} from '../os-forms/os-forms.module';
import {LottieAnimationViewModule} from 'ng-lottie';

/**
 * The Content module
 * Embeds <Content> component & service and it's routing definition in {@link ContentRoutingModule}
 */
@NgModule({
    imports: [
        CommonModule,
        ContentRoutingModule,
        SharedModule,
        NgxMasonryModule,
        NgSelectModule,
        OsFormsModule,
        LottieAnimationViewModule.forRoot()
    ],
    declarations: [ContentComponent, NewContentComponent, EditContentComponent],
    providers: [
        ContentService
    ]
})
export class ContentModule {
}
