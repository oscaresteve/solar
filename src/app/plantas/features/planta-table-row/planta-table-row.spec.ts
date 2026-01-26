import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaTableRow } from './planta-table-row';

describe('PlantaTableRow', () => {
  let component: PlantaTableRow;
  let fixture: ComponentFixture<PlantaTableRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaTableRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaTableRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
