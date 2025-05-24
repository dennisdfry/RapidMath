
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
  score: number = 0;
  firstPointRef: number = 0;
  endGameSequenz: boolean = false;
  startMindClicker: boolean = true;
  secondPhaseStarted: boolean = false;
  progressPercent: number = 0;

  private rearrangeIntervalId: any;
  private updateProgressId: any;
  private gameDuration = 30000; // 30 Sekunden
  private colorChangeInterval = 5000; // 5 Sekunden
  private startTime = 0;
  private animationFrameId: number = 0;
  private colorToggle = false;
  private colorIntervalId: any;
  private gameTimeoutId: any;

   ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.addEventListener('click', this.handleClick.bind(this));

    this.generateRandomPoints();
    this.startTime = Date.now();
    this.draw();

    // Punkte alle 5 Sekunden neu anordnen
    this.rearrangeIntervalId = setInterval(() => {
      this.rearrangeRemainingPoints();
      this.colorToggle = !this.colorToggle;
    }, this.colorChangeInterval);

    // Spiel endet nach 30 Sekunden
    this.gameTimeoutId = setTimeout(() => {
      this.endGame();
    }, this.gameDuration);

    // Fortschritt regelmäßig aktualisieren
    this.updateProgressId = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      this.progressPercent = Math.min((elapsed / this.gameDuration) * 100, 100);
    }, 100);
  }

  ngOnDestroy(): void {
      if (typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(this.animationFrameId);
  }
    clearInterval(this.rearrangeIntervalId);
    clearInterval(this.updateProgressId);
    clearTimeout(this.gameTimeoutId);
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
        this.clickedPoints.push(p);
        this.points.splice(i, 1);
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

  rearrangeRemainingPoints(): void {
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
  }

  draw = (): void => {
    this.clearCanvas();
    this.drawPoints();
    this.drawTimeBar();

    if (!this.endGameSequenz) {
      this.animationFrameId = requestAnimationFrame(this.draw);
    }
  };

  drawPoints(): void {
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    this.points.forEach(point => {
      this.ctx.fillStyle = this.colorToggle ? '#5a5c52' : '#c6c0b6';
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = 'white';
      this.ctx.fillText((point.numberOfPoint + 1).toString(), point.x, point.y);
    });
  }

  drawTimeBar(): void {
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(elapsed / this.gameDuration, 1);
    const width = 800 * (1 - progress);

    this.ctx.fillStyle = '#ccc';
    this.ctx.fillRect(0, 580, 800, 20);
    this.ctx.fillStyle = '#5a5c52';
    this.ctx.fillRect(0, 580, width, 20);
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, 800, 600);
  }

    endGame(): void {
    this.endGameSequenz = true;
    cancelAnimationFrame(this.animationFrameId);
    clearInterval(this.rearrangeIntervalId);
    clearInterval(this.updateProgressId);
    console.log('Spiel vorbei! Endpunktestand:', this.score);
  }
}
