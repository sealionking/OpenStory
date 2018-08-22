import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ModalModule} from 'ngx-bootstrap';

import {DashboardContainerComponent} from './container/dashboard-container/dashboard-container.component';
import {DashboardLibraryComponent} from './components/dashboard-library/dashboard-library.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardService} from './services/dashboard.service';
import {WidgetsModule} from '../widgets/widgets.module';
import {SharedModule} from '../shared/shared.module';
import {LottieAnimationViewModule} from 'ng-lottie';

@NgModule({
    imports: [
        DashboardRoutingModule,
        CommonModule,
        ModalModule.forRoot(),
        WidgetsModule,
        SharedModule,
        LottieAnimationViewModule.forRoot()
    ],
    providers: [DashboardService],
    declarations: [DashboardContainerComponent, DashboardLibraryComponent]
})
export class DashboardModule {
}
