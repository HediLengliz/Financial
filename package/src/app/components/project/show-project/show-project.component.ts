import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project.interface';
import { DatePipe, NgClass, TitleCasePipe, UpperCasePipe } from "@angular/common";
import { NgCircleProgressModule } from "ng-circle-progress";

// Import your custom pipes
import { StatusPipe } from '../../../pipe/status.pipe';
import { PriorityPipe } from '../../../pipe/priority.pipe';

@Component({
  selector: 'app-show-project',
  templateUrl: './show-project.component.html',
  standalone: true,
  imports: [
    NgClass,
    TitleCasePipe,
    UpperCasePipe,
    DatePipe,
    NgCircleProgressModule,
    StatusPipe,   // Add this
    PriorityPipe  // Add this
  ],
  styleUrls: ['./show-project.component.css']
})
export class ShowProjectComponent implements OnInit {
  id!: number;
  project!: Project;
  progress: number = 0;

  // Workflow statistics
  totalWorkflows: number = 0;
  completedWorkflows: number = 0;
  inProgressWorkflows: number = 0;

  // Static workflow data
  workflows = [
    {
      name: 'Planning Phase',
      status: 'completed',
      progress: 100,
      dueDate: new Date('2023-11-30')
    },
    {
      name: 'Development',
      status: 'in_progress',
      progress: 65,
      dueDate: new Date('2023-12-15')
    },
    {
      name: 'Testing',
      status: 'not_started',
      progress: 0,
      dueDate: new Date('2023-12-31')
    }
  ];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadProject();
    this.calculateWorkflowStats();
  }

  loadProject(): void {
    this.projectService.getProjectById(this.id).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.router.navigate(['/dashboard/projects']);
      }
    });
  }

  private calculateWorkflowStats(): void {
    this.totalWorkflows = this.workflows.length;
    this.completedWorkflows = this.workflows.filter(w => w.status === 'completed').length;
    this.inProgressWorkflows = this.workflows.filter(w => w.status === 'in_progress').length;
    this.progress = Math.round((this.completedWorkflows / this.totalWorkflows) * 100);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'completed': return 'badge-success';
      case 'in_progress': return 'badge-warning';
      case 'not_started': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  getWorkflowProgressClass(progress: number): string {
    if (progress === 100) {
      return 'bg-success';
    } else if (progress > 0) {
      return 'bg-warning';
    } else {
      return 'bg-secondary';
    }
  }
}
