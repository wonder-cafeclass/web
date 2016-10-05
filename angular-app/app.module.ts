import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { CommonModule }   from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

// Imports for loading & configuring the in-memory web api
// import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
// import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent }  from './app.component';
// import { DashboardComponent } from './dashboard.component';
// import { UsersComponent } from './users/users.component';
// import { UserService } from './users/user.service';
// import { UserSearchComponent } from './users/user-search.component';

// import { routing } from './app.routing';
import { routing, appRoutingProviders } from './app.routing';
// import { appRoutingProviders } from './app.routing';

// import { UsersModule }         from './users/users.module';
// import { ClassCenterModule }     from './class-center/class-center.module';

// import { LoginComponent }       from './login.component';

// import { DialogService }          from './dialog.service';


@NgModule({
  imports: [
    CommonModule,
  	BrowserModule,
  	FormsModule,
    routing,
    HttpModule,
    JsonpModule
    // InMemoryWebApiModule.forRoot(InMemoryDataService),
    // UsersModule,
    // ClassCenterModule,
  ],
  declarations: [ 
  	AppComponent,
  	// DashboardComponent,
  	// UsersComponent,
   //  UserSearchComponent,
   //  LoginComponent
  ],
  providers: [
  	// UserService,
    // appRoutingProviders,
   //  DialogService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
