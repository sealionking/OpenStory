import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBodyComponent } from './widget-body.component';

describe('WidgetBodyComponent', () => {
  let component: WidgetBodyComponent;
  let fixture: ComponentFixture<WidgetBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
