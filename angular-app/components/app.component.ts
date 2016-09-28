import { Component } from '@angular/core';

@Component{
	template: '<h1>{{title}}</h1><h2>{{hero}} details!</h2>'
}
export class AppComponent {
  title = 'Tour of Heroes';
  hero = 'Windstorm';
}
