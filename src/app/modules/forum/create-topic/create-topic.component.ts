import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-topic',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-topic.component.html',
  styleUrl: './create-topic.component.css'
})
export class CreateTopicComponent implements OnInit  {
  topic: any = { topic_name: '', content: '', image_url: '' };
  isEditing: boolean = false;
  selectedImage: File | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const topicId = this.route.snapshot.paramMap.get('id');
    if (topicId) {
      this.isEditing = true;
      this.loadTopic(topicId);
    }
  }

  async loadTopic(topicId: string) {
    try {
      this.topic = await this.supabaseService.getTopicById(topicId);
    } catch (error) {
      console.error('Error loading topic:', error);
      alert('Failed to load topic.');
      this.router.navigate(['/forum']);
    }
  }

  async saveTopic() {
    try {
      this.topic.created_by_uid = this.authService.currentUser.id;
      
      if (this.selectedImage) {

        const { id, path, fullPath } = await this.supabaseService.uploadImage(this.selectedImage);
        const imgUrl = 'https://zodsxcgcbwuespvjjkdc.supabase.co/storage/v1/object/public/' + fullPath;

        // const { publicUrl } = await this.supabaseService.uploadImageTopic(this.selectedImage);
        this.topic.image_url = imgUrl; // Update image URL
      }

      if (this.isEditing) {
        await this.supabaseService.updateTopic(this.topic.id, this.topic);
      } else {
        await this.supabaseService.createTopic(this.topic);
      }
      
      alert('Topic saved successfully!');
      this.router.navigate(['/forum/overview']);
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('Failed to save topic.');
    }
  }

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0] || null;
  }

}
