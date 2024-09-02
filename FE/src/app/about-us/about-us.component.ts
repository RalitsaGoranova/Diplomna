import { Component } from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    TopBarComponent
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {

}
