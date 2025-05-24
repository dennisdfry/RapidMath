import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Card {
  id: number;
  image: string;
  matched: boolean;
  flipped: boolean;
}

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.scss'
})
export class MemoryGameComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  score = 0;
  images = ['🍎', '🚗', '🐶', '🎵', '🏀', '🐱', '🌈', '🌻'];

  ngOnInit(): void {
    this.resetGame();
  }

  resetGame(): void {
    const doubledImages = [...this.images, ...this.images];
    const shuffled = doubledImages
      .map((img, i) => ({ id: i, image: img, matched: false, flipped: false }))
      .sort(() => Math.random() - 0.5);

    this.cards = shuffled;
    this.flippedCards = [];
    this.score = 0;
  }

  flipCard(card: Card): void {
    if (card.flipped || card.matched || this.flippedCards.length >= 2) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 800);
    }
  }

  checkMatch(): void {
    const [first, second] = this.flippedCards;

    if (first.image === second.image) {
      first.matched = true;
      second.matched = true;
      this.score++;
    } else {
      first.flipped = false;
      second.flipped = false;
    }

    this.flippedCards = [];
  }
}
