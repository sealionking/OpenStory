import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {SharedModule} from './shared/shared.module';


@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent,
        SideMenuComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        SharedModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
