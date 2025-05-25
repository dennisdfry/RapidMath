import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
  MatTooltipModule,
} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
type Operator = '+' | '-' | '*' | '/';

@Component({
  selector: 'app-mathematics',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatTooltipModule, MatInputModule, RouterModule],
  templateUrl: './mathematics.component.html',
  styleUrl: './mathematics.component.scss'
})
export class MathematicsComponent {
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
  operation: number = 0;
  operator: Operator = '+';
  arrayName: string = '';
  exchangeResult: number = 0;
  division: boolean = false;
  showLevelBooleanAddition: boolean = false;
  showLevelBooleanSubtraction: boolean = false;
  showLevelBooleanMulti: boolean = false;
  showLevelBooleanDivision: boolean = false;
  barWidth = 100;
  startCountDown: number = 0;
  countDownInterval: any;
    levelSettings: Record<Operator, { min: number; max: number }> = {
    '+': { min: 1, max: 11 },
    '-': { min: 1, max: 11 },
    '*': { min: 1, max: 11 },
    '/': { min: 1, max: 11 },
  };

  constructor() { };

  InitOperator() {
    for (let index = 1; index < 11; index++) {
      if (this.operator === '/') {
        console.log('erkannt');
        this.operatorTwo = this.mathRandomizer();
        while (this.operatorTwo === 0) {
          this.operatorTwo = this.mathRandomizer();
        }
        const multiplier = this.mathRandomizer();
        this.operatorOne = this.operatorTwo * multiplier;

      } else {
        this.operatorOne = this.mathRandomizer();
        this.operatorTwo = this.mathRandomizer();
      }
      this.fillOperationArray();
    }
  }

  InitOperation() {
    const num1 = this.arethmeticNumberOne[this.operationIndex];
    const num2 = this.arethmeticNumberTwo[this.operationIndex];

    switch (this.operator) {
      case '+':
        this.operation = num1 + num2;
        break;
      case '-':
        this.operation = num1 - num2;
        break;
      case '*':
        this.operation = num1 * num2;
        break;
      case '/':
        this.operation = Math.floor(num1 / num2); // Ganzzahlige Division
        break;
      default:
        throw new Error('Ungültiger Operator');
    }

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

  async startGame(operatorHtml: Operator) {
    this.min = this.levelSettings[this.operator].min;
    this.max = this.levelSettings[this.operator].max;
    this.operator = operatorHtml;
    console.log(this.operator);
    await this.checkOperator();
    this.InitOperator();
    this.startbutton = false;
    this.operationIndex = 0;
    this.InitOperation();
    this.createRandomResults();
    this.playGame = true;
    this.startCountdownBar(30);
    console.log(this.nextPointArrayAddition)
    console.log(this.nextPointArrayMulti)
    console.log(this.nextPointArraySubtraction)
    console.log(this.nextPointArrayDivision)
  }

  startCountdownBar(seconds: number) {
    this.startCountDown = Date.now();
    this.countDownInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startCountDown) / 1000);
      const remaining = Math.max(0, seconds - elapsed);
      this.barWidth = (remaining / seconds) * 100;
      if (remaining <= 0) {
        clearInterval(this.countDownInterval);
        this.resetCountdownVariables();
      }
    }, 1000);
  }

  resetCountdownVariables() {
    this.startCountDown = 0;
    this.countDownInterval = null;
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

  async checkOperator(): Promise<void> {
    if (this.operator === '+') {
      this.showLevelBooleanAddition = true;
      // this.min = this.min * this.nextPointArrayAddition.length;
      // this.max = this.max * this.nextPointArrayAddition.length;
      setTimeout(() => {
        this.showLevelBooleanAddition = false;
      }, 1200);
      if (this.nextPointArrayAddition.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber(this.nextPointArrayAddition);
      }
    } else if (this.operator === '-') {
      this.showLevelBooleanSubtraction = true;
      setTimeout(() => {
        this.showLevelBooleanSubtraction = false;
      }, 1200);
      if (this.nextPointArraySubtraction.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber(this.nextPointArraySubtraction);
      }
    } else if (this.operator === '*') {
      this.showLevelBooleanMulti = true;
      setTimeout(() => {
        this.showLevelBooleanMulti = false;
      }, 1200);
      if (this.nextPointArrayMulti.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber(this.nextPointArrayMulti);
      }
    } else if (this.operator === '/') {
      this.showLevelBooleanDivision = true;
      setTimeout(() => {
        this.showLevelBooleanDivision = false;
      }, 1200);
      if (this.nextPointArrayDivision.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber(this.nextPointArrayDivision);
      }
    }
  }

  increaseArethmetikNumber(array: number[]) {
    const level = array.length + 1;
    this.levelSettings[this.operator].min = 1 * level;
    this.levelSettings[this.operator].max = 11 * level;
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
  }

  loose() {
    this.wrong = true;
    this.playGame = false;
    this.startbutton = true;
    this.randowResultsArray = [];
    this.cleararethmeticArrays();
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
