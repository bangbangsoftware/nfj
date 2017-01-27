import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SessionService } from '../session.service';
import { Member, Skill } from '../shared';

@Component({
  selector: 'app-team',
  templateUrl: 'team.component.html',
  styleUrls: ['team.component.css']
})
export class TeamComponent implements OnInit {

  roles: Array<string> = new Array<string>();
  teamForm: FormGroup;
  newRole: string;
  newEmail: FormControl;
  newName: FormControl;

  constructor(private fb: FormBuilder, private session: SessionService) { 
      session.isIn();    
      this.roles.push("Product Owner");
      this.roles.push("Scrum Master");
      this.roles.push("Tester");
      this.roles.push("Front end dev");
      this.roles.push("Back end dev");
      this.roles.push("UX");
      this.roles.push("Trainer");
      this.roles.push("Operation");

      this.newName = new FormControl('', Validators.required);
      this.newEmail = new FormControl('', Validators.required);
      this.newRole = "";
      this.teamForm = this.fb.group({
         'newName': this.newName,
         'newEmail': this.newEmail
      });


  }

  pickRole(value){
     this.newRole = value;     
  }

  ngOnInit() {
  }

  onSubmit() {
      const name = this.newName.value;
      const role = this.newRole;    
      const email = this.newEmail.value;
      const skills = Array<Skill>();
      //this.session.team.push(new Member(name,role,email,skills));
      this.newName.setValue("");
      this.newEmail.setValue("");
      this.newRole = "";
  }

  removeMember(i) {
      this.session.project.team.splice(i, 1);
  }

  editMember(i){
      const memb = this.session.project.team[i];    
      this.newName.setValue(memb.name);
      this.newEmail.setValue(memb.email);
      this.newRole = memb.roles[0];
  }

}
