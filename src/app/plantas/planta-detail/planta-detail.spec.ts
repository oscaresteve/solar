import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaDetail } from './planta-detail';

describe('PlantaDetail', () => {
  let component: PlantaDetail;
  let fixture: ComponentFixture<PlantaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
