import { Routes } from '@angular/router';
import { LoginComponent } from './modules/user/login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  // { path: '', component: LoginComponent }, // Eagerly load the login component
  { path: '', component: HomeComponent }, // Eagerly load the login component
  // { 
  //   path: '', 
  //   loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) 
  // },
  { 
    path: 'user/login', 
    loadComponent: () => import('./modules/user/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'user/registration', 
    loadComponent: () => import('./modules/user/registration/registration.component').then(m => m.RegistrationComponent) 
  },
  { 
    path: 'user/profile', 
    loadComponent: () => import('./modules/user/profile/profile.component').then(m => m.ProfileComponent) 
  },
  { 
    path: 'user/forgotpassword', 
    loadComponent: () => import('./modules/user/forgotpassword/forgotpassword.component').then(m => m.ForgotpasswordComponent) 
  },
  { 
    path: 'user/dashboard', 
    loadComponent: () => import('./modules/garden/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'garden/upload-garden', 
    loadComponent: () => import('./modules/garden/upload-garden/upload-garden.component').then(m => m.UploadGardenComponent) 
  },
  { 
    path: 'garden/edit/:id', 
    loadComponent: () => import('./modules/garden/upload-garden/upload-garden.component').then(m => m.UploadGardenComponent) 
  },
  { 
    path: 'garden/map-overview', 
    loadComponent: () => import('./modules/garden/map-overview/map-overview.component').then(m => m.MapOverviewComponent) 
  },
  { 
    path: 'garden/manage-garden', 
    loadComponent: () => import('./modules/garden/manage-garden/manage-garden.component').then(m => m.ManageGardenComponent) 
  },
  { 
    path: 'garden/share-my-garden', 
    loadComponent: () => import('./modules/garden/share-my-garden/share-my-garden.component').then(m => m.ShareMyGardenComponent) 
  },
  { 
    path: 'forum/overview', 
    loadComponent: () => import('./modules/forum/overview/overview.component').then(m => m.OverviewComponent) 
  }, // Corrected component name
  { 
    path: 'forum/create-topic', 
    loadComponent: () => import('./modules/forum/create-topic/create-topic.component').then(m => m.CreateTopicComponent) 
  },
  { 
    path: 'forum/edit/:id', 
    loadComponent: () => import('./modules/forum/create-topic/create-topic.component').then(m => m.CreateTopicComponent) 
  },
  { 
    path: 'forum/manage-topic', 
    loadComponent: () => import('./modules/forum/manage-topic/manage-topic.component').then(m => m.ManageTopicComponent) 
  },
  { 
    path: 'forum/:id', 
    loadComponent: () => import('./modules/forum/topic-details/topic-details.component').then(m => m.TopicDetailsComponent) 
  }, // Corrected component name and path
  { 
    path: 'garden/:id', 
    loadComponent: () => import('./modules/garden/garden-details/garden-details.component').then(m => m.GardenDetailsComponent) 
  },
  {
    path: 'resource/view-nearby',
    loadComponent: () => import('./modules/resource/view-nearby-resources/view-nearby-resources.component')
      .then(m => m.ViewNearbyResourcesComponent)
  },
  {
    path: 'resource/details/:id',
    loadComponent: () => import('./modules/resource/resource-details/resource-details.component')
      .then(m => m.ResourceDetailsComponent)
  },
  {
    path: 'resource/create',
    loadComponent: () => import('./modules/resource/create-resource/create-resource.component')
      .then(m => m.CreateResourceComponent)
  },
  {
    path: 'resource/edit/:id',
    loadComponent: () => import('./modules/resource/create-resource/create-resource.component')
      .then(m => m.CreateResourceComponent)
  },
  {
    path: 'resource/manage',
    loadComponent: () => import('./modules/resource/manage-resources/manage-resources.component')
      .then(m => m.ManageResourcesComponent)
  },
  {
    path: 'resource/requests',
    loadComponent: () => import('./modules/resource/resource-requests/resource-requests.component')
      .then(m => m.ResourceRequestsComponent)
  },

  { path: '**', redirectTo: '' } 
];