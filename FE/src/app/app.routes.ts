import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {HomeComponent} from "./home/home.component";
import {LandingComponent} from "./landing/landing.component";
import {SearchComponent} from "./search/search.component";
import {CreateComponent} from "./create/create.component";
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {AboutUsComponent} from "./about-us/about-us.component";

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: 'landing', component: LandingComponent},
    {path: 'profile', component: MyProfileComponent},
    {path: 'aboutus', component: AboutUsComponent},
    {path: 'create', component: CreateComponent},
    {path: 'search', component: SearchComponent},
    {path: 'profile/:id', component: MyProfileComponent}
];
