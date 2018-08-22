import { TestBed, inject } from '@angular/core/testing';

import { WidgetServiceService } from './widget-service.service';

describe('WidgetServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WidgetServiceService]
    });
  });

  it('should be created', inject([WidgetServiceService], (service: WidgetServiceService) => {
    expect(service).toBeTruthy();
  }));
});
