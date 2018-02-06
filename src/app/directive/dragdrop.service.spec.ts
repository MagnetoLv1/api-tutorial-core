import { TestBed, inject } from '@angular/core/testing';

import { DragdropService } from './dragdrop.service';

describe('DragdropService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DragdropService]
    });
  });

  it('should be created', inject([DragdropService], (service: DragdropService) => {
    expect(service).toBeTruthy();
  }));
});
