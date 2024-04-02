import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, map, merge, shareReplay, startWith } from 'rxjs';

@Component({
  selector: 'app-lab1',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './lab1.component.html',
  styleUrl: './lab1.component.scss'
})
export class Lab1Component implements OnInit {

  form: FormGroup = new FormGroup({
    countElements: new FormControl(1, [Validators.min(1)]),
  });



  indexes$: Observable<number[]>;


  ngOnInit(): void {
    this.indexes$ = this.form.get('countElements').valueChanges.pipe(
      startWith(1),
      map((val) => {

        const indexes = [];
  
        const controls = Object.keys(this.form.controls).filter(x => x !== 'countElements');

        controls.forEach(control => this.form.removeControl(control));

      
  
        for (let i = 0; i < +val; i++) {
          const xName = 'x - ' + i;
          const nName = 'n - ' + i;
        
          this.form.addControl(xName, new FormControl());
          this.form.addControl(nName, new FormControl());

          indexes.push(i);
        }
  

        return indexes;
      })
    )
  }


  private _getResult$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  get controlsSize() {
    return (Object.keys(this.form.controls).length - 1) / 2;
  }

  xAvg$: Observable<number> = this._getResult$$.pipe(shareReplay(1), map(() => {
    
    let nSum = 0;
    let xnSum = 0;

    for (let i = 0; i < this.controlsSize; i++) {
      const xName = 'x - ' + i;
      const nName = 'n - ' + i;

      const xValue = +this.getControlValue(xName);
      const nValue = +this.getControlValue(nName);

      nSum += nValue;
      xnSum += nValue * xValue;
    }


    return +(xnSum/nSum).toFixed(2);
  })).pipe(shareReplay(1));

  standardDeviation$: Observable<number> = this.xAvg$
  .pipe(
    map(xAvg => {

      let nSum = 0;
      let xx2Sum = 0;

      for (let i = 0; i < this.controlsSize; i++) {
        const xName = 'x - ' + i;
        const nName = 'n - ' + i;
  
        const xValue = +this.getControlValue(xName);
        const nValue = +this.getControlValue(nName);
  
        nSum += nValue;
        xx2Sum += (xValue - xAvg)*(xValue - xAvg);
      }

      return +Math.sqrt(xx2Sum/nSum).toFixed(2);
    })
  ).pipe(shareReplay(1));

  D$:Observable<number> = this.standardDeviation$.pipe(map(val => val * val)).pipe(shareReplay(1));

  showResultPanel$: Observable<boolean> = merge(
    this._getResult$$.pipe(map(() => true)),
    this.form.valueChanges.pipe(map(() => false))
  ).pipe(shareReplay(1));

  private getControlValue(name: string) {
    return this.form.get(name).value;
  } 

  getResultCkicked() {
    this._getResult$$.next(true);
  }
}
