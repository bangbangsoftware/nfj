import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Story } from './story/story';
import { OrderComponent } from './order/order.component';
import { PointsComponent } from './points/points.component';
import { TeamComponent } from './team/team.component';
import { LoginComponent } from './login/login.component';

export const appRoutes: Routes = [
	{ path: 'story/:storyID/:back', component: Story },
	{ path: 'story', component: Story },
	{ path: 'order', component: OrderComponent },
	{ path: 'points', component: PointsComponent },
	{ path: 'team', component: TeamComponent },
	{ path: 'login', component: LoginComponent },
	{ path: '', component: LoginComponent }
];
 
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
