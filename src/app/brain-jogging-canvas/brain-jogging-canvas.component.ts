
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  imports: [RouterModule],
  templateUrl: './brain-jogging-canvas.component.html',
  styleUrls: ['./brain-jogging-canvas.component.scss']
})
export class BrainJoggingCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('brainCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  points: Point[] = [];
  private intervalId: any;
  score: number = 0;

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.addEventListener('click', this.handleClick.bind(this));
    this.generateRandomPoints();
    this.drawPoints();

    this.intervalId = setInterval(() => {
      this.generateRandomPoints();
      this.clearCanvas();
      this.drawPoints();
    }, 5000); // alle 5 Sekunden neu
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  generateRandomPoints(): void {
    this.points = [];
    for (let i = 0; i < 20; i++) {
      this.points.push({
        x: Math.random() * 780 + 10, // Canvas-Größe beachten
        y: Math.random() * 580 + 10,
        radius: 10,
        numberOfPoint: i
      });
    }
  }

  drawPoints(): void {
    this.ctx.fillStyle = 'blue';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'blue';
    this.points.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = 'white';
      this.ctx.fillText((point.numberOfPoint + 1).toString(), point.x, point.y);
      this.ctx.fillStyle = 'blue';
    });
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, 800, 600);
  }

  handleClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Überprüfen, ob ein Punkt angeklickt wurde
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const dist = Math.hypot(p.x - clickX, p.y - clickY);

      if (dist <= p.radius) {
        this.score++;
        console.log('Getroffen! Punktestand:', this.score);

        // Optional: Getroffenen Punkt entfernen
        this.points.splice(i, 1);
        this.clearCanvas();
        this.drawPoints();
        break;
      }
    }
  }
}
