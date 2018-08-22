import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoublebounceComponent } from './doublebounce.component';

describe('DoublebounceComponent', () => {
  let component: DoublebounceComponent;
  let fixture: ComponentFixture<DoublebounceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoublebounceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoublebounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
