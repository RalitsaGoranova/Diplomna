import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthRequest, AuthRequestReg} from '../dto/auth.dto.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private readonly http: HttpClient
    ) {
    }

    login(request: AuthRequest) {
        return this.http.post<string>('api/users/login', request);
    }

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