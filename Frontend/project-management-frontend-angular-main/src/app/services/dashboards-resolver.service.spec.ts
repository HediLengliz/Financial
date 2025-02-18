import { TestBed } from '@angular/core/testing';

import { DashboardsResolverService } from './dashboards-resolver.service';

describe('DashboardsResolverService', () => {
  let service: DashboardsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
