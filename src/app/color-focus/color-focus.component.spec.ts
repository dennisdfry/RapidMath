import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorFocusComponent } from './color-focus.component';

describe('ColorFocusComponent', () => {
  let component: ColorFocusComponent;
  let fixture: ComponentFixture<ColorFocusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorFocusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColorFocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
