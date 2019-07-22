import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustratorDetailsComponent } from './illustrator-details.component';

describe('IllustratorDetailsComponent', () => {
  let component: IllustratorDetailsComponent;
  let fixture: ComponentFixture<IllustratorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IllustratorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllustratorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
