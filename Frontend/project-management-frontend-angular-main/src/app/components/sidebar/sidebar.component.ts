import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { Project } from 'src/app/models/project.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.sidebarService.reloadSidebar$.subscribe(() => this.loadProjects());
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => console.error('Error loading projects:', err)
    });
  }
}
