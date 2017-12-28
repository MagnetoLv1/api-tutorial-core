import { TestBed, inject } from '@angular/core/testing';

import { FormdataService } from './formdata.service';

describe('FormdataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormdataService]
    });
  });

  it('should be created', inject([FormdataService], (service: FormdataService) => {
    expect(service).toBeTruthy();
  }));
});
