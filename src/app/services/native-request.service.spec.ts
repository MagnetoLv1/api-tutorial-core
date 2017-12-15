import { TestBed, inject } from '@angular/core/testing';

import { NativeRequestService } from './native-request.service';

describe('NativeRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeRequestService]
    });
  });

  it('should be created', inject([NativeRequestService], (service: NativeRequestService) => {
    expect(service).toBeTruthy();
  }));
});
