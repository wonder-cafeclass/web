import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent }  from './app.component';
import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './users.component';
import { UserDetailComponent } from './user-detail.component';
import { UserService } from './user.service';
import { UserSearchComponent } from './user-search.component';
import { routing } from './app.routing';


@NgModule({
  imports: [
  	BrowserModule,
  	FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
  	routing
  ],
  declarations: [ 
  	AppComponent,
  	DashboardComponent,
  	UserDetailComponent,
  	UsersComponent,
    UserSearchComponent
  ],
  providers: [
  	UserService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
