import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
isMenuOpen: any;
  constructor(private authService: AuthService, private router: Router, private cdRef: ChangeDetectorRef) {}
  navItems = [
    {
      label: 'Gardens',
      value: 'gardens',
      icon: 'fas fa-seedling',
      route: '/user/dashboard',
      dropdownItems: [
        { label: 'Upload Garden', route: '/garden/upload-garden' },
        { label: 'My Gardens', route: '/garden/manage-garden' },
      ],
    },
    {
      label: 'Forum',
      value: 'forum',
      icon: 'fas fa-comments',
      route: '/forum/overview',
      dropdownItems: [
        { label: 'Post Forum', route: '/forum/create-topic' },
        { label: 'My Forums', route: '/forum/manage-topic' },
      ],
    },
    {
      label: 'Resources',
      value: 'resources',
      icon: 'fas fa-tools',
      route: '/resource/view-nearby',
      dropdownItems: [
        { label: 'Post Resources', route: '/resource/create' }, // Adjust route as needed
        { label: 'My Resources', route: '/resource/manage' }, // Adjust route as needed
      ],
    },
    {
      label: 'Account',
      value: 'account',
      icon: 'fas fa-user',
      route: '/user/profile',
      dropdownItems: [
        { label: 'Logout', route: '/user/login' }, // You might want to handle logout differently
      ],
    },
  ];
  @Input() activeNavItem: string = ''; // Declare activeNavItem as an input property

  ngOnInit() {
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe((event: NavigationEnd) => {

    //     console.log('event.url', event.url);
    //     this.navItems.forEach((i: any) => {
    //       if (i.route === event.url) {
    //         this.activeNavItem = i.value;
    //         console.log(' this.activeNavItem',  this.activeNavItem);
    //         this.cdRef.detectChanges(); // Manually trigger change detection

    //       }
    //     });
    //   });
  }

  onNavItemClicked(item: any) {
    // this.activeNavItem = item.value;
    // this.cdRef.detectChanges();

    this.router.navigate([item.route]);

  }

  onDropdownItemClick(item: any) {
    if (item.label === 'Logout') {
      // Check if it's the Logout item
      this.logout();
    }
    // Add handling for other dropdown items if needed
  }

  logout() {
    this.authService.logout();
  }
}
