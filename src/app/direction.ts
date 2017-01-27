import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class Direction {

    constructor(private router: Router) {}

    next(session) {
        if (session.lastLocation && session.projectDB) {
            this.router.navigate([session.lastLocation]);
        } else {
            // @TODO needs to do it based on user
            this.router.navigate(['/story']);
        }
    }
}
