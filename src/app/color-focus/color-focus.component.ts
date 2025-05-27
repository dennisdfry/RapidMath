import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-color-focus',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './color-focus.component.html',
  styleUrl: './color-focus.component.scss'
})
export class ColorFocusComponent implements OnInit {
  colors = ['Rot', 'Blau', 'Grün', 'Gelb'];
  htmlColors = ['red', 'blue', 'green', 'yellow'];
  displayedWord = '';
  displayedColor = '';
  score = 0;
  gameOver = false;
  gameStarted = false;

  ngOnInit(): void {
    // Spiel wird erst bei Button-Klick gestartet
  }

  startGame(): void {
    this.score = 0;
    this.gameOver = false;
    this.gameStarted = true;
    this.nextRound();
  }

  nextRound(): void {
    const textIndex = Math.floor(Math.random() * this.colors.length);
    const colorIndex = Math.floor(Math.random() * this.htmlColors.length);

    this.displayedWord = this.colors[textIndex];
    this.displayedColor = this.htmlColors[colorIndex];
  }

  handleAnswer(color: string): void {
    if (color === this.displayedColor) {
      this.score++;
      this.nextRound();
    } else {
      this.gameOver = true;
      this.gameStarted = false;
    }
  }

  restart(): void {
    this.startGame();
  }
}

