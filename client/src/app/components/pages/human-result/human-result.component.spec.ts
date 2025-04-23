import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanResultComponent } from './human-result.component';

describe('SearchComponent', () => {
  let component: HumanResultComponent;
  let fixture: ComponentFixture<HumanResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
