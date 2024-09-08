import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-resources',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './manage-resources.component.html',
  styleUrl: './manage-resources.component.css'
})
export class ManageResourcesComponent implements OnInit {
  resources: any[] = [];

  constructor(private supabaseService: SupabaseService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadResources();
  }
  async loadResources() {
    const userId = this.authService.currentUser.id;
    try {
      this.resources = await this.supabaseService.getResourcesByUserId(userId);
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  }

  async deleteResource(resourceId: string) {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await this.supabaseService.deleteResource(resourceId);
        this.loadResources(); // Reload the resources after deletion
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  }

  async updateAvailability(resourceId: string, status: boolean) {
    try {
      await this.supabaseService.updateResource(resourceId, { availability_status: status });
      this.loadResources(); // Reload the resources
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  }

}
