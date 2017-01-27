import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { MdUniqueSelectionDispatcher } from '@angular2-material/core';
import { Router } from '@angular/router';

import { Task, TimeLog, Skill } from '../shared';

@Component({
  selector: 'app-points',
  templateUrl: 'points.component.html',
  styleUrls: ['points.component.css'],
  providers: [MdUniqueSelectionDispatcher]
})
export class PointsComponent implements OnInit {
  session:SessionService;
  storyPoints: number;
  listTasks: Array<boolean>; 
  newTaskTitle: FormControl;
  newTaskTime: FormControl;
  taskForm: FormGroup;

  constructor(session:SessionService, private router: Router, private fb: FormBuilder){
     this.session = session;     
     this.listTasks = Array<boolean>(this.session.project.stories[0].items.length);
     this.newTaskTitle = new FormControl('', Validators.required);
     this.newTaskTime = new FormControl('', Validators.required);
        this.taskForm = this.fb.group({
            'newTitle': this.newTaskTitle,
            'newTime': this.newTaskTime,
        });


  }

  ngOnInit() {
     this.session.isIn();
  }

  showTasks(i,e){
     this.listTasks[i] = true;     
  }

  addTask(story){
     const time = new TimeLog(new Date(),this.newTaskTime.value,0,null,"First estimation","");     
     const times = Array<TimeLog>();     
     times.push(time);

     const skills = Array<Skill>();
     const task = new Task(this.newTaskTitle.value,null, null, null,times, skills);
     story.tasks.push(task);
     this.newTaskTitle.reset();
  }

  removeTask(story,i){
    story.tasks.splice(i,1);
  }

  edit(i){
    this.router.navigate(['story/',i,'points']);
  }

  moveUp(i){
   //this.session.moveUp(i);
  }

  moveDown(i){
   // this.session.moveDown(i);
  }
}
