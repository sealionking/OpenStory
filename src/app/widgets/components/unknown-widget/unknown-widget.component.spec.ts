import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownWidgetComponent } from './unknown-widget.component';

describe('UnknownWidgetComponent', () => {
  let component: UnknownWidgetComponent;
  let fixture: ComponentFixture<UnknownWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnknownWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnknownWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
