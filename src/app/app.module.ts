import { NgModule, enableProdMode } from '@angular/core';

import { BrowserModule  } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { routing, appRoutingProviders } from './routes';

import { environment} from './';
import { AppComponent }   from './app';
import { Story } from './story/story';
import { PointsComponent } from './points/points.component';
import { OrderComponent } from './order/order.component';
import { TeamComponent } from './team/team.component';
import { LoginComponent } from './login/login.component';

if (environment.production) {
  enableProdMode();
}

@NgModule({
    declarations: [ AppComponent, Story, PointsComponent, OrderComponent, TeamComponent, LoginComponent ],
    providers:    [ appRoutingProviders ],
    imports:      [ BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule.forRoot(), routing ],
    bootstrap:    [ AppComponent ],
})
export class AppModule {}
