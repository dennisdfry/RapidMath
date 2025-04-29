import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
  MatTooltipModule,
} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-mathematics',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatTooltipModule, MatInputModule],
  templateUrl: './mathematics.component.html',
  styleUrl: './mathematics.component.scss'
})
export class MathematicsComponent implements OnInit {
  arethmeticNumberOne: number[] = [];
  arethmeticNumberTwo: number[] = [];
  nextPointArrayAddition: number[] = [];
  nextPointArraySubtraction: number[] = [];
  nextPointArrayMulti: number[] = [];
  nextPointArrayDivision: number[] = [];
  randowResultsArray: number[] = [];
  levelOne: number = 0;
  min: number = 1;
  max: number = 11;
  operationIndex: number = 0;
  result: any;
  wrong: boolean = false;
  playGame: boolean = false;
  startbutton: boolean = true;
  operatorOne: number = 0;
  operatorTwo: number = 0;
  operation: any = '';
  operator: string = '+';
  arrayName: string = '';
  exchangeResult: number = 0;
  constructor() { };


  ngOnInit(): void {
  }

  InitOperator() {
    for (let index = 1; index < 11; index++) {
      this.operatorOne = this.mathRandomizer();
      this.operatorTwo = this.mathRandomizer();
      this.fillOperationArray();
    }
  }
  InitOperation() {
    this.operation = eval(`${this.arethmeticNumberOne[this.operationIndex]} ${this.operator} ${this.arethmeticNumberTwo[this.operationIndex]}`);
    this.randowResultsArray.push(this.operation);
  }

  fillOperationArray() {
    this.arethmeticNumberOne.push(this.operatorOne);
    this.arethmeticNumberTwo.push(this.operatorTwo);
  }

  cleararethmeticArrays() {
    this.arethmeticNumberOne = [];
    this.arethmeticNumberTwo = [];
  }

  mathRandomizer() {
    return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  }

  startGame(operatorHtml: string) {
    this.InitOperator();
    this.playGame = true;
    this.startbutton = false;
    this.operationIndex = 0;
    this.operator = operatorHtml;
    this.checkOperator();
    this.InitOperation();
    this.createRandomResults();
    console.log(this.nextPointArrayAddition)
    console.log(this.nextPointArrayMulti)
    console.log(this.nextPointArraySubtraction)
    console.log(this.nextPointArrayDivision)
  }

  createRandomResults() {
    while (this.randowResultsArray.length < 4) {
      const result = this.mathRandomizer();
      if (!this.randowResultsArray.includes(result)) {
        this.randowResultsArray.push(result);
      }
    }
    console.log(this.randowResultsArray);
    this.shuffleArray()
  }

  shuffleArray() {
    for (let i = this.randowResultsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.randowResultsArray[i], this.randowResultsArray[j]] = [this.randowResultsArray[j], this.randowResultsArray[i]];
    }
  }

  checkOperator() {
    if (this.operator === '+') {
      if (this.nextPointArrayAddition.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber(this.nextPointArrayAddition);
      }
    } else if (this.operator === '-') {
      if (this.nextPointArraySubtraction.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber(this.nextPointArraySubtraction);
      }
    } else if (this.operator === '*') {
      if (this.nextPointArrayMulti.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber(this.nextPointArrayMulti);
      }
    } else if (this.operator === '/') {
      if (this.nextPointArrayDivision.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber(this.nextPointArrayDivision);
      }
    }
  }

  increaseArethmetikNumber(array: number[]) {
    this.min = this.min * array.length;
    this.max = this.max * array.length;
  }

  nextround() {
    this.result = null;
    this.operationIndex++
    this.randowResultsArray = [];
    this.InitOperation();
    this.createRandomResults();
  }

  finish() {
    this.playGame = false;
    this.startbutton = true;
    this.randowResultsArray = [];
    console.log(this.operator)
    this.cleararethmeticArrays();
    this.nextLevel();
  }

  nextLevel() {
    if (this.operator === '+') {
      this.nextPointArrayAddition.push(1);
      console.log(this.nextPointArrayAddition)
    }
    if (this.operator === '-') {
      this.nextPointArraySubtraction.push(1);
      console.log(this.nextPointArraySubtraction)
    }
    if (this.operator === '*') {
      this.nextPointArrayMulti.push(1);
      console.log(this.nextPointArrayMulti)
    }
    if (this.operator === '/') {
      this.nextPointArrayDivision.push(1);
      console.log(this.nextPointArrayDivision)
    }
    this.ngOnInit();
  }

  loose() {
    this.wrong = true;
    this.playGame = false;
    this.startbutton = true;
    this.cleararethmeticArrays()
    this.ngOnInit();
  }

  check(result: number) {
    if (this.operation == result) {
      this.nextround();
      if (this.operationIndex === 3) {
        this.finish();
      }
    } else {
      this.loose();
    }
  }
}
