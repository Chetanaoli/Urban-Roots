import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../core/services/supabase.service';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
isMenuOpen: any;
private supabase: SupabaseClient = inject(SupabaseService).getSupabaseClient();
private authService: AuthService = inject(AuthService);

constructor(private router: Router) {}

getStarted() {
  this.supabase.auth.getSession().then(({ data: { session } }) => {
    console.log('session', session);
    console.log('page', this.router.url );
    
    if (session) {
      this.authService.setCurrentUser(session.user); 
      if (session.user ) {
        this.router.navigate(['/user/dashboard']);
      } else {
        this.router.navigate(['/user/login']);

      }
    }else {
      this.router.navigate(['/user/login']);
    }
  });
}

}
