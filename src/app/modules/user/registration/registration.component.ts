import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule]
})
export class RegistrationComponent {
  email = '';
  password = '';
  confirmPassword = '';
  name = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async signup() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    try {
      await this.authService.signup(this.email, this.password, this.name);
      alert('Account Created, Verify Email and Login')
      // Handle successful signup (e.g., redirect to login)
      this.router.navigate(['/user/login']);
    } catch (error: any) {
      this.error = error.message;
    }
  }
}