import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbar
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {

}
