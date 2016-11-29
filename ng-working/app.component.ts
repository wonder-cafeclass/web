import { Component, OnInit }	from '@angular/core';
import { UrlService }          	from './util/url.service';
import { AuthService }          from './auth.service';
import { ImageService }          from './util/image.service';

@Component({
	moduleId: module.id,
	selector: 'my-app',
	styleUrls: ['app.component.css'],
	templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

	// admin server 여부를 판별합니다.
	constructor(
		private authService: AuthService,
		private urlService: UrlService,
		public imageService: ImageService
	) {}

	isAdmin:boolean=false;
	ngOnInit(): void {

		// 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
		this.authService.getAdminAuth().then(
			result => {
				if(null != result.is_admin) {
					this.isAdmin = result.is_admin;
				}
			}
		);

		// 회원 로그인 쿠키를 가져옵니다.
		console.log("회원 로그인 쿠키를 가져옵니다.");
	}

}