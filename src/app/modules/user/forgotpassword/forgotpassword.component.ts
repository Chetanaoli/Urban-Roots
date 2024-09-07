import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule]
})
export class ForgotpasswordComponent {
  email = '';
  error: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false; // To control loading state of the button

  constructor(private authService: AuthService) {}

  async resetPassword() {
    this.loading = true; 
    this.error = null;
    this.successMessage = null;

    try {
      await this.authService.sendPasswordResetEmail(this.email);
      this.successMessage = 'Password reset email sent!';
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}