import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Geno2mpComponent } from './geno2mp.component';

describe('Geno2mpComponent', () => {
  let component: Geno2mpComponent;
  let fixture: ComponentFixture<Geno2mpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Geno2mpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Geno2mpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
