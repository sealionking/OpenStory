import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEvoComponent } from './content-evo.component';

describe('ContentEvoComponent', () => {
  let component: ContentEvoComponent;
  let fixture: ComponentFixture<ContentEvoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentEvoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
