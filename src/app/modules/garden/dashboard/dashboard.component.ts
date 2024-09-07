import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild,AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

import { fromLonLat } from 'ol/proj';

import { GeoService } from '../../../core/services/geo.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { SupabaseService } from '../../../core/services/supabase.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule, HeaderComponent,HttpClientModule ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit  {


  constructor(public geoService: GeoService, private supaService: SupabaseService) {}


  radiusOptions = [5, 10, 20, 50, 100];
  filter = { 
    distance: 5 ,
    category: '' as any
  } as any; // Default selected radius

  navItems = [
    { 
      label: 'Gardens', 
      value: 'gardens', 
      icon: 'fas fa-seedling', 
      dropdownItems: [
        { label: 'Upload Garden', route: '/garden/upload-garden' },
        { label: 'My Gardens', route: '/garden/manage-garden' }
      ]
    },
    { 
      label: 'Forum', 
      value: 'forum', 
      icon: 'fas fa-comments', 
      dropdownItems: [
        { label: 'Post Forum', route: '/forum/create-topic' },
        { label: 'My Forums', route: '/forum/manage-topic' }
      ]
    },
    { 
      label: 'Resources', 
      value: 'resources', 
      icon: 'fas fa-tools',
      dropdownItems: [
        { label: 'Post Resources', route: '/resource/create' }, // Adjust route as needed
        { label: 'My Resources', route: '/resource/manage' }   // Adjust route as needed
      ]
    },
    { 
      label: 'Account', 
      value: 'account', 
      icon: 'fas fa-user',
      dropdownItems: [
        { label: 'Logout', route: '/user/login' } // You might want to handle logout differently
      ]
    }
  ];
  activeNavItem = 'gardens';
  nearbyGardens:any = [{
    id: 'asdjknio2',
    name: 'A Garden',
    createdByUsername: 'Kartik A',
    type: 'private',
    sqft: '100',
    locationText: 'abc colony, city road, state, country',
    createdOn: new Date(),
    image: 'https://th.bing.com/th/id/OIP.Yd9NwVwFoj5O6MMZoFoRSAHaFj?rs=1&pid=ImgDetMain'
  },
  {
    id: 'asdjknio2',
    name: 'B Garden',
    createdByUsername: 'Kartik A',
    type: 'private',
    sqft: '200',
    locationText: 'abc colony, city road, state, country',
    createdOn: new Date(),
    image: 'https://images.squarespace-cdn.com/content/v1/63dde481bbabc6724d988548/6bb988c7-38df-494f-b00a-b17b88476e21/_21665ab8-bee4-479a-ba24-ae64cfbf4117.jpg'
  }
];


  ngOnInit(): void {

    this.geoService.updateView();
    const lat = 17.5196 ;
    const long = 78.4468;
    const type = 'public'

  }

  ngAfterViewInit() {
    // this.initMap(); // Initialize the map after the view is ready
    this.geoService.updateView();
    this.geoService.setTileSource();
    this.geoService.updateSize();
  }

 


  logout() {
    throw new Error('Method not implemented.');
  }
  onNavItemClicked(arg0: string) {
    throw new Error('Method not implemented.');
  }



  onRadiusChange(selectedRadius: number): void {
    this.filter.distance = selectedRadius;
  }

  onCategoryChange() {
    // You can also perform any additional logic when the selection changes
    console.log('Selected category:', this.filter.category);
  }

  applyFilters() {
    if(this.filter) {
      this.geoService.updateCircleRadius(this.filter,this.filter.distance * 1000); // Convert km to meters

    }
    }


}
