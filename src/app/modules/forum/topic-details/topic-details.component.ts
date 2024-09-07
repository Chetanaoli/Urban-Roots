import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topic-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.css'
})
export class TopicDetailsComponent implements OnInit {
  topic: any;
  comments: any[] = [];
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private router: Router
) {}

  ngOnInit(): void {
    const topicId = this.route.snapshot.paramMap.get('id');
    if (topicId) {
      this.loadTopic(topicId);
    }
  }

  async loadTopic(topicId: string) {
    try {
      this.topic = await this.supabaseService.getTopicById(topicId);
      this.comments = await this.supabaseService.getCommentsByTopicId(topicId);
    } catch (error) {
      console.error('Error loading topic:', error);
      alert('Failed to load topic.');
      this.router.navigate(['/forum']);
    }
  }

  async addComment() {
    if (!this.newComment) return;
    
    const comment = {
      topic_id: this.topic.id,
      user_id: this.authService.currentUser.id,
      content: this.newComment
    };
    
    try {
      await this.supabaseService.createComment(comment);
      this.comments.push(comment); // Update comments in the UI
      this.newComment = ''; // Reset comment input
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
    }
  }
}
