import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmartProteinDomainComponent } from './smart-protein-domain.component';

describe('SmartProteinDomainComponent', () => {
  let component: SmartProteinDomainComponent;
  let fixture: ComponentFixture<SmartProteinDomainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartProteinDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartProteinDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
