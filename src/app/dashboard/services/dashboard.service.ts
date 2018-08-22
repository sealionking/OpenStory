import {Injectable} from '@angular/core';
import {WidgetModel} from '../../shared/model/widget-model';
import {WebsocketService} from '../../core/services/websocket.service';
import {AuthenticateService} from '../../core/services/authenticate.service';
import {MessageService} from '../../core/services/message.service';

@Injectable()
export class DashboardService {

    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private messageService: MessageService) {
    }

    public arrangeWidget(items: any, data: any) {
        for (let y = 0; y < data.length; y++) {
            for (const x in items) {
                if (x) {
                    const position = Object.keys(items).indexOf(x);
                    if (position === y) {
                        if (items[x] !== y) {
                            items[x] = y;
                        }
                    }
                }
            }
        }
        return items;
    }

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

    saveToLocal(data) {
        localStorage.setItem('itemsShiftPositions', JSON.stringify(data));
    }

    savePositions(widget) {
        this.wsSocket.sendRequest({
            eventType: 'user',
            event: 'SaveUserPreferences',
            data: {
                token: this.auth.getToken(),
                widgets: widget
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        break;
                    case 400:
                        this.messageService.add('Bad request.');
                        break;
                    case 403:
                        this.messageService.add('Access denied.');
                        break;
                    case 404:
                        this.messageService.add('Not Found.');
                        break;
                    case 422:
                        this.messageService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
            });
    }

    getDashboardItems(item, widgets) {
        this.wsSocket.sendRequest({
            eventType: 'user',
            event: 'GetUserPreferences',
            data: {
                token: this.auth.getToken()
            }
        })
            .subscribe(data => {
                switch (data.statusCode) {
                    case 200:
                        item = data.body;
                        for (const value in item) {
                            if (item.hasOwnProperty(value)) {
                                widgets.push(item[value]);
                            }
                        }
                        break;
                    case 400:
                        this.messageService.add('Bad request.');
                        break;
                    case 403:
                        this.messageService.add('Access denied.');
                        break;
                    case 404:
                        this.messageService.add('Not Found.');
                        break;
                    case 422:
                        this.messageService.add('Unprocessable Entity.');
                        break;
                    case 500:
                        this.messageService.add('Internal Server Error.');
                        break;
                    default:
                        this.messageService.add('Connection issues between UI and Server');
                }
            });
    }

}
