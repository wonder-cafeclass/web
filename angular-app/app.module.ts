import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';
import { DashboardComponent } from './dashboard.component';
import { UserDetailComponent } from './user-detail.component';
import { UsersComponent } from './users.component';
import { UserService } from './user.service';

import { routing } from './app.routing';


@NgModule({
  imports: [
  	BrowserModule,
  	FormsModule,
  	routing
  ],
  declarations: [ 
  	AppComponent,
  	DashboardComponent,
  	UserDetailComponent,
  	UsersComponent
  ],
  providers: [
  	UserService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
