import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('navToggle', { static: true }) navToggle!: ElementRef<HTMLAnchorElement>;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  toggleNav(): void {
    const mainWrapper = document.getElementById('main-wrapper');
    if (mainWrapper?.classList.contains('toggled')) {
      this.renderer.removeClass(mainWrapper, 'toggled');
    } else {
      this.renderer.addClass(mainWrapper, 'toggled');
    }
  }
}
