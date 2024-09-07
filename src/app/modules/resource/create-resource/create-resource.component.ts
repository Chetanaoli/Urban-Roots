import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-resource',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './create-resource.component.html',
  styleUrl: './create-resource.component.css'
})
export class CreateResourceComponent {
  resource: any = { name: '', rent_price: null, rental_period: 'per day', image_url: '', category: '' };
  isEditing: boolean = false;
  selectedImage: File | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const resourceId = this.route.snapshot.paramMap.get('id');
    if (resourceId) {
      this.isEditing = true;
      this.loadResource(resourceId);
    }
  }

  async loadResource(resourceId: string) {
    try {
      this.resource = await this.supabaseService.getResourceById(resourceId);
    } catch (error) {
      console.error('Error loading resource:', error);
      alert('Failed to load resource.');
      this.router.navigate(['/resource/view-nearby']);
    }
  }

  async saveResource() {
    try {
      if (this.selectedImage) {
        const { id, path, fullPath } = await this.supabaseService.uploadImage(this.selectedImage);
        const imgUrl = 'https://zodsxcgcbwuespvjjkdc.supabase.co/storage/v1/object/public/' + fullPath;

        // const { publicUrl } = await this.supabaseService.uploadImage(this.selectedImage);
        this.resource.image_url = imgUrl; // Update image URL
      }

      if (this.isEditing) {
        await this.supabaseService.updateResource(this.resource.id, this.resource);
      } else {
        this.resource.created_by_uid = this.authService.currentUser.id;
        await this.supabaseService.createResource(this.resource);
      }
      alert('Resource saved successfully!');
      this.router.navigate(['/resource/view-nearby']);
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource.');
    }
  }

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0] || null;
  }
}
