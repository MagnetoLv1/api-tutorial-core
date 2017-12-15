import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlencodedComponent } from './urlencoded.component';

describe('UrlencodedComponent', () => {
  let component: UrlencodedComponent;
  let fixture: ComponentFixture<UrlencodedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlencodedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlencodedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
