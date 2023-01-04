import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartProteinDomainComponent } from './smart-protein-domain.component';

describe('SmartProteinDomainComponent', () => {
  let component: SmartProteinDomainComponent;
  let fixture: ComponentFixture<SmartProteinDomainComponent>;

  beforeEach(async(() => {
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
