import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentWidgetComponent } from './comment-widget.component';

describe('CommentWidgetComponent', () => {
  let component: CommentWidgetComponent;
  let fixture: ComponentFixture<CommentWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
