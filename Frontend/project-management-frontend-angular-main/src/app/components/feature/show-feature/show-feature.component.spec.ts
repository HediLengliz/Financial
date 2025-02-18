import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFeatureComponent } from './show-feature.component';

describe('ShowFeatureComponent', () => {
  let component: ShowFeatureComponent;
  let fixture: ComponentFixture<ShowFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
