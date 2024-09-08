import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule]
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {} 

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      // Handle successful login (e.g., redirect to dashboard)
      this.router.navigate(['/user/dashboard']);
    } catch (error: any) {
      this.error = error.message; 
    }
  }
}