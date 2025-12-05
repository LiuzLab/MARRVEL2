import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhenotypesComponent } from './phenotypes.component';

describe('PhenotypesComponent', () => {
  let component: PhenotypesComponent;
  let fixture: ComponentFixture<PhenotypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
