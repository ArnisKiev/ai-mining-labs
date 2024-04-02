import { Injectable } from '@angular/core';
import { IFeature } from '../interfaces/feature';
import { get, isNil } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ClusterServiceService {
  constructor() { }



  getMaxObjectWithFeatures(necessaryFeatures: IFeature[], objects: any[]) {

    let maxSum = 0;
    let maxObject = null;
  
    for (const object of objects) {
      let objectSum = 0;
  
      for (const feature of necessaryFeatures) {
        
        const featureValue = get(object, feature.name);

        if ( !isNil(featureValue)) {
          objectSum += feature?.value;
        }
        
      }
  
      if (objectSum > maxSum) {
        maxSum = objectSum;
        maxObject = object;
      }
    }
  
    return maxObject;
  }
}
