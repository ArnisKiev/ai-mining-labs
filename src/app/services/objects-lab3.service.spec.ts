import { TestBed } from '@angular/core/testing';

import { ObjectsLab3Service } from './objects-lab3.service';

describe('ObjectsLab3Service', () => {
  let service: ObjectsLab3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectsLab3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
