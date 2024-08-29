import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {CommonModule, formatDate} from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import {TopBarComponent} from "../top-bar/top-bar.component";
import {AuthService} from "../../services/auth.service";
import {TravelDTO} from "../../dto/travel.dto.model";
import {MatSelect} from "@angular/material/select";
import {MatDialog} from "@angular/material/dialog";
import {TravelOfferDialogComponent} from "../travel-offer-dialog/travel-offer-dialog.component";
import {Envi} from "../envi";
import {MatButton} from "@angular/material/button";

export class TownGroup {
  letter: string;
  towns: string[];

  constructor(letter: string, towns: string[]) {
    this.letter = letter;
    this.towns = towns;
  }
}


export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase(); // Convert input value to lowercase
  return opt.filter(item => item.toLowerCase().includes(filterValue)); // Filter options to include only those that contain the filterValue
};

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    CommonModule,
    RouterLink,
    TopBarComponent,
    MatSelect,
    MatButton
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  travels: TravelDTO[] = [];
  sortedTravels: TravelDTO[] = [];
  offerStatusMap: Map<number, boolean> = new Map<number, boolean>();

  constructor(private dialog: MatDialog, protected authService: AuthService) {}

  ngOnInit() {
    this.loadTravels();
  }

  openDialog(travelId: number): void {
    console.log()
    if (travelId) {
      this.authService.hasUserSubmittedOffer(travelId)
          .subscribe(hasSubmitted => {
            if (!hasSubmitted) {
              const dialogRef = this.dialog.open(TravelOfferDialogComponent, {
                width: '300px',
                data: { note: '' },
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.authService.sendOffer(travelId, { note: result }).subscribe({
                    next: response => console.log('Offer submitted successfully:', response),
                    error: err => console.error('Error submitting offer:', err)
                  });
                  window.location.reload(); // Reload to refresh component state (optional)
                }
              });
            } else {
              console.log('User has already submitted an offer for this travel.');
            }
          });
    } else {
      console.error('Travel ID is undefined or null');
    }
  }


  private loadTravels(): void {
    this.authService.getAllTravels().subscribe({
      next: (data) => {
        console.log('Travels loaded:', data);
        this.travels = data;
        this.sortedTravels = [...this.travels];

        // Check if the user has submitted an offer for each travel and store it in the map
        this.travels.forEach(travel => {
          this.authService.hasUserSubmittedOffer(travel.id).subscribe(hasSubmitted => {
            console.log(travel);
            console.log(hasSubmitted);
            if (travel.id != null) {
              this.offerStatusMap.set(travel.id, hasSubmitted);
              console.log(this.offerStatusMap)
            }
          });
        });
      },
      error: (err) => console.error('Error fetching travels:', err)
    });
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  onSortChange(sortOption: string): void {
    if (sortOption === 'newest') {
      this.sortedTravels = [...this.travels].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    } else if (sortOption === 'oldest') {
      this.sortedTravels = [...this.travels].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    } else {
      this.sortedTravels = [...this.travels];
    }
  }


  hasSubmittedOffer(travelId: number | undefined): boolean {
    return this.offerStatusMap.get(<number>travelId) || false;
  }
}