

import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Point {
  x: number;
  y: number;
  radius: number;
  numberOfPoint: number;
}

@Component({
  selector: 'app-brain-jogging-canvas',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './brain-jogging-canvas.component.html',
  styleUrls: ['./brain-jogging-canvas.component.scss']
})
export class BrainJoggingCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('brainCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  points: Point[] = [];
  clickedPoints: Point[] = []; 
  private intervalId: any;
  score: number = 0;
  firstPointRef: number = 0;
  endGameSequenz: boolean = false;
  startMindClicker: boolean = true;
  secondPhaseStarted: boolean = false; 

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.addEventListener('click', this.handleClick.bind(this));
    this.generateRandomPoints();
    this.drawPoints();
    
    
    setTimeout(() => {
      this.rearrangeRemainingPoints();
    }, 5000);

   
    setTimeout(() => {
      this.endGame();
    }, 20000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  handleClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const dist = Math.hypot(p.x - clickX, p.y - clickY);

      if (dist <= p.radius && p.numberOfPoint === this.firstPointRef) {
        this.firstPointRef++;
        this.score++;

        console.log('Getroffen! Punktestand:', this.score);

        this.clickedPoints.push(p); 
        this.points.splice(i, 1);   
        this.clearCanvas();
        this.drawPoints();
        break;
      }
    }
  }

  generateRandomPoints(): void {
    this.points = [];
    const minDistance = 2 * 20 + 10;
    let attempts = 0;
    for (let i = 0; i < 20; i++) {
      let validPoint = false;
      while (!validPoint && attempts < 500) {
        const newPoint = {
          x: Math.random() * 750 + 20,
          y: Math.random() * 550 + 20,
          radius: 20,
          numberOfPoint: i
        };
        let overlaps = false;
        for (const p of this.points) {
          const dist = Math.hypot(p.x - newPoint.x, p.y - newPoint.y);
          if (dist < minDistance) {
            overlaps = true;
            break;
          }
        }
        if (!overlaps) {
          this.points.push(newPoint);
          validPoint = true;
        }
        attempts++;
      }
    }
  }

  drawPoints(): void {
    this.clearCanvas();
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    this.points.forEach(point => {
      this.ctx.fillStyle = this.secondPhaseStarted ? '#FF5733' : '#3DCFB6'; 
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = 'white';
      this.ctx.fillText((point.numberOfPoint + 1).toString(), point.x, point.y);
    });
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, 800, 600);
  }

  rearrangeRemainingPoints(): void {
    console.log('Neue Runde: Punkte werden neu verteilt...');
    this.secondPhaseStarted = true;
    const remainingPoints = [...this.points]; 
    this.points = [];
    const minDistance = 2 * 20 + 10;
    let attempts = 0;
    for (const p of remainingPoints) {
      let validPoint = false;
      while (!validPoint && attempts < 500) {
        const newX = Math.random() * 750 + 20;
        const newY = Math.random() * 550 + 20;

        let overlaps = false;
        for (const placed of this.points) {
          const dist = Math.hypot(placed.x - newX, placed.y - newY);
          if (dist < minDistance) {
            overlaps = true;
            break;
          }
        }
        if (!overlaps) {
          this.points.push({ ...p, x: newX, y: newY });
          validPoint = true;
        }
        attempts++;
      }
    }
    this.drawPoints();
  }
  endGame(): void {
    this.endGameSequenz = true;
    console.log('Spiel vorbei! Endpunktestand:', this.score);
  }
}
