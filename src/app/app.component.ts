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
  randowResultsArray:number [] = [];
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

  startGame(operatorHtml: string) {
    this.playGame = true;
    this.startbutton = false;
    this.operationIndex = 0;
    this.operator = operatorHtml;
    this.checkOperator();
    this.operation = eval(`${this.arethmeticNumberOne[this.operationIndex]} ${this.operator} ${this.arethmeticNumberTwo[this.operationIndex]}`);
    this.createRandomResults();
  }

  createRandomResults(){
    for (let index = 0; index < 3; index++) {
     this.randowResultsArray.push(this.mathRandomizer())
      console.log(this.randowResultsArray);
      
    }
  }

  checkOperator(){
    if (this.operator === '+') {
      console.log(this.nextPointArrayAddition)
    }else if (this.operator === '-') {
      console.log(this.nextPointArraySubtraction)
    }else  if (this.operator === '*') {
      console.log(this.nextPointArrayMulti)
    } else if (this.operator === '/') {
      console.log(this.nextPointArrayDivision)
    }
  }

  nextround() {
    this.result = null;
    this.operationIndex++
  }

  finish() {
    this.playGame = false;
    this.startbutton = true;
    console.log(this.operator)
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
  }

  check() {
    if (this.operation == this.result) {
      this.nextround();
      if (this.operationIndex === 2) {
        this.finish();
      }
    } else {
      this.loose();
    }
  }
}
