import { TestBed } from '@angular/core/testing';

import { SeatAllocationService } from './seat-allocation.service';

describe('SeatAllocationService', () => {
  let service: SeatAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeatAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
