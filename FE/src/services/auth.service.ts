import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthRequest, AuthRequestReg} from '../dto/auth.dto.model';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private readonly http: HttpClient
    ) {
    }

    login(request: AuthRequest): Observable<string> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post('api/users/login', request, { headers, responseType: 'text' });
    }
    // login(request: AuthRequest) {
    //     return this.http.post<string>('api/users/login', request);
    // }

    register(request: AuthRequestReg) {
        return this.http.post<void>('api/users/register', request);
    }
    async logout(navigate = true) {
        localStorage.removeItem('token');
        if (navigate) {
        }
        location.reload();
    }
}