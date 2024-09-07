import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resource-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './resource-details.component.html',
  styleUrl: './resource-details.component.css'
})
export class ResourceDetailsComponent implements OnInit {
  resource: any;
  comments: any[] = [];
  newComment: string = '';
  userNamesMap: { [key: string]: string | null } = {}; 
  constructor(
    private route: ActivatedRoute,
    public supabaseService: SupabaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const resourceId = this.route.snapshot.paramMap.get('id');
    if (resourceId) {
      this.loadResource(resourceId);
    }
  }

  async loadResource(resourceId: string) {
    try {
      this.resource = await this.supabaseService.getResourceById(resourceId);
      this.comments = await this.supabaseService.getCommentsByResourceId(resourceId);

          // Pre-fetch usernames for all users in the comments
          for (const comment of this.comments) {
            if (!this.userNamesMap[comment.user_id]) {
              this.userNamesMap[comment.user_id] = await this.getUsername(comment.user_id); // Fetch and cache the username
            }
          }

          if (this.resource) {
            this.userNamesMap[this.resource.created_by_uid] = await this.getUsername(this.resource.created_by_uid);
          }
      
    } catch (error) {
      console.error('Error loading resource:', error);
      alert('Failed to load resource.');
      this.router.navigate(['/resource/view-nearby']);
    }
  }

  async addComment() {
    if (!this.newComment) return;

    const comment = {
      
      resource_id: this.resource.id,
      user_id: this.authService.currentUser.id,
      content: this.newComment
    };

    try {
      await this.supabaseService.createComment(comment);
      this.comments.push({ ...comment, created_at: new Date().toISOString() }); // Add to the UI
      this.newComment = ''; // Reset the input
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
    }
  }

  uidtoUsername(uid: any) {
   return this.supabaseService.getUsername(uid);
  }

  
  async getUsername(uid: string): Promise<string | null> {
    const username = await this.supabaseService.getUsername(uid); 
    return username;
  }


}