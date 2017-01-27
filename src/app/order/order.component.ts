import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'order',
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.css'],

})
export class OrderComponent implements OnInit {

  session:SessionService;

  constructor(session:SessionService) { 
     this.session = session;     
  }

  ngOnInit() {
//     this.session.setTitle("Putting the stories in order");
  }

}
