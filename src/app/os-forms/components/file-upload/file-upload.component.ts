import {Component, Input, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WebsocketService} from '../../../core/services/websocket.service';
import {AuthenticateService} from '../../../core/services/authenticate.service';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../../../core/services/message.service';

export interface FileSocket {
    id: string;
    type: string;
    name: string;
    path: string;
}

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileUploadComponent),
            multi: true
        }]
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {
    @Input() accept: {
        type: string;
        maxSize?: number;
        maxRez?: string;
        minRez?: string;
    };
    @Input() multiValue: number;
    @Input() id: number;
    files: File[] = [];
    dragFiles: File[] = [];
    progress = 0;
    validComboDrag = true;
    inputValue: FileSocket[] = [];
    bundle: any;
    progressColor = 'transparent';
    show = false;
    propagateChange: any = () => {};

    /**
     * @ignore
     * @param wsSocket - web socket service
     * @param message - message service
     * @param router - angular router service
     * @param auth - authenticate service
     */
    constructor(private wsSocket: WebsocketService,
                private message: MessageService,
                private router: ActivatedRoute,
                private auth: AuthenticateService) {
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.getBundle();
    }

    writeValue(value: any) {
        if (value !== '') {
            this.inputValue = value;
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
    }

    /**
     * Used to send the the selected file information to the server and construct the input value
     * @param files type File array
     */
    uploadFiles(files: File[]): void {
        this.show = true;
        let init = false;
        let sedate: any;
        for (let i = 0; i < files.length; i++) {
            if ((files.length - i === 1) && files.length > 0) {
                sedate = files[i];
            }
        }
        this.wsSocket.sendRequest({
            eventType: 'media',
            event: 'CreateMedia',
            data: {
                token: this.auth.getToken(),
                entityType: this.getEntityType(),
                bundle: this.bundle,
                file: {
                    buffer: sedate,
                    name: sedate.name,
                    id: this.id,
                    type: sedate.type.slice(0, sedate.type.indexOf('/'))
                }
            }
        }).subscribe(x => {
            if (init) {
                return;
            } else {
                init = true;
            }
            if (x.statusCode === 200 || x.statusCode === 201) {
                this.inputValue.push({
                    id: x.body.id,
                    type: sedate.type,
                    name: sedate.name,
                    path: x.body.path
                });
                this.progressColor = '#53D79F';
                this.progress = 100;
                setTimeout(() => this.show = false, 500);
            } else {
                this.message.add(x.body, 'danger');
                this.progressColor = '#b30000';
                this.progress = 100;
                setTimeout(() => this.show = false, 500);
            }
        });
        this.progressColor = 'transparent';
        this.progress = 0;
    }

    /**
     * Cancel the progress
     */
    public cancel(): void {
        this.progress = 0;
    }

    /**
     * Retrieve the content type from the url
     * @return {string | null}
     */
    private getBundle(): string | null {
        this.bundle = this.router.snapshot.paramMap.get('contenttype');
        if (this.bundle === null) {
            this.bundle = 'user';
        }
        return this.bundle;
    }

    /**
     * Retrieve the entity type
     */
    private getEntityType(): string {
        let type: any;
        if (this.bundle && this.bundle === 'user') {
            type = 'user';
        } else {
            type = 'node';
        }
        return type;
    }

}
