import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from '@angular/forms';
import {MediaComponent} from './components/media/media.component';
import {MediaRoutingModule} from './media-routing.module';
import {MediaService} from './services/media.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {NgxMasonryModule} from '../masonry/masonry.module';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MediaRoutingModule,
        Ng4LoadingSpinnerModule.forRoot(),
        NgxMasonryModule,
        NgSelectModule
    ],
    providers: [MediaService],
    declarations: [MediaComponent]
})
export class MediaModule {}