import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import { AuthRequestReg} from "../../dto/auth.dto.model";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule
    ],
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent  {
    user = {
        email: '',
        username: '',
        phoneNumber: '',
        password: ''
    };

    constructor(private authService: AuthService, private router: Router ) {

    }

    onSubmit() {
        const authRequestReg: AuthRequestReg = {
            email: this.user.email,
            username: this.user.username,
            phoneNumber: this.user.phoneNumber,
            password: this.user.password
        };

        this.authService.register(authRequestReg).subscribe({
            next: () => {
                console.log('User registered successfully');
                this.router.navigate(['/login']); // Navigate to login page
            },
            error: (error) => {
                console.error('Registration error:', error);
                // Handle registration error, e.g., show error message
            }
        });
    }

    // onSubmit() {
    //     // Handle form submission (e.g., send data to server or perform validation)
    //     console.log('User submitted:', this.user);
    //     // Implement your registration logic here
    // }
}
