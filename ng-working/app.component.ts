import { Component, OnInit }	from '@angular/core';
import { AuthService }          from './auth.service';

@Component({
	moduleId: module.id,
	selector: 'my-app',
	styleUrls: ['app.component.css'],
	templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

	// admin server 여부를 판별합니다.
	constructor(
		private authService: AuthService
	) {}

	isAdmin:boolean=false;
	ngOnInit(): void {
		this.authService.getAdminAuth().then(
			result => {
				if(null != result.is_admin) {
					this.isAdmin = result.is_admin;		
				}
			}
		);
	}

}