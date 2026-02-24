import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSkeleton } from './card-skeleton';

describe('CardSkeleton', () => {
  let component: CardSkeleton;
  let fixture: ComponentFixture<CardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
