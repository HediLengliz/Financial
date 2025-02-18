import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/task.interface';
import { FeatureService } from 'src/app/services/feature.service';
import { MemberService } from 'src/app/services/member.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  id: any;
  Task = new Task();
  features: any;
  members: any;
  constructor(private featureService: FeatureService, private taskService: TaskService, private route:ActivatedRoute, private router:Router, private memberService: MemberService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getTaskById();
    this.getFeatureList();
    this.getMemberList();
  }

  getFeatureList(): void {
    this.featureService.getFeature().subscribe((res) => {
      this.features = res.features;
    });
  }

  getMemberList(): void {
    this.memberService.getMember().subscribe((res) => {
      this.members = res.members;
    })
  }

  getTaskById() {
    this.taskService.getTaskById(this.id).subscribe(res => {
      console.log(res);
      this.Task = res.task;
      // Convert the dates to the required format
      this.Task.start_date = this.convertToInputDate(this.Task.start_date);
      this.Task.end_date = this.convertToInputDate(this.Task.end_date);
    });
  }
  
  convertToInputDate(dateString: string): string {
    const date = new Date(dateString);
    // Format the date as "yyyy-MM-dd"
    return date.toISOString().split('T')[0];
  }

  updateTask(){
    this.taskService.updateTask(this.id, this.Task).subscribe(res=>{
      console.log(res);
      this.router.navigate(['/dashboard/task']);
    })
  }

}
