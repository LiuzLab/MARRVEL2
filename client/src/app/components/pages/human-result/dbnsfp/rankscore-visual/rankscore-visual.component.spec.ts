import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RankscoreVisualComponent } from './rankscore-visual.component';

describe('RankscoreVisualComponent', () => {
  let component: RankscoreVisualComponent;
  let fixture: ComponentFixture<RankscoreVisualComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RankscoreVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankscoreVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
