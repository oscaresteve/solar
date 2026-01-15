import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaList } from './planta-list';

describe('PlantaList', () => {
  let component: PlantaList;
  let fixture: ComponentFixture<PlantaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
