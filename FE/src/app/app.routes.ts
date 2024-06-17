import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {HomeComponent} from "./home/home.component";
import {LandingComponent} from "./landing/landing.component";
import {SearchComponent} from "./search/search.component";

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registration', component:RegistrationComponent},
    { path: 'landing', component: LandingComponent},
    { path: 'search', component: SearchComponent}
];
