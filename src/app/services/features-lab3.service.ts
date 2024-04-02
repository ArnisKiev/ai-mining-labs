import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { IFeature } from '../interfaces/feature';

@Injectable({
  providedIn: 'root'
})
export class FeaturesLab3Service {
  private readonly MAX_TYPE_VALUE = 0.5;

  private _commonFeatures$$: BehaviorSubject<IFeature[]> = new BehaviorSubject<IFeature[]>([]);
  commonFeatures$: Observable<IFeature[]> = this._commonFeatures$$;

  private _specificFeatures$$: BehaviorSubject<IFeature[]> = new BehaviorSubject<IFeature[]>([]);
  specificFeatures$: Observable<IFeature[]> = this._specificFeatures$$;

  allFeatures$: Observable<IFeature[]> = combineLatest([
    this._commonFeatures$$,
    this._specificFeatures$$
  ]).pipe((map(([common, specific]) => common.concat(specific))));

  get allFeatures() {
    return this._commonFeatures$$.value.concat(this._specificFeatures$$.value);
  }

  constructor() { }

  updateCommonFeatures(features: string[]) {
    const newFeatures =  this.getFeaturesFromStringArray(features);
    this._commonFeatures$$.next(newFeatures);
  }

  updateSpecificFeatures(features: string[]) {
    const newFeatures =  this.getFeaturesFromStringArray(features); 
    this._specificFeatures$$.next(newFeatures);
  }


  private getFeaturesFromStringArray(features: string[]): IFeature[] {
    const featureValue = this.MAX_TYPE_VALUE / features.length;

    return features.map(feature => {
      return {
        name: feature,
        value: featureValue
      }
    }) as IFeature[];
  }
  

}
