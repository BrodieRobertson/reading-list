import { TestBed } from '@angular/core/testing';

import { IllustratorService } from './illustrator.service';

describe('IllustratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IllustratorService = TestBed.get(IllustratorService);
    expect(service).toBeTruthy();
  });
});
