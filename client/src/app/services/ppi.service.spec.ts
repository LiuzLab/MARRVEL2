import { TestBed } from '@angular/core/testing';

import { PpiService } from './ppi.service';

describe('PpiService', () => {
  let service: PpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
