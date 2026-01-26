import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaTable } from './planta-table';

describe('PlantaTable', () => {
  let component: PlantaTable;
  let fixture: ComponentFixture<PlantaTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
