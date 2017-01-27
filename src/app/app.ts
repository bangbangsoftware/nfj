import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { Direction } from './direction';

@Component({
    selector: 'app-root',
    templateUrl: 'app.html',
    styleUrls: ['app.css'],
    providers: [SessionService, Direction]
})
export class AppComponent {
    title: string = "Who are you?";
    constructor(private router: Router, private session: SessionService) {}

    team(sidenav) {
        this.closeAndGo(sidenav, '/team');
    }
    create(sidenav) {
        this.closeAndGo(sidenav, '/story');
    }
    order(sidenav) {
        this.closeAndGo(sidenav, '/order');
    }
    points(sidenav) {
        this.closeAndGo(sidenav, '/points');
    }

    logout(){
        this.session.logout();    
    } 

    closeAndGo(sidenav, path) {
        sidenav.close();
        this.router.navigate([path]);
        this.title = this.session.determineTitle(path);
    }
}
