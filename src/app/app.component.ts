import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
  MatTooltipModule,
} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, MatButtonModule, MatTooltipModule, MatInputModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  arethmeticNumberOne: number[] = [];
  arethmeticNumberTwo: number[] = [];
  nextPointArray: number[] = [1];
  levelOne: number = 1;
  min: number = 1;
  max: number = 11;
  operationIndex: number = 0;
  result: any;
  wrong: boolean = false;
  playGame: boolean = false;
  startbutton: boolean = true;
  operatorOne: number = 0;
  operatorTwo: number = 0;



  constructor() { };


  ngOnInit(): void {
    for (let index = 1; index < 11; index++) {
      this.operatorOne = this.mathRandomizer();
      this.operatorTwo = this.mathRandomizer();
      this.fillOperationArray();
    }
  }

  fillOperationArray() {
    this.arethmeticNumberOne.push(this.operatorOne);
    this.arethmeticNumberTwo.push(this.operatorTwo);
  }

  mathRandomizer() {
    return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  }

  startGame() {
    this.playGame = true;
    this.startbutton = false;
  }

  nextround() {
    this.result = null;
    this.operationIndex++
  }

  finish() {
    this.playGame = false;
    this.startbutton = true;
    this.nextLevel();
  }

  nextLevel() {
    this.min = 50;
    this.max = 250;
    this.nextPointArray.push(1);
    this.ngOnInit();
  }

  loose() {
    this.wrong = true;
    this.playGame = false;
    this.startbutton = true;
  }

  check() {
    let operation = this.arethmeticNumberOne[this.operationIndex] + this.arethmeticNumberTwo[this.operationIndex];
    if (operation == this.result) {
      this.nextround();
      if (this.operationIndex === 10) {
        this.finish();
      }
    } else {
      this.loose();
    }
  }
}
