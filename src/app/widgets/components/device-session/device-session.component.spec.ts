import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSessionComponent } from './device-session.component';

describe('DeviceSessionComponent', () => {
  let component: DeviceSessionComponent;
  let fixture: ComponentFixture<DeviceSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
