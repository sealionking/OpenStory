import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthenticateService} from './services/authenticate.service';
import {AuthGuard} from './guard/auth-guard';
import {GlobalObjectsRefService} from './services/global-objects-ref.service';
import {MessageService} from './services/message.service';
import {WebsocketService} from './services/websocket.service';
import {StatusCodesService} from './services/status-code.service';


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    providers: [
        AuthenticateService,
        AuthGuard,
        GlobalObjectsRefService,
        MessageService,
        WebsocketService,
        StatusCodesService
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
