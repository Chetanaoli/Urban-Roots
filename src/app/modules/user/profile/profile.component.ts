import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';

import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule, HeaderComponent, RouterLink],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  implements OnInit {
  profile: any = {
    username: '',
    email: '',
    avatar_url: ''
  };
  isLoading: boolean = true;
  isEditing: boolean = false;
  selectedImage: File | null = null;

  constructor(
    private supabaseService: SupabaseService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  async loadProfile() {
    if (this.authService?.currentUser) {
      this.profile.email = this.authService?.currentUser?.email;

    }
    try {
      const userId = this.authService.currentUser.id;
      this.profile = await this.supabaseService.getProfileById(userId);
      console.log('this.profile ', this.profile );
      
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile.');
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile() {
    try {

      if (this.selectedImage) {

        const { id, path, fullPath } = await this.supabaseService.uploadImage(this.selectedImage);
        const imgUrl = 'https://zodsxcgcbwuespvjjkdc.supabase.co/storage/v1/object/public/' + fullPath;

        // const { publicUrl } = await this.supabaseService.uploadImageTopic(this.selectedImage);
        this.profile.avatar_url = imgUrl; // Update image URL
      }


      const userId = this.authService.currentUser.id;
      await this.supabaseService.updateProfile({
        id: userId, // Include the user id
        ...this.profile // Spread the profile fields 
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  }

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0] || null;
  }

  getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  removeImage(): void {
    this.selectedImage = null;
  }

}
