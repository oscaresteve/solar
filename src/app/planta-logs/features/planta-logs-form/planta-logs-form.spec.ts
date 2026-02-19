import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaLogsForm } from './planta-logs-form';

describe('PlantaLogsForm', () => {
  let component: PlantaLogsForm;
  let fixture: ComponentFixture<PlantaLogsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaLogsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaLogsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
