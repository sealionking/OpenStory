import {Component, forwardRef, OnInit, Input, TemplateRef, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {distinctUntilChanged, debounceTime, switchMap, tap, catchError} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {concat} from 'rxjs/observable/concat';
import 'rxjs/add/operator/takeUntil';

import {AuthenticateService} from '../../../core/services/authenticate.service';
import {WebsocketService} from '../../../core/services/websocket.service';
import {MessageService} from '../../../core/services/message.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {OsFormsService} from '../../services/os-forms.service';
import {StatusCodesService} from '../../../core/services/status-code.service';

export interface ReferenceField {
    label: string;
    id: string;
    disabled?: boolean;
}

@Component({
    selector: 'app-reference-field',
    templateUrl: './reference-field.component.html',
    styleUrls: ['./reference-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ReferenceFieldComponent),
            multi: true
        }]
})
export class ReferenceFieldComponent implements OnInit, ControlValueAccessor {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    @Input() targetType: string;
    @Input() targetBundles: any[];
    @Input() maxItems: number;
    @Input() addNew: boolean;
    contentType: string;
    contentOptions: any = [];
    bundle: string;
    itemsInput$ = new Subject<string>();
    itemsLoading = false;
    items$: Observable<ReferenceField[]>;
    typeList: any[];
    isLoading = true;
    modalRef: BsModalRef;
    newReference: any[];
    showCT = false;
    showTemplate: boolean;
    referenceType: string;
    eventModel: string;
    init = false;
    config = {
        keyboard: false,
        ignoreBackdropClick: true
    };
    ofValue: ReferenceField[];
    changeClear: boolean;
    startClear: boolean;
    buttonValue = false;

    inputVal: any = [];
    propagateChange: any = () => { };

    constructor(private auth: AuthenticateService,
                private message: MessageService,
                private modalService: BsModalService,
                private osService: OsFormsService,
                private status: StatusCodesService,
                private wsSocket: WebsocketService) {
    }

    writeValue(value: any) {
        if (value !== '') {
            this.getDefaultValue(value);
        }
        this.startClear = this.maxItems === value.length;
        if (value.length) {
            this.ofValue = [];
        } else {
            this.ofValue = [{label: null, id: null, disabled: true}];
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
    }

    /**
     * @ignore
     */
    ngOnInit(): void {
        if (this.targetType && (this.targetType === 'node' || this.targetType === 'taxonomy_term')) {
            this.targetBundles.forEach(item => {
                this.contentOptions.push(item);
            });
            this.showCT = true;
        }
    }

    public onChange() {
        this.changeClear = this.maxItems === this.inputVal.length + 1;
        this.startClear = this.maxItems === this.inputVal.length;
        this.propagateChange(this.inputVal);
        if (this.inputVal.length === 0) {
            this.ofValue = [{label: null, id: null, disabled: true}];
        } else {
            this.ofValue.length = 0;
            this.ofValue = [];
        }
    }

    /**
     * Clears the input value sent on submit
     */
    public clear() {
        this.propagateChange('');
        this.ofValue = [{label: null, id: null, disabled: true}];
    }

    /**
     * Sets the default value from the server
     * Adds label to the retrieved object comparing the sent value with the current reference list
     * @param value
     */
    // TODO: Remove this and use the service function when it's done
    private getDefaultValue(value): void {
        this.wsSocket.sendRequest({
            eventType: 'entity',
            event: 'SearchReferences',
            data: {
                token: this.auth.getToken(),
                body: {
                    entityType: this.targetType,
                    bundles: this.targetBundles
                }
            }
        })
            .finally(() => this.isLoading = false)
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
                                        if (this.init) {
                                            return;
                                        } else {
                                            this.init = true;
                                        }
                                        this.inputVal = value;
                                    }
                                });
                            }
                        }
                    }
                } else if (this.status.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     * Retrieves the total list for the reference field type
     */
    private getList(): any[] {
        this.wsSocket.sendRequest({
            eventType: 'entity',
            event: 'SearchReferences',
            data: {
                token: this.auth.getToken(),
                body: {
                    entityType: this.targetType,
                    bundles: this.targetBundles
                }
            }
        })
            .finally(() => this.isLoading = false)
            .subscribe(data => {
                if (data.statusCode === 200 || data.statusCode === 201) {
                    this.typeList = data.body;
                } else if (this.status.checkStatusCode(data)) {
                    return true;
                }
            });
        return this.typeList;
    }

    /**
     * Retrieves the reference list via input character
     * @param term
     */
    private getItems(term: string = null): Observable<any[]> {
        let items;
        if (term !== null && !term.trim()) {
            // if not search term, return empty hero array.
            return of([]);
        } else if (term && this.typeList) {
            items = this.typeList;
            items = items.filter(x => x.label.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe();
    }

    /**
     * Populates the selected list via search by input
     */
    public loadItems() {
        this.getList();
        this.items$ = concat(
            of(this.ofValue), // default items
            this.itemsInput$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => this.itemsLoading = true),
                switchMap(term => this.getItems(term).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => this.itemsLoading = false)
                ))
            )
        );
    }

    /**
     * Function used to retrieve the reference definition
     */
    private referenceTypeField(): void {
        this.wsSocket.sendRequest({
            eventType: 'entity',
            event: 'EntityDefinition', data: {token: this.auth.getToken(), entityType: this.targetType, bundle: this.bundle}
        })
            .subscribe(data => {
                if (data.statusCode === 200 || data.statusCode === 201) {
                    this.newReference = data.body.definition;
                } else if (this.status.checkStatusCode(data)) {
                    return true;
                }
            });
    }

    /**
     * Opens the modal form
     * @param template
     */
    public openModal(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(template, this.config);
    }

    /**
     * Populates the form for the correct reference type
     */
    public callTemplate(): void {
        switch (this.targetType) {
            case 'user':
                this.referenceType = this.targetType;
                this.bundle = 'user';
                this.referenceTypeField();
                this.eventModel = this.targetType;
                this.showTemplate = true;
                break;
            case 'node':
                if (this.contentType) {
                    this.referenceType = this.contentType;
                    this.bundle = this.contentType;
                    this.referenceTypeField();
                    this.eventModel = 'content';
                    this.showTemplate = true;
                }
                break;
            case 'taxonomy_term':
                if (this.contentType) {
                    this.referenceType = this.targetType;
                    this.bundle = this.contentType;
                    this.referenceTypeField();
                    this.eventModel = this.targetType;
                    this.showTemplate = true;
                }
                break;
            default:
                this.message.add(this.status.getMessageType('No entity type found'), 'os-warning');
        }
    }

    /**
     * Closes the modal form and resets the form
     */
    public closeModal(): void {
        this.showTemplate = false;
        this.contentType = null;
        this.modalRef.hide();
    }

    /**
     * Reference form submit function
     * @param referenceData
     */
    public submit(referenceData): void {
        this.buttonValue = true;
        this.wsSocket.sendRequest({
            eventType: this.eventModel, event: 'CreateEntity', data: {
                token: this.auth.getToken(),
                entityType: this.targetType, bundle: this.bundle, body: referenceData
            }
        })
            .take(1)
            .subscribe(data => {
                if (data.statusCode === 201 || data.statusCode === 200) {
                    this.message.add(this.status.getMessageType('reference-create'), 'os-success');
                    this.closeModal();
                } else if (this.status.checkStatusCode(data)) {
                    return true;
                }
                this.buttonValue = false;
            });
    }

}
