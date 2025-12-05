import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailchimpComponent } from './mailchimp.component';

describe('MailchimpComponent', () => {
  let component: MailchimpComponent;
  let fixture: ComponentFixture<MailchimpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MailchimpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailchimpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
