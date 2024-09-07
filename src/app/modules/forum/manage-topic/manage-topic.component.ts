import { Component } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-topic',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './manage-topic.component.html',
  styleUrl: './manage-topic.component.css'
})
export class ManageTopicComponent {
  topics: any[] = [];

  constructor(private supabaseService: SupabaseService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadMyTopics();
  }

  async loadMyTopics() {
    try {
      const userId = this.authService.currentUser.id;
      this.topics = await this.supabaseService.getTopicsByUserId(userId);
    } catch (error) {
      console.error('Error loading my topics:', error);
    }
  }

  async deleteTopic(topicId: string) {
    if (confirm('Are you sure you want to delete this topic?')) {
      try {
        await this.supabaseService.deleteTopic(topicId);
        this.loadMyTopics(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  }
}
