import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DemoChartsComponent} from './components/demo-charts/demo-charts.component';


const routes: Routes = [
    {
        path: '',
        component: DemoChartsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EchartRoutingModule {
}
