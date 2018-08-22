import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ContentComponent} from './components/content/content.component';
import {NewContentComponent} from './components/new-content/new-content.component';
import {EditContentComponent} from './components/edit-content/edit-content.component';

const routes: Routes = [
    {
        path: '',
        component: ContentComponent
    },
    {
        path: 'new/:contenttype',
        component: NewContentComponent
    },
    {
        path: 'edit/:id/:contenttype',
        component: EditContentComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContentRoutingModule {}
