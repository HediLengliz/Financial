import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task.interface';
import { FeatureService } from 'src/app/services/feature.service';
import { MemberService } from 'src/app/services/member.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  newTask = new Task();
  features: any;
  members: any;
  constructor(private featureService: FeatureService, private taskService: TaskService, private router:Router, private memberService: MemberService) { }

  ngOnInit(): void {
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

  addTask(){
    this.taskService.addTask(this.newTask).subscribe(res=>{
      console.log(res);
      this.router.navigate(['/dashboard/task']);
    });
  }

}
