import { TestBed } from '@angular/core/testing';

import { ApprovalHistoryService } from './approval-history.service';

describe('ApprovalHistoryService', () => {
  let service: ApprovalHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovalHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
