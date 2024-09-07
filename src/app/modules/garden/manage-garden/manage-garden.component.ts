import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-manage-garden',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './manage-garden.component.html',
  styleUrl: './manage-garden.component.css'
})
export class ManageGardenComponent implements OnInit  {
  gardens: any[] = [];

  constructor(private supabaseService: SupabaseService, private router: Router, private auth: AuthService) {}
 
  ngOnInit(): void {
    this.loadGardens(); // Load the gardens on component initialization
  }

  async loadGardens() {
    try {
      const userId = this.auth.currentUser.id; // Replace this with the actual user ID logic

      this.gardens = await this.supabaseService.getGardensByUserId(userId);
    } catch (error) {
      console.error('Error loading gardens:', error);
    }
  }

  editGarden(gardenId: string) {
    // Redirect to the Upload Garden page with the garden ID
    this.router.navigate(['garden/edit/', gardenId]);
  }

  async deleteGarden(gardenId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this garden?');
    if (confirmDelete) {
      try {
        await this.supabaseService.deleteGarden(gardenId);
        // Refresh the garden list
        this.loadGardens();
        alert('Garden deleted successfully!');
      } catch (error) {
        console.error('Error deleting garden:', error);
        alert('Failed to delete the garden. Please try again.');
      }
    }
  }

}
