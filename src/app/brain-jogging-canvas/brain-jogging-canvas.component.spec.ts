import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainJoggingCanvasComponent } from './brain-jogging-canvas.component';

describe('BrainJoggingCanvasComponent', () => {
  let component: BrainJoggingCanvasComponent;
  let fixture: ComponentFixture<BrainJoggingCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainJoggingCanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrainJoggingCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
