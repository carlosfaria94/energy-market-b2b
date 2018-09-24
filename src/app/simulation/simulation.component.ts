import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

export interface Entry {
  initialHour: number;
  finalHour: number;
  producer: string;
  quantity: number;
}

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {
  entries = [];
  displayedColumns = ['hour', 'producer', 'quantity'];
  dataSource = new MatTableDataSource<Entry>(this.entries);
  finalDisplayedColumns = ['producer', 'quantity'];
  finalDataSource = SUMMARY;
  stepRun = 0;
  initialHour = 0;
  finalHour = 1;

  constructor() {}

  ngOnInit() {}

  runSimulation() {
    switch (this.stepRun) {
      case 0:
        const first = [
          {
            initialHour: ('0' + this.initialHour).slice(-2),
            finalHour: ('0' + this.finalHour).slice(-2),
            producer: 'Solar Producer',
            quantity: 5
          },
          {
            initialHour: ('0' + this.initialHour).slice(-2),
            finalHour: ('0' + this.finalHour).slice(-2),
            producer: 'Wind Producer',
            quantity: 5
          },
          {
            initialHour: ('0' + this.initialHour).slice(-2),
            finalHour: ('0' + this.finalHour).slice(-2),
            producer: 'Other Producer',
            quantity: 0
          }
        ];
        this.entries.push(...first);
        this.dataSource = new MatTableDataSource<Entry>(this.entries);
        this.initialHour += 1;
        this.finalHour += 1;
        this.stepRun = 1;
        break;
      case 1:
        const second = [
          {
            initialHour: ('0' + this.initialHour).slice(-2),
            finalHour: ('0' + this.finalHour).slice(-2),
            producer: 'Solar Producer',
            quantity: 0
          },
          {
            initialHour: ('0' + this.initialHour).slice(-2),
            finalHour: ('0' + this.finalHour).slice(-2),
            producer: 'Wind Producer',
            quantity: 10
          },
          {
            initialHour: ('0' + this.initialHour).slice(-2),
            finalHour: ('0' + this.finalHour).slice(-2),
            producer: 'Other Producer',
            quantity: 15
          }
        ];
        this.entries.push(...second);
        this.dataSource = new MatTableDataSource<Entry>(this.entries);
        this.initialHour += 1;
        this.finalHour += 1;
        this.stepRun = 2;
        break;
      case 2:
        const third = [
          {
            initialHour: ('0' + this.initialHour).slice(-2),
            finalHour: ('0' + this.finalHour).slice(-2),
            producer: 'Solar Producer',
            quantity: 5
          },
          {
            initialHour: ('0' + this.initialHour).slice(-2),
            finalHour: ('0' + this.finalHour).slice(-2),
            producer: 'Wind Producer',
            quantity: 0
          },
          {
            initialHour: ('0' + this.initialHour).slice(-2),
            finalHour: ('0' + this.finalHour).slice(-2),
            producer: 'Other Producer',
            quantity: 5
          }
        ];
        this.entries.push(...third);
        this.dataSource = new MatTableDataSource<Entry>(this.entries);
        this.initialHour += 1;
        this.finalHour += 1;
        this.stepRun = 3;
        break;
      default:
        break;
    }
  }

  getRandomInteger(min, max) {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return rand;
  }
}

const SUMMARY: Entry[] = [
  {
    initialHour: 0,
    finalHour: 1,
    producer: 'Solar Producer',
    quantity: 10
  },
  {
    initialHour: 0,
    finalHour: 1,
    producer: 'Wind Producer',
    quantity: 15
  },
  {
    initialHour: 0,
    finalHour: 1,
    producer: 'Other Producer',
    quantity: 20
  }
];
