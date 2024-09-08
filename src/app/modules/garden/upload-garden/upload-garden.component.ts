import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { GeoService } from '../../../core/services/geo.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-upload-garden',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterModule, HttpClientModule],
  templateUrl: './upload-garden.component.html',
  styleUrls: ['./upload-garden.component.css']
})
export class UploadGardenComponent implements AfterViewInit {
  selectedLocation: any;
  isEditing: boolean = false;
  
  garden: any = {
    name: '',
    description: '',
    sqft: null,
    type: 'public', // Default value
    imageurls: [],
    latitude: null,
    longitude: null,
    address: '',
    createdbyuid: '',
    createdbyusername: '',
    createdbyemail: ''
  };

  selectedImages: File[] = [];
  isUploading: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private geoService: GeoService,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    // Initialize the map
    this.geoService.initLatMap((lat: number, lng: number) => {
      this.onLocationSelected(lat, lng);
    });
    this.requestLocation();
    this.checkRouteAndFetchGarden();  // New method to check route parameters and fetch garden if editing
  }

  onImageSelected(event: any): void {
    this.selectedImages = Array.from(event.target.files);
  }

  async uploadGarden() {
    if (this.selectedImages.length === 0) return;

    this.isUploading = true;

    try {
      const uploadedUrls: string[] = [];

      for (const file of this.selectedImages) {
        const { id, path, fullPath } = await this.supabaseService.uploadImage(file);
        const imgUrl = 'https://zodsxcgcbwuespvjjkdc.supabase.co/storage/v1/object/public/' + fullPath;
        uploadedUrls.push(imgUrl); 
      }

      const data = await this.reverseGeocode(this.garden.latitude, this.garden.longitude);
      this.garden.address = data.display_name; 
      console.log('Reverse Geocode Response:', this.garden.address);

      // Save the garden information
      this.garden.imageurls = uploadedUrls;
      this.garden.createdbyemail = this.authService.currentUser.email;
      this.garden.createdbyusername = await this.supabaseService.getUsername(this.authService.currentUser.id);
      this.garden.createdbyuid = this.authService.currentUser.id;

      if (this.isEditing) {
        console.log('edit', this.isEditing);

        // Update operation for editing
        await this.supabaseService.updateGarden(this.garden);
      } else {
        console.log('not edit', this.isEditing);
        console.log('garden',this.garden);

        // Save new garden
        await this.supabaseService.saveGarden(this.garden);
      }

      alert('Garden uploaded successfully!');
      this.router.navigate(['/user/dashboard']);
    } catch (error: any) {
      console.error('Error uploading garden:', error.message);
      alert('Failed to upload garden. Please try again.');
    } finally {
      this.isUploading = false;
    }
  }

  async checkRouteAndFetchGarden() {
    // Check for garden ID in the route parameters
    const gardenId = this.route.snapshot.paramMap.get('id');
    if (gardenId) {
      this.isEditing = true; // Set editing mode to true
      try {
        // Fetch the garden details from Supabase
        const gardenData = await this.supabaseService.getGardenById(gardenId);

        if (gardenData.createdbyuid !== this.authService.currentUser.id) {
          // Check if the user is the creator
          alert('You do not have permission to edit this garden.');
          this.router.navigate(['/user/dashboard']); // Redirect if not authorized
          return;
        }

        // Populate the form with the garden's current details
        this.garden = { ...gardenData }; // Get the garden data
        this.selectedImages = []; // Reset selected images, or you can preload existing images if needed
      } catch (error) {
        console.error('Error fetching garden:', error);
        alert('Failed to load garden for editing.');
        this.router.navigate(['/user/dashboard']);
      }
    }
  }

  onLocationSelected(lat: number, lng: number): void {
    this.garden.latitude = lat; // Set the latitude when the location is selected
    this.garden.longitude = lng; // Set the longitude when the location is selected
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  requestLocation(): void {
    this.geoService.getUserLocation().then((location: any) => {
      if (location) {
        this.onLocationSelected(location.lat, location.lng);
      }
    });
  }

  reverseGeocode(lat: any, lon: any): Promise<any> {
    const apiUrl = 'https://nominatim.openstreetmap.org/reverse';
    const url = `${apiUrl}?format=json&lon=${lon}&lat=${lat}`;
    return lastValueFrom(this.http.get(url));
  }
}