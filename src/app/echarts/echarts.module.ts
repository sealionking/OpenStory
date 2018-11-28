import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgxEchartsModule} from 'ngx-echarts';
import {EchartRoutingModule} from './echart-routing.module';
import {DemoChartsComponent} from './components/demo-charts/demo-charts.component';

@NgModule({
    imports: [
        CommonModule,
        NgxEchartsModule,
        EchartRoutingModule
    ],
    declarations: [DemoChartsComponent]
})
export class EchartsModule {
}
