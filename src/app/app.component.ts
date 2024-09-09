import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from './core/auth/auth.service';
import { SupabaseService } from './core/services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit  {
  title = 'urbanroots2';
  private supabase: SupabaseClient = inject(SupabaseService).getSupabaseClient();
  private authService: AuthService = inject(AuthService);

  constructor(private router: Router) {}
  
  ngOnInit() {
    // Check the initial authentication state and set the currentUser
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('session', session);
      console.log('page', this.router.url );
      if (session) {
        this.authService.setCurrentUser(session.user); 
        if (session.user && this.router.url === '/') {
          this.router.navigate(['/user/dashboard']);
        } else {
          this.router.navigate(['/user/login']);
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
