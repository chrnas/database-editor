import { TestBed } from '@angular/core/testing';

import { ColumnCreatorService } from './column-creator.service';

describe('ColumnCreatorService', () => {
  let service: ColumnCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
