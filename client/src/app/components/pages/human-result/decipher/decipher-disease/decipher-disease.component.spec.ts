import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DecipherDiseaseComponent } from './decipher-disease.component';

describe('DecipherDiseaseComponent', () => {
  let component: DecipherDiseaseComponent;
  let fixture: ComponentFixture<DecipherDiseaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DecipherDiseaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecipherDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
