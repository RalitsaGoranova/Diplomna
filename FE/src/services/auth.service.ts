import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthRequest, AuthRequestReg} from '../dto/auth.dto.model';
import {Observable} from "rxjs";
import {TravelDTO} from "../dto/travel.dto.model";
import {Router} from "@angular/router";
import {TravelDTOByMe} from "../dto/travelByMe.dto.model";
import {OfferDTO} from "../dto/offer.dto.model";
import {OfferPassengerDto} from "../dto/offerPassenger.dto.model";
import {Envi} from "../app/envi";

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(
        private readonly http: HttpClient,
        private router: Router
    ) {
    }

    login(request: AuthRequest): Observable<string> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post('api/users/login', request, { headers, responseType: 'text' });
    }


    register(request: AuthRequestReg): Observable<string> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        console.log(request);
        return this.http.post('api/users/register', request, { headers, responseType: 'text' });
    }

    getUserById(id: number): Observable<AuthRequestReg> {
        return this.http.get<AuthRequestReg>(`api/users/${id}`);
    }
    getUserByUsername(username: string): Observable<AuthRequestReg> {
        return this.http.get<AuthRequestReg >(`api/users/username/${username}`);
    }
    sendOffer(travelId: number, offer: { note: string }): Observable<any> {
        return this.http.post(`api/travel/offer/${travelId}`, offer);
    }


    async logout(navigate = true) {
        localStorage.removeItem('token');
    }

    submitTravel(travel: TravelDTO): Observable<string> {
        console.log('Sending data to API:', travel);
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<string>('api/travel/submit', travel, { headers });
    }

    getAllTravels(): Observable<TravelDTO[]> {
        return this.http.get<TravelDTO[]>(`api/travel/getAll`);
    }

    getTravelsByUsername(username: string): Observable<TravelDTO[]> {
        return this.http.get<TravelDTO[]>(`api/travel/createdbyme/${username}`);
    }


    acceptOffer(travelId: number, offerId: number): Observable<any> {
        return this.http.get(`api/travel/${travelId}/offer/${offerId}/accept`);
    }

    declineOffer(travelId: number, offerId: number): Observable<any> {
        return this.http.get(`api/travel/${travelId}/offer/${offerId}/decline`);
    }

    getOffersForTravel(travelId: number | undefined): Observable<OfferDTO[]> {
        return this.http.get<OfferDTO[]>(`api/travel/${travelId}`);
    }


    getTravelsAsPassenger(): Observable<OfferPassengerDto[]> {
        return this.http.get<OfferPassengerDto[]>(`api/travel/travelsPassenger`);
    }

    getUser(): Observable<string> {
        return this.http.get('api/travel/getUser', { responseType: 'text' });
    }

    hasUserSubmittedOffer(travelId: number | undefined): Observable<boolean> {
        return this.http.get<boolean>(`api/travel/${travelId}/offers/user`);
    }


}