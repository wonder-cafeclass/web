// Keep the Input import for now, we'll remove it later:
import { Component, Input, OnInit, HostBinding,
         trigger, transition, animate,
         style, state } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location }                 from '@angular/common';

import { UserService } from './user.service';
import { User } from './user';


@Component({
	// moduleId: module.id, // @required : relative path
	selector: 'my-user-detail',
	templateUrl: 'user-detail.component.html',
	styleUrls: [ 'user-detail.component.css' ],
	animations: [
		trigger('routeAnimation', [
			state('*',
				style({
					opacity: 1,
					transform: 'translateX(0)'
				})
			),
			transition('void => *', [
				style({
					opacity: 0,
					transform: 'translateX(-100%)'
				}),
				animate('0.2s ease-in')
			]),
			transition('* => void', [
				animate(
					'0.5s ease-out', 
					style({
						opacity: 0,
						transform: 'translateY(100%)'
				}))
			])
		])
	]	
})
export class UserDetailComponent implements OnInit {

	@HostBinding('@routeAnimation') get routeAnimation() {
		return true;
	}

	@HostBinding('style.display') get display() {
		return 'block';
	}

	@HostBinding('style.position') get position() {
		return 'absolute';
	}

	@Input() user: User;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.route.params.forEach((params: Params) => {
			let id = +params['id']; // (+) converts string 'id' to a number
			this.userService.getUser(id).then(user => this.user = user);
		});

		// snapshot
		// (+) converts string 'id' to a number
		// let id = +this.route.snapshot.params['id'];
		// this.userService.getUser(id).then(user => this.user = user);	
	}

	goBack(): void {
		this.location.back();
	}	

	gotoUsers() { 
		// this.router.navigate(['/users']); 

		let userId = this.user ? this.user.id : null;
		// Pass along the hero id if available
		// so that the HeroList component can select that hero.
		this.router.navigate(['/users', { id: userId, foo: 'foo' }]);		
	}

	save(): void {
		this.userService.update(this.user)
		.then(() => this.goBack());
	}

}
