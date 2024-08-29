import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { AuthService } from '../services/auth.service';
import {environment} from "../enviroments/enviroments";
import {isPlatformBrowser} from "@angular/common";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private readonly authService: AuthService,
                @Inject(PLATFORM_ID) private platformId: Object) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        let headers = req.headers;

        // Check if the code is running in the browser
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            if (token) {
                headers = headers.set('Authorization', `Bearer ${token}`);
            }
        }

        const cloned = req.clone({
            url: `${environment.backendUrl}/${req.url}`,
            headers,
        });

        return next.handle(cloned).pipe(
            tap({
                error: async (error) => {
                    if (error.status === 401) {
                        await this.authService.logout(false);
                    }
                },
            }),
        );
    }
}