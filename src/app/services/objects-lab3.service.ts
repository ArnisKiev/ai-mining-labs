import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectsLab3Service {

  private _clusteredObjects$$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  clusteredObjects$: Observable<any[]> = this._clusteredObjects$$;

  constructor() { }

  updateObjects(objects: any[]) {
    this._clusteredObjects$$.next(objects);
  }

}
