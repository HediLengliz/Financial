import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('navToggle', { static: true }) navToggle!: ElementRef<HTMLAnchorElement>;
  token: any;
  userData: any;
  toggleSwitch: any;
  isChecked: boolean = false;

  constructor(private renderer: Renderer2, private router:Router, private authService: AuthService, private toastr: ToastrService, private sharedService: SharedService) { }

  ngOnInit(): void {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme == 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    this.token = localStorage.getItem('token');
    if (this.token) {
      this.authService.getUserProfile().subscribe((data: any) => {
        this.userData = data;
      });
    }
    this.sharedService.reloadProfile$.subscribe(() => {
      this.authService.getUserProfile().subscribe((data: any) => {
        this.userData = data;
      });
    });
  }

  swithTheme() {
    this.isChecked = !this.isChecked;
    if (this.isChecked) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  toggleNav(): void {
    const mainWrapper = document.getElementById('main-wrapper');
    if (mainWrapper?.classList.contains('toggled')) {
      this.renderer.removeClass(mainWrapper, 'toggled');
    } else {
      this.renderer.addClass(mainWrapper, 'toggled');
    }
  }

  // logout(): void {
  //   this.authService.logout().subscribe(() => {
  //     localStorage.removeItem('token');
  //     this.router.navigate(['/login']);
  //   });
  // }

  logout(): void {
    this.authService.logout().subscribe(
      (res: any) => {
        if (res && res.message) {
          this.toastr.success(res.message, 'Success', {
            timeOut: 2000,
            progressBar: true
          });
        } else {
          this.toastr.error('Logout failed', 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        this.router.navigate(['/login']);
      },
      (error) => {
        // Handle error if any
        this.toastr.error('Logout failed', 'Error', {
          timeOut: 4000,
          progressBar: true
        });
        console.error('Logout error:', error);
      }
    );
  }
  
}
