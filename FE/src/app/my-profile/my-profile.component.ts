import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {AuthService} from "../../services/auth.service";
import {CommonModule, isPlatformBrowser} from "@angular/common";
import {TravelDTO} from "../../dto/travel.dto.model";
import {TravelDTOByMe} from "../../dto/travelByMe.dto.model";
import {jwtDecode} from "jwt-decode";
import {map} from "rxjs";
import {OfferDTO} from "../../dto/offer.dto.model";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {OfferPassengerDto} from "../../dto/offerPassenger.dto.model";

@Component({
    selector: 'app-my-profile',
    standalone: true,
    imports: [TopBarComponent, CommonModule, MatButton, MatTooltip, MatIcon, MatFabButton],
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  userProfile: any;
  travelsCreatedByMe: TravelDTO[] = [];
  travelsAsPassenger: OfferPassengerDto[] = [];
  offersByTravelId: { [key: number]: OfferDTO[] } = {};
  constructor(private userService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            console.log('Running in the browser environment');
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken: any = jwtDecode(token);
                    const username = decodedToken.sub;

                    this.userService.getUserByUsername(username).subscribe(
                        (data) => {
                            this.userProfile = data;
                            this.loadTravels(username);
                        },
                        (error) => console.error('Error fetching user profile', error)
                    );
                } catch (err) {
                    console.error('Error decoding token:', err);
                }
            } else {
                console.error('No token found');
            }
        } else {
            console.warn('Not running in the browser; localStorage is not available.');
        }
    }

    private loadTravels(username: string): void {
        this.userService.getTravelsByUsername(username)
            .subscribe(data => {
                console.log('Travels loaded:', data);
                this.travelsCreatedByMe = data;
                this.loadOffersForTravels()
                this.loadTravelsPassenger()
                data.forEach(travel => console.log(travel.id));
            }, err => console.error('Error fetching travels:', err));
        console.log('test', this.travelsCreatedByMe)

    }

    private loadTravelsPassenger():void{
this.userService.getTravelsAsPassenger().subscribe(
    data=>{
        this.travelsAsPassenger=data;
        console.log(this.travelsAsPassenger);
    }
)
}



    private loadOffersForTravels(): void {
        this.travelsCreatedByMe.forEach(travel => {
                this.userService.getOffersForTravel(travel.id).subscribe({
                    next: (offers: any[]) => {
                        console.log(offers);
                        this.offersByTravelId[travel.id!] = offers;
                        console.log(this.offersByTravelId)// Populate the dictionary
                    },
                    error: (err) => console.error(`Error fetching offers for travel ${travel.id}:`, err)
                });
        });
    }

    acceptOffer(travelId: number, offerId: number): void {
        this.userService.acceptOffer(travelId, offerId).subscribe({
            next: () => {
                console.log(`Offer ${offerId} for travel ${travelId} accepted`);
                this.loadOffersForTravels();
            }
        });
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    }

    declineOffer(travelId: number, offerId: number): void {
        this.userService.declineOffer(travelId, offerId).subscribe({
            next: () => {
                console.log(`Offer ${offerId} for travel ${travelId} declined`);
                window.location.reload();
                this.loadOffersForTravels(); // Reload offers
            },
            error: (err) => console.error(`Error declining offer ${offerId} for travel ${travelId}:`, err)
        });
        window.location.reload();
    }
}
