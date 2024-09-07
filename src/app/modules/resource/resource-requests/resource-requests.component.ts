import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-resource-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './resource-requests.component.html',
  styleUrl: './resource-requests.component.css'
})
export class ResourceRequestsComponent implements OnInit {
  requests: any[] = [];

  constructor(private supabaseService: SupabaseService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  async loadRequests() {
    const userId = this.authService.currentUser.id;
    try {
      this.requests = await this.supabaseService.getRequestsByUserId(userId);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  }

  // Add methods for chat functionalities, accepting deals, etc.
}