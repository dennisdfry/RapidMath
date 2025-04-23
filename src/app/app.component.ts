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
  constructor() { };


  ngOnInit(): void {
    this.checkOperator();
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

  cleararethmeticArrays() {
    this.arethmeticNumberOne = [];
    this.arethmeticNumberTwo = [];
  }

  mathRandomizer() {
    return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  }

  startGame(operatorHtml: string) {
    this.playGame = true;
    this.startbutton = false;
    this.operationIndex = 0;
    this.operator = operatorHtml;
    this.checkOperator();
    this.createRandomResults();
  }

  createRandomResults() {
    for (let index = 0; index < 3; index++) {
      this.randowResultsArray.push(this.mathRandomizer())
      console.log(this.randowResultsArray);

    }
  }

  checkOperator() {
    if (this.operator === '+') {
      if (this.nextPointArrayAddition.length < 1) {
        return
      } else {
        this.increaseArethmetikNumber();
      }
    } else if (this.operator === '-') {
      if (this.nextPointArraySubtraction.length < 1) {
        return
      } else {
        this.increaseArethmetikNumber();
      }
    } else if (this.operator === '*') {
      if (this.nextPointArrayMulti.length < 1) {
        return
      } else {
        this.increaseArethmetikNumber();
      }
    } else if (this.operator === '/') {
      if (this.nextPointArrayDivision.length < 1) {
        return
      } else {
        this.increaseArethmetikNumber();
      }
    }
  }

  increaseArethmetikNumber() {
    this.min = this.min * this.nextPointArrayAddition.length;
    this.max = this.max * this.nextPointArrayAddition.length;
  }

  nextround() {
    this.result = null;
    this.operationIndex++
  }

  finish() {
    this.playGame = false;
    this.startbutton = true;
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

  check() {
    this.operation = eval(`${this.arethmeticNumberOne[this.operationIndex]} ${this.operator} ${this.arethmeticNumberTwo[this.operationIndex]}`);
    if (this.operation == this.result) {
      this.nextround();
      if (this.operationIndex === 3) {
        this.finish();
      }
    } else {
      this.loose();
    }
  }
}
