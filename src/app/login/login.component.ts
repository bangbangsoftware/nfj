import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SessionService } from '../session.service';
import { Member, Skill } from '../shared';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent  {

  loginForm: FormGroup;
  newPw: FormControl;
  newName: FormControl;
  constructor(private fb: FormBuilder, private session: SessionService) { 
      console.log("who are %cYOU?", "font-size:300%; color:red");
      this.newName = new FormControl('', Validators.required);
      this.newPw = new FormControl('', Validators.required);
      this.loginForm = this.fb.group({
         'newName': this.newName,
         'newPw': this.newPw
      });
  }

  login(){
      console.log("Logging in");    
      const name = this.newName.value;
      const pw = this.newPw.value;
      this.session.login(name,pw);
  }
}
