import { Component, AfterViewInit, ViewChildren, OnInit } from '@angular/core';
import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChildren('cell') tds;

  readonly WIDTH = 100;
  readonly HEIGHT = 50;

  timeout: any;

  cells: any;

  speed = 500;
  state = 'Pause';

  antPos = {x: this.WIDTH / 2, y: this.HEIGHT / 2};
  direction = {x: 0, y: 0};

  cellStates = [];

  steps = 1;

  ngOnInit() {
    this.cellStates = new Array(this.WIDTH * this.HEIGHT).fill(0);
  }

  ngAfterViewInit() {
    this.cells = this.tds.map(e => e.nativeElement);
  }

  getArray(size) {
    return new Array(size).fill(0).map((item, idx) => idx);
  }

  getCellState(x, y) {
    return this.cellStates[y * this.WIDTH + x];
  }

  setCellState({x, y}, state) {
    this.cellStates[y * this.WIDTH + x] = state;
  }

  mark(event, x, y) {
    this.setCellState({x, y}, Number(!this.getCellState(x, y)));
  }

  next() {
    for (let i = 0; i < this.steps && this.state !== 'Paused'; i++) {
      if (this.getCellState(this.antPos.x, this.antPos.y) === 0) {
        if ((this.direction.x === 0 && this.direction.y === 0) ||
            (this.direction.x === 0 && this.direction.y === 1)) {
          this.direction = {x: -1, y: 0};
        } else if (this.direction.x === -1 && this.direction.y === 0) {
          this.direction = {x: 0, y: -1};
        } else if (this.direction.x === 0 && this.direction.y === -1) {
          this.direction = {x: 1, y: 0};
        } else if (this.direction.x === 1 && this.direction.y === 0) {
          this.direction = {x: 0, y: 1};
        }
      } else {
        if ((this.direction.x === 0 && this.direction.y === 0) ||
            (this.direction.x === 0 && this.direction.y === 1)) {
          this.direction = {x: 1, y: 0};
        } else if (this.direction.x === -1 && this.direction.y === 0) {
          this.direction = {x: 0, y: 1};
        } else if (this.direction.x === 0 && this.direction.y === -1) {
          this.direction = {x: -1, y: 0};
        } else if (this.direction.x === 1 && this.direction.y === 0) {
          this.direction = {x: 0, y: -1};
        }
      }

      this.setCellState(this.antPos, Number(!this.getCellState(this.antPos.x, this.antPos.y)));

      this.antPos.x += this.direction.x;
      this.antPos.y += this.direction.y;

      if (this.antPos.x < 0 || this.antPos.y < 0 ||
          this.antPos.x > this.WIDTH - 1 || this.antPos.y > this.HEIGHT - 1) {
        this.state = 'Pause';
      }
    }
  }

  getCell({x, y}) {
    return this.cells[y * this.WIDTH + x];
  }

  autoplay() {
    this.next();

    if (this.state === 'Play') {
      // old school
      // this.timeout = setTimeout(this.autoplay.bind(this), this.speed);
      this.timeout = setTimeout(_ => this.autoplay(), this.speed);
    }
  }

  playPause() {
    this.state = this.state === 'Play' ? 'Pause' : 'Play';

    if (this.state === 'Play') {
      this.autoplay();
    } else {
      clearTimeout(this.timeout);
    }
  }

  clear() {
    this.cellStates = new Array(this.WIDTH * this.HEIGHT).fill(0);
    this.antPos = {x: this.WIDTH / 2, y: this.HEIGHT / 2};

    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].classList.remove('marked');
    }

    if (this.state === 'Play') {
      this.playPause();
    }
  }

  onChangeSpeed($event) {
    this.speed = 1000 / $event.currentTarget.value;

    clearTimeout(this.timeout);

    this.autoplay();
  }

  get otherState() {
    return this.state === 'Play' ? 'Pause' : 'Play';
  }
}
