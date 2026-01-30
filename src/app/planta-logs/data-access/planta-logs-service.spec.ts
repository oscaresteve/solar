import { TestBed } from '@angular/core/testing';

import { PlantaLogsService } from './planta-logs-service';

describe('PlantaLogsService', () => {
  let service: PlantaLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantaLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
