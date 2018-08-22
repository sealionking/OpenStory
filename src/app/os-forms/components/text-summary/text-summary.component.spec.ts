import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSummaryComponent } from './text-summary.component';

describe('TextSummaryComponent', () => {
  let component: TextSummaryComponent;
  let fixture: ComponentFixture<TextSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
