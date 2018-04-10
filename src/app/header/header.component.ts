import {Component, OnInit} from '@angular/core';

import {WebsocketService} from '../core/services/websocket.service';
import {AuthenticateService} from '../core/services/authenticate.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
show = false;
    constructor(private wsService: WebsocketService, private auth: AuthenticateService) {
    }

    ngOnInit() {
    }

    submitLogout(): void {
        this.auth.logout();
    }
}
