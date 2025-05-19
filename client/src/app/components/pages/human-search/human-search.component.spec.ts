import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanSearchComponent } from './human-search.component';

describe('HumanSearchComponent', () => {
  let component: HumanSearchComponent;
  let fixture: ComponentFixture<HumanSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
