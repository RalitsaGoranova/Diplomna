import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HttpClientModule, HttpClient} from "@angular/common/http";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {AuthRequest, AuthRequestReg} from "../../dto/auth.dto.model";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, HttpClientModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers:[
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: { duration: 3000 }
        }
    ]
})
export class LoginComponent {
    username: string = '';
    password: string = '';

    constructor(
        private readonly authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    login() {
        const authRequest: AuthRequest = {
            username: this.username,
            password: this.password
        };

        this.authService.login(authRequest).subscribe({
            next: (token) => {
                localStorage.setItem('token', token);
                this.router.navigate(['/landing']);
            },
            error: (error) => {
                console.error('Login failed', error);
                this.snackBar.open('Wrong username or password', 'Close', {
                });
            }
        });
    }
}
