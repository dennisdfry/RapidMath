import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionMatrixComponent } from './reaction-matrix.component';

describe('ReactionMatrixComponent', () => {
  let component: ReactionMatrixComponent;
  let fixture: ComponentFixture<ReactionMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionMatrixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReactionMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
