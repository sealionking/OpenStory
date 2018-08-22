import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersWidgetComponent } from './users-widget.component';

describe('UsersWidgetComponent', () => {
  let component: UsersWidgetComponent;
  let fixture: ComponentFixture<UsersWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
