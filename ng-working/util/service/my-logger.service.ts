import { Injectable }             from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { UrlService } from "../../util/url.service";


@Injectable()
export class MyLoggerService {

	private apiLogActionPageUrl:string = '/CI/index.php/api/log/page';

	public pageKeyLogin:string="LOG_IN";
	public pageKeyLoginFacebook:string="LOG_IN_FACEBOOK";
	public pageKeyLoginKakao:string="LOG_IN_KAKAO";
	public pageKeyLoginNaver:string="LOG_IN_NAVER";
	public pageKeyPolicy:string="POLICY";

	public pageKeySignup:string="SIGNUP";

	constructor(	private us:UrlService, 
					private http: Http) {}

	logActionPage (pageKey:string): Promise<any> {
		if(null == pageKey || "" == pageKey) {
			return;
		}

		let req_url = this.us.get(this.apiLogActionPageUrl);
		req_url += "?pageKey=" + pageKey;

		this.http.get(req_url).toPromise().then().catch();
	}

	logActionDirtyWord (dirtyWord:string): Promise<any> {

		if(null == dirtyWord || "" == dirtyWord) {
			return;
		}

		// Need to implement!

		/*
		let req_url = this.us.get(this.apiLogActionPageUrl);
		req_url += "?dirtyWord=" + dirtyWord;

		this.http.get(req_url).toPromise().then().catch();
		*/
	}


	logError (pageKey:string): void {
		// Do something...
	}

}