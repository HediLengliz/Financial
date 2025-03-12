import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceApprovalComponent } from './finance-approval.component';

describe('FinanceApprovalComponent', () => {
  let component: FinanceApprovalComponent;
  let fixture: ComponentFixture<FinanceApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
