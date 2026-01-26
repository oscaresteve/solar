import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaItem } from './planta-item';

describe('PlantaItem', () => {
  let component: PlantaItem;
  let fixture: ComponentFixture<PlantaItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
