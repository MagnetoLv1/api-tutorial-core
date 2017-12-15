import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormdataComponent } from './formdata.component';

describe('FormdataComponent', () => {
  let component: FormdataComponent;
  let fixture: ComponentFixture<FormdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
