import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css']
})
export class ListTaskComponent implements OnInit {

  @Input() featureId!: string | null;
  tasks: any;
  
  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    if (this.featureId) {
      this.getTaskByFeatureId(this.featureId);
    }
  }

  getTaskByFeatureId(featureId: string): void {
    this.taskService.getTaskByFeature(featureId)
      .subscribe((response: any) => {
        console.log(response);
        this.tasks = response.tasks;
      });
  }

}
