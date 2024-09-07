import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-garden-details',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterModule],
  templateUrl: './garden-details.component.html',
  styleUrl: './garden-details.component.css'
})
export class GardenDetailsComponent  implements OnInit {
  garden: any;

  constructor(private route: ActivatedRoute, private supabaseService: SupabaseService, private router: Router) {}
  ngOnInit(): void {
    this.getGardenDetail();
  }

  async getGardenDetail() {
    const gardenId = this.route.snapshot.paramMap.get('id');
    if (gardenId) {
      try {
        this.garden = await this.supabaseService.getGardenById(gardenId);

        if (!this.garden) {
          alert('Garden not found');
          this.router.navigate(['/user/dashboard']); // Redirect if not found
        }

      } catch (error) {
        console.error('Error fetching garden details:', error);
        alert('Failed to load garden details. Please try again.');
        this.router.navigate(['/user/dashboard']);
      }
    }
  }
}
