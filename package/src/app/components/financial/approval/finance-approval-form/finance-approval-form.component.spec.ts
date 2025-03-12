import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceApprovalFormComponent } from './finance-approval-form.component';

describe('FinanceApprovalFormComponent', () => {
  let component: FinanceApprovalFormComponent;
  let fixture: ComponentFixture<FinanceApprovalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceApprovalFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
