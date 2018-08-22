import { TestBed, inject } from '@angular/core/testing';

import { OsFormsService } from './os-forms.service';

describe('OsFormsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OsFormsService]
    });
  });

  it('should be created', inject([OsFormsService], (service: OsFormsService) => {
    expect(service).toBeTruthy();
  }));
});
