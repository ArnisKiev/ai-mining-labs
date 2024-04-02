import { TestBed } from '@angular/core/testing';

import { FeaturesLab3Service } from './features-lab3.service';

describe('FeaturesLab3Service', () => {
  let service: FeaturesLab3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturesLab3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
