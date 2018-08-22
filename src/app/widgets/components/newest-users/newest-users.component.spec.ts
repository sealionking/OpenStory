import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewestUsersComponent } from './newest-users.component';

describe('NewestUsersComponent', () => {
  let component: NewestUsersComponent;
  let fixture: ComponentFixture<NewestUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewestUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewestUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
