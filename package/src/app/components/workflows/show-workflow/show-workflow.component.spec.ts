import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowWorkflowComponent } from './show-workflow.component';

describe('ShowWorkflowComponent', () => {
  let component: ShowWorkflowComponent;
  let fixture: ComponentFixture<ShowWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowWorkflowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
