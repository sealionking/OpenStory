import { TestBed, inject } from '@angular/core/testing';

import { StatusCodeService } from './status-code.service';

describe('StatusCodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusCodeService]
    });
  });

  it('should be created', inject([StatusCodeService], (service: StatusCodeService) => {
    expect(service).toBeTruthy();
  }));
});
