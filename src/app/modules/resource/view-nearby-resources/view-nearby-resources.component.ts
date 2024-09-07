import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-view-nearby-resources',
  standalone: true,
  imports: [HeaderComponent, CommonModule,RouterLink],
  templateUrl: './view-nearby-resources.component.html',
  styleUrl: './view-nearby-resources.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewNearbyResourcesComponent implements OnInit {
  resources: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.loadNearbyResources();
  }

  async loadNearbyResources() {
    try {
      this.resources = await this.supabaseService.getAllResources();
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  }
}
