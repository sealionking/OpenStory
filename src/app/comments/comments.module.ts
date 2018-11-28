import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CommentsComponent} from './components/comments/comments.component';
import {CommentsRoutingModule} from './comments-routing.module';
import {CommentsService} from './services/comments.service';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxMasonryModule} from 'ngx-masonry';
import {LottieAnimationViewModule} from 'ng-lottie';

@NgModule({
  imports: [
    CommonModule,
    CommentsRoutingModule,
    FilterPipeModule,
    FormsModule,
    NgSelectModule,
    NgxMasonryModule,
    LottieAnimationViewModule.forRoot()
  ],
  providers: [CommentsService],
  declarations: [CommentsComponent]
})
export class CommentsModule { }
