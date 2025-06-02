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
  startGame:boolean = true;
  cards: Card[] = [];
  flippedCards: Card[] = [];
  score = 0;
  currentIndex:number = 0;
  imageAmount: number = 0;
  level = [
    {level:1, cards:4},
    {level:2, cards:5},
    {level:3, cards:7},
    {level:4, cards:9},
    {level:5, cards:10},
  ]
  images = ['🍎', '🚗', '🐶', '🎵', '🏀', '🐱', '🌈', '🌻',
  '🍕', '🚀', '🐸', '📚', '🎲', '🎈', '🧩'];

  ngOnInit(): void {
    
    this.resetGame();
  }

  startMindPairs(){
    this.startGame = !this.startGame;
  }

  resetGame(): void {
    this.imageAmount = this.level[this.currentIndex].cards;
    console.log(this.imageAmount);
    const selectedImages = this.images.slice(0, this.imageAmount);
    const doubledImages = [...selectedImages, ...selectedImages];
    console.log(doubledImages);
    const shuffled = doubledImages
  .map((img, i) => ({ id: i, image: img, matched: false, flipped: false }))
  .sort(() => Math.random() - 0.5);
    console.log(shuffled)
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
      console.log(this.score)
      if(this.score === this.level[this.currentIndex].cards){
        this.nextLevel();
      }
    } else {
      first.flipped = false;
      second.flipped = false;
    }
    this.flippedCards = [];
  }
  nextLevel(){
    if(this.currentIndex === 5){
      return
    }else{
      this.currentIndex++;
        this.resetGame();
    }
  }
}
