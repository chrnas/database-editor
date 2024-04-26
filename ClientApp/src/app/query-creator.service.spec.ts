import { TestBed } from '@angular/core/testing';

import { QueryCreatorService } from './query-creator.service';

describe('QueryCreatorService', () => {
  let service: QueryCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
