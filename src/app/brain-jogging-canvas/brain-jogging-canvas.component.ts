import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Point {
  x: number;
  y: number;
  radius: number;
  numberOfPoint: number;
  colorIndex: number;
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
  private colors = ['#5a5c52', '#c6c0b6', '#b6845c', '#6c91bf'];

  points: Point[] = [];
  clickedPoints: Point[] = [];
  score: number = 0;
  firstPointRef: number = 0;
  endGameSequenz: boolean = false;
  secondPhaseStarted: boolean = false;
  progressPercent: number = 0;
  currentLevel: number = 1;
  showStartScreen: boolean = true;
  hoveredPointIndex: number | null = null;
  showCanvas: boolean = false;
  CANVAS_WIDTH:number = 300;
  CANVAS_HEIGHT:number = 500;
  private rearrangeIntervalId: any;
  private updateProgressId: any;
  private gameDuration = 30000; // 30 Sekunden
  private colorChangeInterval = 5000; // 5 Sekunden
  private startTime = 0;
  private animationFrameId: number = 0;
  private gameTimeoutId: any;

  private canvasWidth = 300;
  private canvasHeight = 500;

  startGame(): void {
  const canvas = this.canvasRef?.nativeElement;
  if (!canvas || !this.ctx) {
    this.ctx = canvas?.getContext('2d')!;
    if (!this.ctx) {
      console.error('Canvas-Kontext konnte nicht erstellt werden.');
      return;
    }
  }

  this.showStartScreen = false;
  this.score = 0;
  this.firstPointRef = 0;
  this.endGameSequenz = false;
  this.secondPhaseStarted = false;
  this.clickedPoints = [];
  this.generateRandomPoints();
  this.startTime = Date.now();
  this.draw();

  this.rearrangeIntervalId = setInterval(() => {
    this.rearrangeRemainingPoints();
  }, this.colorChangeInterval);

  this.gameTimeoutId = setTimeout(() => {
    this.endGame();
  }, this.gameDuration);

  this.updateProgressId = setInterval(() => {
    const elapsed = Date.now() - this.startTime;
    this.progressPercent = Math.min((elapsed / this.gameDuration) * 100, 100);
  }, 100);
}

  // startGame(): void {
  //   if (!this.ctx) {
  //     const canvas = this.canvasRef?.nativeElement;
  //     if (!canvas) {
  //       console.error('Canvas nicht gefunden.');
  //       return;
  //     }
  //     this.ctx = canvas.getContext('2d')!;
  //   }

  //   this.showStartScreen = false;
  //   this.showCanvas = true;
  //   this.score = 0;
  //   this.firstPointRef = 0;
  //   this.endGameSequenz = false;
  //   this.secondPhaseStarted = false;
  //   this.generateRandomPoints();
  //   this.startTime = Date.now();
  //   this.draw();

  //   this.rearrangeIntervalId = setInterval(() => {
  //     this.rearrangeRemainingPoints();
  //   }, this.colorChangeInterval);

  //   this.gameTimeoutId = setTimeout(() => {
  //     this.endGame();
  //   }, this.gameDuration);

  //   this.updateProgressId = setInterval(() => {
  //     const elapsed = Date.now() - this.startTime;
  //     this.progressPercent = Math.min((elapsed / this.gameDuration) * 100, 100);
  //   }, 100);
  // }

  // ngAfterViewInit(): void {
  //   this.showCanvas = true;
  //   const canvas = this.canvasRef?.nativeElement;
  //   if (!canvas) {
  //     console.error('Canvas nicht gefunden.');
  //     return;
  //   }
  //   this.ctx = canvas.getContext('2d')!;
  //   canvas.addEventListener('click', this.handleClick.bind(this));
  //   canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

  //   this.rearrangeIntervalId = setInterval(() => {
  //     this.rearrangeRemainingPoints();
  //   }, this.colorChangeInterval);

  //   this.gameTimeoutId = setTimeout(() => {
  //     this.endGame();
  //   }, this.gameDuration);

  //   this.updateProgressId = setInterval(() => {
  //     const elapsed = Date.now() - this.startTime;
  //     this.progressPercent = Math.min((elapsed / this.gameDuration) * 100, 100);
  //   }, 100);
  // }

  ngAfterViewInit(): void {
  const canvas = this.canvasRef?.nativeElement;
  if (!canvas) {
    console.error('Canvas nicht gefunden.');
    return;
  }
  this.ctx = canvas.getContext('2d')!;
  canvas.addEventListener('click', this.handleClick.bind(this));
  canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
}

  handleMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let found = false;
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
      if (dist <= p.radius) {
        this.hoveredPointIndex = i;
        found = true;
        break;
      }
    }

    if (!found) {
      this.hoveredPointIndex = null;
    }

    const canvasEl = this.canvasRef.nativeElement;
    canvasEl.style.cursor = found ? 'pointer' : 'default';
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

    const colorCount = this.colors.length;
    for (let i = 0; i < 20; i++) {
      let validPoint = false;
      while (!validPoint && attempts < 500) {
        const newPoint = {
          x: Math.random() * (this.CANVAS_WIDTH - 40) + 20,
          y: Math.random() * (this.CANVAS_HEIGHT - 40) + 20,
          radius: 20,
          numberOfPoint: i,
          colorIndex: Math.floor(Math.random() * colorCount) // Farbe zufällig
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
        const newX = Math.random() * (this.CANVAS_WIDTH - 40) + 20;
        const newY = Math.random() * (this.CANVAS_HEIGHT - 40) + 20;
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

    if (!this.endGameSequenz) {
      this.animationFrameId = requestAnimationFrame(this.draw);
    }
  };

  drawPoints(): void {
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    this.points.forEach((point, index) => {
      const isHovered = index === this.hoveredPointIndex;
      const radius = isHovered ? point.radius + 5 : point.radius;
      const color = isHovered ? '#ff4444' : this.colors[point.colorIndex];

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = 'white';
      this.ctx.fillText((point.numberOfPoint + 1).toString(), point.x, point.y);
    });
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  endGame(): void {
    this.endGameSequenz = true;
    cancelAnimationFrame(this.animationFrameId);
    clearInterval(this.rearrangeIntervalId);
    clearInterval(this.updateProgressId);

    if (this.firstPointRef === 20) {
      this.currentLevel++;
    }

    this.showStartScreen = true;
  }
}
