import { Component, Inject } from '@angular/core';
import { CsvParserService } from '../../services/csv-parser.service';
import { FeaturesLab3Service } from '../../services/features-lab3.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ObjectsLab3Service } from '../../services/objects-lab3.service';
import { Observable, Subject, delay, map, shareReplay, switchMap } from 'rxjs';
import { IFeature } from '../../interfaces/feature';
import { ClusterServiceService } from '../../services/cluster-service.service';

@Component({
  selector: 'app-lab3',
  standalone: true,
  imports: [ AsyncPipe, ReactiveFormsModule, JsonPipe],
  templateUrl: './lab3.component.html',
  styleUrl: './lab3.component.scss'
})
export class Lab3Component {


  private readonly COMMON_FETURE_NAME_CONRTOL = 'featureControl_';

  form: FormGroup = new FormGroup({
    countSpecificFeatures: new FormControl(0),
    countCommonFeatures: new FormControl(0)
  });

  private _featureFileName$$: Subject<string> = new Subject<string>();
  featureFileName$: Observable<string> = this._featureFileName$$;

  private _objectsFileName$$: Subject<string> = new Subject<string>();
  objectsFileName$: Observable<string> = this._objectsFileName$$;

  getMaxObject$$: Subject<void> = new Subject<void>();

  commonControls$: Observable<string[]> = this.form.get('countCommonFeatures').valueChanges.pipe(
    map(count => {
      const commonControlNames: string[] = [];
      const commonControlName = this.COMMON_FETURE_NAME_CONRTOL + 'Common';
      const controls = Object.keys(this.form.controls).filter(control => control.includes(commonControlName));
      controls.forEach(control => this.form.removeControl(control));

      for (let i = 0; i < count; i++) {
        const newControlName = commonControlName + '_' + i;
        this.form.addControl(newControlName, new FormControl());
        commonControlNames.push(newControlName); 
      }

      return commonControlNames;
    })
  )

  specificControls$: Observable<string[]> = this.form.get('countSpecificFeatures').valueChanges.pipe(
    map(count => {
      const commonControlNames: string[] = [];
      const commonControlName = this.COMMON_FETURE_NAME_CONRTOL + 'Specific';
      const controls = Object.keys(this.form.controls).filter(control => control.includes(commonControlName));
      controls.forEach(control => this.form.removeControl(control));

      for (let i = 0; i < count; i++) {
        const newControlName = commonControlName + '_' + i;
        this.form.addControl(newControlName, new FormControl());
        commonControlNames.push(newControlName); 
      }

      return commonControlNames;
    })
  )


 

 
  maxObject$: Observable<any> = this.getMaxObject$$.pipe(
    switchMap(() => this.objectsLab3Service.clusteredObjects$.pipe(map(objects => {

      const selectedFeatures = this.getSelectedFeatures();

      return this.clusterService.getMaxObjectWithFeatures(selectedFeatures, objects);

    }))),
    shareReplay(1)
  )

  getSelectedFeatures(): IFeature[] {
    const featuresKeys = Object.keys(this.form.controls).filter(controlName => controlName.includes(this.COMMON_FETURE_NAME_CONRTOL));

    return featuresKeys.map(key => {
      const featureName = this.form.get(key).value;
      return this.featureService.allFeatures.find(x => x.name === featureName);
    })
  }


  constructor(
    private _csvParserService: CsvParserService,
    public featureService: FeaturesLab3Service,
    public objectsLab3Service: ObjectsLab3Service,
    private clusterService: ClusterServiceService
    ) {
    
  }

  async onLoadFeatures(file: any) {
   const commanFeature = await this._csvParserService.getCommonFeatures(file.target.files[0]);
   const specificFeature = await this._csvParserService.getSpecificFeatures(file.target.files[0]);

   this._featureFileName$$.next(file.target.files[0]?.name)

   this.featureService.updateCommonFeatures(commanFeature);
   this.featureService.updateSpecificFeatures(specificFeature);
  }

  async onLoadObjects(file: any) {
    const objects: any[] = await this._csvParserService.getObjects(file.target.files[0]); 
    this.objectsLab3Service.updateObjects(objects);

    this._objectsFileName$$.next(file.target.files[0]?.name)
  }

  onGetClick() {
    this.getMaxObject$$.next();
  }

}
