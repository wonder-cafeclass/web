import { bootstrap } from "angular2/platform/browser"
import { provide } from 'angular2/core';
import { App } from "./components/app/app"

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import {
    LocationStrategy,
    HashLocationStrategy,
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS
} from 'angular2/router';

// App Module
bootstrap(App, [
    ROUTER_PROVIDERS,
    ROUTER_DIRECTIVES,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
