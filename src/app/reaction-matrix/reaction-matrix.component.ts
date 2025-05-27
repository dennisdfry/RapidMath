import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Cell {
  id: number;
  isActive: boolean;
}

@Component({
  selector: 'app-reaction-matrix',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reaction-matrix.component.html',
  styleUrl: './reaction-matrix.component.scss'
})
export class ReactionMatrixComponent implements OnInit, OnDestroy {
  grid: Cell[] = [];
  score = 0;
  lives = 3;
  activeCellId: number | null = null;
  intervalId: any;
  gameStarted = false;

  ngOnInit(): void {
    this.initGrid();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  initGrid(): void {
    this.grid = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      isActive: false,
    }));
  }

  startGame(): void {
    this.gameStarted = true;
    this.score = 0;
    this.lives = 3;
    this.initGrid();
    this.intervalId = setInterval(() => {
      this.activateRandomCell();
    }, 1200);
  }

  activateRandomCell(): void {
    this.grid.forEach(cell => (cell.isActive = false));
    const randIndex = Math.floor(Math.random() * this.grid.length);
    this.grid[randIndex].isActive = true;
    this.activeCellId = randIndex;

    setTimeout(() => {
      if (this.grid[randIndex].isActive) {
        this.grid[randIndex].isActive = false;
        this.lives--;
        if (this.lives <= 0) this.endGame();
      }
    }, 2000);
  }

  handleClick(cell: Cell): void {
    if (cell.isActive) {
      this.score++;
      cell.isActive = false;
    } else {
      this.lives--;
    }
    if (this.lives <= 0) this.endGame();
  }

  endGame(): void {
    clearInterval(this.intervalId);
    alert(`Spiel vorbei! Dein Punktestand: ${this.score}`);
    this.gameStarted = false;
    this.initGrid();
  }
}