import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaLogsList } from './planta-logs-list';

describe('PlantaLogsList', () => {
  let component: PlantaLogsList;
  let fixture: ComponentFixture<PlantaLogsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaLogsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaLogsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
