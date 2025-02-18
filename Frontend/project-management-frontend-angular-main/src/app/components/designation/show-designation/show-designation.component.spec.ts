import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDesignationComponent } from './show-designation.component';

describe('ShowDesignationComponent', () => {
  let component: ShowDesignationComponent;
  let fixture: ComponentFixture<ShowDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDesignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
