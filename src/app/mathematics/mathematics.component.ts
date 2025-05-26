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

  levelBoundaries: Record<number, { min: number; max: number }> = {
  1: { min: 1, max: 11 },
  2: { min: 1, max: 50 },
  3: { min: 1, max: 100 },
  4: { min: 1, max: 200 },
  5: { min: 1, max: 300 },
  6: { min: 1, max: 400 },
  7: { min: 1, max: 500 },
  8: { min: 1, max: 600 },
  9: { min: 1, max: 800 },
  10: { min: 1, max: 1000 },
};

currentLevels: Record<Operator, number> = {
  '+': 1,
  '-': 1,
  '*': 1,
  '/': 1,
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

  // async startGame(operatorHtml: Operator) {
  //   this.min = this.levelSettings[this.operator].min;
  //   this.max = this.levelSettings[this.operator].max;
  //   console.log(this.min);
  //       console.log(this.max);
    

  //   this.operator = operatorHtml;
  //   console.log(this.operator);
  //   await this.checkOperator();
  //   this.InitOperator();
  //   this.startbutton = false;
  //   this.operationIndex = 0;
  //   this.InitOperation();
  //   this.createRandomResults();
  //   this.playGame = true;
  //   this.startCountdownBar(30);
  //   console.log(this.nextPointArrayAddition)
  //   console.log(this.nextPointArrayMulti)
  //   console.log(this.nextPointArraySubtraction)
  //   console.log(this.nextPointArrayDivision)
  // }

  async startGame(operatorHtml: Operator) {
  this.operator = operatorHtml;

  const currentLevel = this.currentLevels[this.operator];
  const bounds = this.levelBoundaries[currentLevel];
  this.min = bounds.min;
  this.max = bounds.max;

  await this.checkOperator();
  this.InitOperator();
  this.startbutton = false;
  this.operationIndex = 0;
  this.InitOperation();
  this.createRandomResults();
  this.playGame = true;
  this.startCountdownBar(30);
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


  // createRandomResults() {
  //   while (this.randowResultsArray.length < 4) {
  //     const result = this.mathRandomizer();
  //     if (!this.randowResultsArray.includes(result)) {
  //       this.randowResultsArray.push(result);
  //     }
  //   }
  //   console.log(this.randowResultsArray);
  //   this.shuffleArray()
  // }

  createRandomResults() {
  const correctResult = this.operation;
  const variations = new Set<number>();
  variations.add(correctResult);

  let attempts = 0;
  while (variations.size < 4 && attempts < 100) {
    const variation = this.generateNearbyResult(correctResult);
    if (!variations.has(variation)) {
      variations.add(variation);
    }
    attempts++;
  }

  // Fallback, falls es nicht genug Variationen gibt
  while (variations.size < 4) {
    variations.add(this.mathRandomizer());
  }

  this.randowResultsArray = Array.from(variations);
  this.shuffleArray();
}

generateNearbyResult(correctResult: number): number {
  const base = Math.abs(correctResult);
  const variationRange = Math.max(3, Math.floor(base * 0.2)); // min. ±3
  const offset = Math.floor(Math.random() * (variationRange * 2 + 1)) - variationRange;
  let result = correctResult + offset;

  if (result < 0) result = Math.abs(result) + 1; // vermeide negative Zahlen
  return result;
}


  shuffleArray() {
    for (let i = this.randowResultsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.randowResultsArray[i], this.randowResultsArray[j]] = [this.randowResultsArray[j], this.randowResultsArray[i]];
    }
  }

  async checkOperator(): Promise<void> {
    if (this.operator === '+') {
      console.log(this.nextPointArrayAddition.length)
      this.showLevelBooleanAddition = true;
      setTimeout(() => {
        this.showLevelBooleanAddition = false;
      }, 1200);
      if (this.nextPointArrayAddition.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber('+');
      }
    } else if (this.operator === '-') {
      this.showLevelBooleanSubtraction = true;
      setTimeout(() => {
        this.showLevelBooleanSubtraction = false;
      }, 1200);
      if (this.nextPointArraySubtraction.length < 1) {
        return;
      } else {
       this.increaseArethmetikNumber('-');
      }
    } else if (this.operator === '*') {
      this.showLevelBooleanMulti = true;
      setTimeout(() => {
        this.showLevelBooleanMulti = false;
      }, 1200);
      if (this.nextPointArrayMulti.length < 1) {
        return;
      } else {
        this.increaseArethmetikNumber('*');
      }
    } else if (this.operator === '/') {
      this.showLevelBooleanDivision = true;
      setTimeout(() => {
        this.showLevelBooleanDivision = false;
      }, 1200);
      if (this.nextPointArrayDivision.length < 1) {
        return;
      } else {
       this.increaseArethmetikNumber('/');
      }
    }
  }

  increaseArethmetikNumber(operator: Operator) {
  const level = Math.min(this.currentLevels[operator] + 1, 10);
  this.currentLevels[operator] = level; // level erhöhen
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
