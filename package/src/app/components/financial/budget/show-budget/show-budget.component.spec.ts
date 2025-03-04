import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBudgetComponent } from './show-budget.component';

describe('ShowBudgetComponent', () => {
  let component: ShowBudgetComponent;
  let fixture: ComponentFixture<ShowBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
