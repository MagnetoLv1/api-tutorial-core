import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Save.PromptComponent } from './save.prompt.component';

describe('Save.PromptComponent', () => {
  let component: Save.PromptComponent;
  let fixture: ComponentFixture<Save.PromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Save.PromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Save.PromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
