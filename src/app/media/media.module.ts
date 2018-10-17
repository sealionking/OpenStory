import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from '@angular/forms';
import {MediaComponent} from './components/media/media.component';
import {MediaRoutingModule} from './media-routing.module';
import {MediaService} from './services/media.service';
import { NgxMasonryModule } from 'ngx-masonry';
import {NgSelectModule} from '@ng-select/ng-select';
import {LottieAnimationViewModule} from 'ng-lottie';
import {TruncateModule} from '@yellowspot/ng-truncate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MediaRoutingModule,
        NgxMasonryModule,
        NgSelectModule,
        LottieAnimationViewModule.forRoot(),
        TruncateModule
    ],
    providers: [MediaService],
    declarations: [MediaComponent]
})
export class MediaModule {}
