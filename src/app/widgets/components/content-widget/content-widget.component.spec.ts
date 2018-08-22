import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWidgetComponent } from './content-widget.component';

describe('ContentWidgetComponent', () => {
  let component: ContentWidgetComponent;
  let fixture: ComponentFixture<ContentWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
