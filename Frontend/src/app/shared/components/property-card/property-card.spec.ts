import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCard } from './property-card';

describe('PropertyCard', () => {
  let component: PropertyCard;
  let fixture: ComponentFixture<PropertyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyCard);
    component = fixture.componentInstance;
    component.property = { id: 1, title: 'Test', imageUrl: '', rating: 4, reviewsCount: 0 } as any;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
