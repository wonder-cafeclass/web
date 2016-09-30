import {Component} from "angular2/core"
import {Users} from "../users/component"
import {Movies} from "../movies/component"
import {Login} from "../login/login.component"

import {
    RouteConfig,
    ROUTER_DIRECTIVES,
} from 'angular2/router';

@RouteConfig([
    {path:'/users', name: 'Users', component: Users},
    {path:'/movies', name: 'Movies', component: Movies},
    {path:'/login', name: 'Login', component: Login},
    {path:'/', name: 'root', redirectTo: ['/Users']}
])

@Component({
    selector: "angular2-codeigniter",
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})

export class App {

}