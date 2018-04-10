import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CommentsComponent} from './components/comments/comments.component';
import {CommentsRoutingModule} from './comments-routing.module';
import {CommentsService} from './services/comments.service';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxMasonryModule} from '../masonry/masonry.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports: [
    CommonModule,
    CommentsRoutingModule,
    FilterPipeModule,
    FormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    NgSelectModule,
    NgxMasonryModule
  ],
  providers: [CommentsService],
  declarations: [CommentsComponent]
})
export class CommentsModule { }
