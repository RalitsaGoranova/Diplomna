import { Component } from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";

@Component({
  selector: 'app-search',
  standalone: true,
    imports: [
        TopBarComponent
    ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

}
