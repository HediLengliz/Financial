import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrls: ['./show-task.component.css']
})
export class ShowTaskComponent implements OnInit {

  id: any;
  data: any;
  duration: any;
  constructor(private taskService: TaskService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.showTaskById();
  }

  showTaskById() {
    this.taskService.showTask(this.id).subscribe(res => {
      console.log(res);
      this.data = res.task;
    });
  }

}
