import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelOfferDialogComponent } from './travel-offer-dialog.component';

describe('TravelOfferDialogComponent', () => {
  let component: TravelOfferDialogComponent;
  let fixture: ComponentFixture<TravelOfferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelOfferDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelOfferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
