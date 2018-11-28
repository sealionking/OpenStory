import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RushHoursComponent } from './rush-hours.component';

describe('RushHoursComponent', () => {
  let component: RushHoursComponent;
  let fixture: ComponentFixture<RushHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RushHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RushHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
