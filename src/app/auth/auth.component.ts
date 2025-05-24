import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  // constructor(private authService: AuthService) {}

  signUpWithGoogle() {
    // this.authService.googleSignIn();
  }
}
