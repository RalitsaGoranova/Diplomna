import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {AuthService} from "../../services/auth.service";
import {Envi} from "../envi";
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
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();

  }
}
