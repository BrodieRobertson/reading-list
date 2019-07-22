import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIllustratorComponent } from './edit-illustrator.component';

describe('EditIllustratorComponent', () => {
  let component: EditIllustratorComponent;
  let fixture: ComponentFixture<EditIllustratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIllustratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIllustratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
