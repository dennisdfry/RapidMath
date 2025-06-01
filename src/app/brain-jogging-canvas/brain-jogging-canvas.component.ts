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
  CANVAS_WIDTH: number = 300;
  CANVAS_HEIGHT: number = 500;
  levels = [
    { level: 1, points: 10 },
    { level: 2, points: 15 },
    { level: 3, points: 20 },
    { level: 4, points: 25 },
    { level: 5, points: 30 },
  ];
  newLevel: number = 0;
  private rearrangeIntervalId: any;
  private updateProgressId: any;
  private gameDuration = 30000;
  private colorChangeInterval = 5000;
  private startTime = 0;
  private animationFrameId: number = 0;
  private gameTimeoutId: any;
  private canvasWidth = 300;
  private canvasHeight = 500;


  startGame(): void {
    this.initCanvas();
    this.resetVariable();
    this.generateRandomPoints();
    this.draw();
    this.initIntervals();
  }

  initIntervals() {
    this.startTime = Date.now();
    this.rearrangeIntervalId = setInterval(() => {
      this.rearrangeRemainingPoints();
    }, this.colorChangeInterval);
    this.gameTimeoutId = setTimeout(() => {
      this.endGame();
    }, this.gameDuration);
    this.updateProgressId = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      this.progressPercent = Math.min((elapsed / this.gameDuration) * 100, 100);
      console.log(elapsed)
    }, 100);
  }

  resetVariable() {
    this.showStartScreen = false;
    this.score = 0;
    this.endGameSequenz = false;
    this.secondPhaseStarted = false;
    this.clickedPoints = [];
  }

  initCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.ctx) {
      this.ctx = canvas?.getContext('2d')!;
      if (!this.ctx) {
        console.error('Canvas-Kontext konnte nicht erstellt werden.');
        return;
      }
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef?.nativeElement;
    canvas.addEventListener('click', this.handleClick.bind(this));
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  private getHoveredPointIndex(x: number, y: number): number | null {
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist <= p.radius) {
        return i;
      }
    }
    return null;
  }

  handleMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const index = this.getHoveredPointIndex(mouseX, mouseY);
    this.hoveredPointIndex = index;
    this.canvasRef.nativeElement.style.cursor = index !== null ? 'pointer' : 'default';
  }

  handleClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const index = this.getHoveredPointIndex(clickX, clickY);
    if (index === null) return;
    const p = this.points[index];
    this.handleClickCheckNextLevel(index, p)
  }

  handleClickCheckNextLevel(index: number, p: Point) {
    if (p.numberOfPoint === this.firstPointRef) {
      this.firstPointRef++;
      this.score++;
      if (this.score === this.newLevel) {
        this.nextLevel();
        this.firstPointRef = 0;
      } else {
        this.clickedPoints.push(p);
        this.points.splice(index, 1);
      }
    }
  }

  initPointsForLevel() {
    for (let index = 0; index < this.levels.length; index++) {
      const element = this.levels[index];
      if (element.level === this.currentLevel) {
        this.newLevel = this.levels[index].points;
      }
    }
  }

  // generateRandomPoints(): void {
  //   this.points = [];
  //   const minDistance = 2 * 20 + 10;
  //   let attempts = 0;
  //   const colorCount = this.colors.length;
  //   this.initPointsForLevel();
  //   for (let i = 0; i < this.newLevel; i++) {
  //     let validPoint = false;
  //     while (!validPoint && attempts < 500) {
  //       const newPoint = {
  //         x: Math.random() * (this.CANVAS_WIDTH - 40) + 20,
  //         y: Math.random() * (this.CANVAS_HEIGHT - 40) + 20,
  //         radius: 20,
  //         numberOfPoint: i,
  //         colorIndex: Math.floor(Math.random() * colorCount)
  //       };
  //       let overlaps = false;
  //       for (const p of this.points) {
  //         const dist = Math.hypot(p.x - newPoint.x, p.y - newPoint.y);
  //         if (dist < minDistance) {
  //           overlaps = true;
  //           break;
  //         }
  //       }
  //       if (!overlaps) {
  //         this.points.push(newPoint);
  //         validPoint = true;
  //       }
  //       attempts++;
  //     }
  //   }
  // }

  generateRandomPoints(): void {
  this.points = [];
  this.initPointsForLevel();

  const minDistance = 2 * 20 + 10;
  const colorCount = this.colors.length;

  for (let i = 0; i < this.newLevel; i++) {
    const point = this.findValidPoint(i, colorCount, minDistance);
    if (point) {
      this.points.push(point);
    }
  }
}


private findValidPoint(index: number, colorCount: number, minDistance: number, maxAttempts = 500): any | null {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = {
      x: Math.random() * (this.CANVAS_WIDTH - 40) + 20,
      y: Math.random() * (this.CANVAS_HEIGHT - 40) + 20,
      radius: 20,
      numberOfPoint: index,
      colorIndex: Math.floor(Math.random() * colorCount)
    };

    if (this.isPositionValid(candidate.x, candidate.y, minDistance)) {
      return candidate;
    }
  }
  return null;
}

  rearrangeRemainingPoints(): void {
    this.secondPhaseStarted = true;
    const remainingPoints = [...this.points];
    this.points = [];
    const minDistance = 50;
    for (const p of remainingPoints) {
      const newPosition = this.findValidPosition(minDistance);
      if (newPosition) {
        this.points.push({ ...p, ...newPosition });
      }
    }
  }

  private findValidPosition(minDistance: number, maxAttempts = 500): { x: number, y: number } | null {
    for (let i = 0; i < maxAttempts; i++) {
      const x = Math.random() * (this.CANVAS_WIDTH - 40) + 20;
      const y = Math.random() * (this.CANVAS_HEIGHT - 40) + 20;
      if (this.isPositionValid(x, y, minDistance)) {
        return { x, y };
      }
    }
    return null;
  }

  private isPositionValid(x: number, y: number, minDistance: number): boolean {
    return this.points.every(p => {
      const dist = Math.hypot(p.x - x, p.y - y);
      return dist >= minDistance;
    });
  }

  nextLevel() {
    this.currentLevel++;
    console.log(this.currentLevel)
    this.endGame();
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
    clearTimeout(this.gameTimeoutId);

    this.showStartScreen = true;
  }

  ngOnDestroy(): void {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
    }
    clearInterval(this.rearrangeIntervalId);
    clearInterval(this.updateProgressId);
    clearTimeout(this.gameTimeoutId);
  }

}
