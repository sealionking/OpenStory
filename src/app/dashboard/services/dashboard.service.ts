import {Injectable} from '@angular/core';

import {WidgetModel} from '../../shared/model/widget-model';
import {WebsocketService} from '../../core/services/websocket.service';
import {AuthenticateService} from '../../core/services/authenticate.service';
import {StatusCodesService} from '../../core/services/status-code.service';

@Injectable()
export class DashboardService {
    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private statusCodes: StatusCodesService) {
    }

    /**
     * Allows us to build a widget
     * @param widgets
     * @param data
     */
    public buildWidget(widgets: WidgetModel[], data?: any) {
        for (const item in widgets) {
            if (item) {
                const i = widgets[item];
                if (typeof i === 'object') {
                    i.id = data[item].id;
                    i.weight = Number(data[item].id);
                    // i.viewMore = false;
                }
            }
        }
        return widgets;
    }

    /**
     * Allows us to save the current dashboard layout
     * @param widget - widget object
     */
    public savePositions(widget) {
        this.wsSocket.sendRequest({
            eventType: 'user',
            event: 'SaveUserPreferences',
            data: {
                token: this.auth.getToken(),
                widgets: widget
            }
        })
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    return true;
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     * Retrieves the dashboard items
     * @param item
     * @param widgets
     */
    public getDashboardItems(item, widgets) {
        this.wsSocket.sendRequest({
            eventType: 'user',
            event: 'GetUserPreferences',
            data: {
                token: this.auth.getToken()
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.hasOwnProperty('statusCode') && (data.statusCode === 201 || data.statusCode === 200)) {
                    item = data.body;
                    for (const value in item) {
                        if (item.hasOwnProperty(value)) {
                            widgets.push(item[value]);
                        }
                    }
                } else if (this.statusCodes.checkStatusCode(data)) {
                    return true;
                }
            });
    }
}
