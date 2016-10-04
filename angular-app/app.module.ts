import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

// Imports for loading & configuring the in-memory web api
// import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
// import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent }  from './app.component';
import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './users.component';
import { UserService } from './user.service';
import { UserSearchComponent } from './user-search.component';
import { routing, appRoutingProviders } from './app.routing';

import { UsersModule }         from './users/users.module';


@NgModule({
  imports: [
  	BrowserModule,
  	FormsModule,
    HttpModule,
    JsonpModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService),
  	routing,
    UsersModule
  ],
  declarations: [ 
  	AppComponent,
  	DashboardComponent,
  	UsersComponent,
    UserSearchComponent,
  ],
  providers: [
  	UserService,
    appRoutingProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
