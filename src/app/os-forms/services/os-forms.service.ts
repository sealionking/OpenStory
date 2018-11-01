import {Injectable} from '@angular/core';
import {WebsocketService} from '../../core/services/websocket.service';
import {AuthenticateService} from '../../core/services/authenticate.service';
import {MessageService} from '../../core/services/message.service';

@Injectable()
export class OsFormsService {

    constructor(private wsSocket: WebsocketService,
                private auth: AuthenticateService,
                private message: MessageService
    ) {
    }

    // TODO: Implement this service correctly
    public getDefaultValue(value, loading, targetType, targetBundles, inputValue) {
        let init = false;
        this.wsSocket.sendRequest({
            eventType: 'entity',
            event: 'SearchReferences',
            data: {
                token: this.auth.getToken(),
                body: {
                    entityType: targetType,
                    bundles: targetBundles
                }
            }
        })
            .finally(() => loading = false)
            .subscribe(data => {
                if (data.statusCode === 200 || data.statusCode === 201) {
                    if (value) {
                        for (let y = 0; y < value.length; y++) {
                            if (value[y].hasOwnProperty('id')) {
                                data.body.find(item => {
                                    if (item['id'] === value[y]['id']) {
                                        value[y]['label'] = item['label'];
                                        value[y]['id'] = item['id'];
                                        value[y]['targetBundle'] = value[y]['targetBundle'];
                                        value[y]['targetType'] = value[y]['targetType'];
                                        if (init) {
                                            return;
                                        } else {
                                            init = true;
                                        }
                                        inputValue = value;
                                    }
                                });
                            }
                        }
                    }
                } else {
                    this.message.add(data.statusCode + ' ' + data.body, 'danger');
                }
            });
    }

}
