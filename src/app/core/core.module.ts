import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthenticateService} from './services/authenticate.service';
import {AuthGuard} from './guard/auth-guard';
import {MessageService} from './services/message.service';
import {WebsocketService} from './services/websocket.service';


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    providers: [
        AuthenticateService,
        AuthGuard,
        MessageService,
        WebsocketService
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
