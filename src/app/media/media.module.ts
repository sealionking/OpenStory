import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from '@angular/forms';
import {MediaComponent} from './components/media/media.component';
import {MediaRoutingModule} from './media-routing.module';
import {MediaService} from './services/media.service';
import {NgxMasonryModule} from '../masonry/masonry.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {LottieAnimationViewModule} from 'ng-lottie';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MediaRoutingModule,
        NgxMasonryModule,
        NgSelectModule,
        LottieAnimationViewModule.forRoot()
    ],
    providers: [MediaService],
    declarations: [MediaComponent]
})
export class MediaModule {}
