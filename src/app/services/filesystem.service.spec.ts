import { TestBed, inject } from '@angular/core/testing';

import { FilesystemService } from './filesystem.service';

describe('FilesystemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilesystemService]
    });
  });

  it('should be created', inject([FilesystemService], (service: FilesystemService) => {
    expect(service).toBeTruthy();
  }));
});
