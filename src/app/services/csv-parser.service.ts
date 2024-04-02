import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { isEmpty, set } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {


  private readonly GENERAL_FEATURES_TITLE = 'СПІЛЬНІ ОЗНАКИ (50%)';
  private readonly SPECIFIC_FEATURES_TITLE = 'СПЕЦИФІЧНІ ОЗНАКИ (50%)';

  constructor() { }

  getCommonFeatures(file: any): Promise<string[]> {

   return new Promise((resolve) => {

    const commonFeatures: string[] = [];
    let stopReadingCommonFeatures = false; 
    const isStringNumber = (str: string) => /^[0-9]+(\.)?$/.test(str);
    

    Papa.parse(file, {
      dynamicTyping: true,
      step: (results: Papa.ParseStepResult<string[]>) => {
        const hasRowSpecificTitle = results?.data?.some(data => 
          data?.toString()?.toUpperCase() === this.SPECIFIC_FEATURES_TITLE.toUpperCase());

        if (hasRowSpecificTitle) {
          stopReadingCommonFeatures = true;
        }
        
        const hasRowFeatures = results?.data?.some(data => isStringNumber(data?.toString()));

        if (!stopReadingCommonFeatures && hasRowFeatures) {
          const feature = results.data[1];

          if (!isEmpty(feature)) {
            commonFeatures.push(feature);
          }
        }
      },
      complete: () => {
        resolve(commonFeatures);
      },
      error: (err) => {
      }
      
    })
    });

  }

  getSpecificFeatures(file: any): Promise<string[]> {
    return new Promise((resolve) => {
 
     const commonFeatures: string[] = [];
     let startReadingFetures = false; 
     const isStringNumber = (str: string) => /^[0-9]+(\.)?$/.test(str);
    
     Papa.parse(file, {
       dynamicTyping: true,
       step: (results: Papa.ParseStepResult<string[]>) => {
         const hasRowSpecificTitle = results?.data?.some(data => 
           data?.toString()?.toUpperCase() === this.SPECIFIC_FEATURES_TITLE.toUpperCase());
 
         if (hasRowSpecificTitle) {
          startReadingFetures = true;
         }
         
         const hasRowFeatures = results?.data?.some(data => isStringNumber(data?.toString()));
 
         if (startReadingFetures && hasRowFeatures) {
           const feature = results.data[1];
 
           if (!isEmpty(feature)) {
             commonFeatures.push(feature);
           }
         }
       },
       complete: () => {
         resolve(commonFeatures);
       },
       error: (err) => {
       }
       
     })
     });
 
   }

  getObjects(file: any): Promise<any[]> {
    return new Promise((resolve) => {
      const objects: any[] = [];
      let tmpObject = {};

      Papa.parse(file, {
        dynamicTyping: true,
        step: (results: Papa.ParseStepResult<string[]>) => {
          if (results?.data?.some(data => !data) && !isEmpty(tmpObject)) {
            objects.push(tmpObject);
            tmpObject = {};
            set(tmpObject, 'objectName', results.data[0]);
          } else if (results?.data?.some(data => !data)) {
            set(tmpObject, 'objectName', results.data[0]);
          } else {
            const key = results.data[0];
            const value = results.data[1];

            set(tmpObject, key, value);
          }
        },
        complete: () => {
          if (!isEmpty(tmpObject)) {
            objects.push(tmpObject);
          }

          resolve(objects);
        },
        error: (err) => {
        }
      })
    });
  }
}
