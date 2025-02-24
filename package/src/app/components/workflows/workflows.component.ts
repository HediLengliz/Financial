// workflow-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowService } from '../../services/workflow.service';
import { Workflow } from '../../models/workflow';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent implements OnInit {
  workflows: Workflow[] = []; // Initialize as empty array
  projectId: number = 1; // Example project ID

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.loadWorkflows();
  }

  loadWorkflows(): void {
    this.workflowService.getWorkflowsByProjectId(this.projectId).subscribe(
      (data) => this.workflows = data,
      (error) => console.error('Error fetching workflows', error)
    );
  }

  deleteWorkflow(id: number): void {
    this.workflowService.deleteWorkflow(id).subscribe(
      () => this.workflows = this.workflows.filter(w => w.id !== id),
      (error) => console.error('Error deleting workflow', error)
    );
  }
}
