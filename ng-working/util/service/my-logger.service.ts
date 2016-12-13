import { Injectable }		from '@angular/core';
import { Headers, 
		 Http, 
		 Response, 
		 RequestOptions } 	from '@angular/http';
import { UrlService } 		from "../../util/url.service";
import { MyExtractor }		from '../../util/http/my-extractor';


@Injectable()
export class MyLoggerService {

	private apiLogActionPageUrl:string = '/CI/index.php/api/log/page';
	private apiLogErrorUrl:string = '/CI/index.php/api/log/error';

	public pageTypeLogin:string="LOG_IN";
	public pageTypeLogout:string="LOG_OUT";
	public pageTypeLoginFacebook:string="LOG_IN_FACEBOOK";
	public pageTypeLoginKakao:string="LOG_IN_KAKAO";
	public pageTypeLoginNaver:string="LOG_IN_NAVER";
	public pageTypeKlassList:string="CLASS_LIST";
	public pageTypePolicy:string="POLICY";
	public pageTypeSignup:string="SIGNUP";
	public pageTypeSignupTeacher:string="SIGNUP_TEACHER";
	public pageTypeSignupSelect:string="SIGNUP_SELECT";
	public pageTypeMyInfo:string="MY_INFO";
	public pageTypeTeacherInfo:string="TEACHER_INFO";
	public pageTypeApplyTeacherTerm:string="APPLY_TEACHER_TERM";

	public errorTypeNotValidValue:string="NOT_VALID_VALUE";
	public errorTypeUnknownError:string="UNKNOWN_ERROR";
	public errorAPIFailed:string="API_FAILED";

	private myExtractor:MyExtractor;

	constructor(	private us:UrlService, 
					private http: Http) {
		this.myExtractor = new MyExtractor();
	}

	logActionPage (apiKey:string, pageType:string): Promise<any> {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-logger.service / logActionPage / 시작");

		if(null == apiKey || "" == apiKey) {
			if(isDebug) console.log("my-logger.service / logActionPage / 중단 / apiKey is not valid!");
			return Promise.resolve(null);
		}
		if(null == pageType || "" == pageType) {
			if(isDebug) console.log("my-logger.service / logActionPage / 중단 / pageType is not valid!");
			return Promise.resolve(null);
		}

	    // POST
	    let headers = new Headers(
	      { 
	        'Content-Type': 'application/json',
	        'Cafeclass-REST-API-Key': apiKey
	      }
	    );
	    let options = new RequestOptions({ headers: headers });
	    let req_url = this.us.get(this.apiLogActionPageUrl);

	    if(isDebug) console.log("my-logger.service / logActionPage / req_url : ",req_url);


	    let path:string = window.location.href;
	    if(isDebug) console.log("my-logger.service / logActionPage / path : ",path);

	    let params = 
	    {
	    	page_type:pageType,
	    	page_uri:path
	    }
	    ;

	    return this.http.post(req_url, params, options)
	            .toPromise()
				.then(this.myExtractor.extractData)
				.catch(this.myExtractor.handleError);

	}

	logActionDirtyWord (apiKey:string, dirtyWord:string): Promise<any> {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-logger.service / logActionDirtyWord / 시작");

		if(null == apiKey || "" == apiKey) {
			if(isDebug) console.log("my-logger.service / logActionDirtyWord / 중단 / apiKey is not valid!");
			return Promise.resolve(null);
		}
		if(null == dirtyWord || "" == dirtyWord) {
			if(isDebug) console.log("my-logger.service / logActionDirtyWord / 중단 / dirtyWord is not valid!");
			return Promise.resolve(null);
		}

		// Need to implement!

		/*
		let req_url = this.us.get(this.apiLogActionPageUrl);
		req_url += "?dirtyWord=" + dirtyWord;

		this.http.get(req_url).toPromise().then().catch();
		*/
	}


	logError (apiKey:string, errorType:string, errorMsg:string): Promise<any> {

	    // let isDebug:boolean = true;
	    let isDebug:boolean = false;
	    if(isDebug) console.log("my-logger.service / logError / 시작");
	    if(isDebug) console.log("my-logger.service / logError / apiKey : ",apiKey);
	    if(isDebug) console.log("my-logger.service / logError / errorType : ",errorType);
	    if(isDebug) console.log("my-logger.service / logError / errorMsg : ",errorMsg);

		if(null == apiKey || "" == apiKey) {
			if(isDebug) console.log("my-logger.service / logError / 중단 / apiKey is not valid!");
			return Promise.resolve(null);
		}
		if(null == errorType || "" == errorType) {
			if(isDebug) console.log("my-logger.service / logError / 중단 / errorType is not valid!");
			return Promise.resolve(null);
		}
		if(null == errorMsg || "" == errorMsg) {
			if(isDebug) console.log("my-logger.service / logError / 중단 / errorMsg is not valid!");
			return Promise.resolve(null);
		}

	    // POST
	    let headers = new Headers(
	      { 
	        'Content-Type': 'application/json',
	        'Cafeclass-REST-API-Key': apiKey
	      }
	    );
	    let options = new RequestOptions({ headers: headers });
	    let req_url = this.us.get(this.apiLogErrorUrl);

	    if(isDebug) console.log("my-logger.service / logError / req_url : ",req_url);

	    let params = {
	      api_key:apiKey,
	      error_type:errorType,
	      error_msg:errorMsg
	    }

	    return this.http.post(req_url, params, options)
	            .toPromise()
				.then(this.myExtractor.extractData)
				.catch(this.myExtractor.handleError);
	}

}