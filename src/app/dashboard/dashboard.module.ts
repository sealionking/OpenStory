import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardComponent} from './components/dashboard/dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardService} from './services/dashboard.service';
import {GridsterModule} from 'angular-gridster2';
import {NgxMasonryModule} from '../masonry/masonry.module';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        GridsterModule,
        NgxMasonryModule
    ],
    providers: [DashboardService],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}
