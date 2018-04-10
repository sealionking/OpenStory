import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';
import {JsonSchemaFormModule} from 'angular2-json-schema-form';

import {ContentComponent} from './components/content/content.component';
import {ContentRoutingModule} from './content-routing.module';
import {ContentService} from './services/content.service';
import {NgxMasonryModule} from '../masonry/masonry.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from '../shared/shared.module';
import { NewContentComponent } from './components/new-content/new-content.component';
import { EditContentComponent } from './components/edit-content/edit-content.component';

/**
 * The Content module
 * Embeds <Content> component & service and it's routing definition in {@link ContentRoutingModule}
 */
@NgModule({
    imports: [
        CommonModule,
        ContentRoutingModule,
        SharedModule,
        Ng4LoadingSpinnerModule.forRoot(),
        NgxMasonryModule,
        NgSelectModule,
        JsonSchemaFormModule
    ],
    declarations: [ContentComponent, NewContentComponent, EditContentComponent],
    providers: [
        ContentService
    ]
})
export class ContentModule {
}
