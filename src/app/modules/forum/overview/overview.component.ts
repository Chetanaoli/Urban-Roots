import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { SupabaseService } from '../../../core/services/supabase.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './overview.component.html',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  topics: any[] = [];

  constructor(private supabaseService: SupabaseService) {}


  ngOnInit(): void {
    this.loadTopics();
  }

  async loadTopics() {
    try {
      this.topics = await this.supabaseService.getAllTopics();
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  }
}
