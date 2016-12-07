import { Headers, RequestOptions }                  from '@angular/http';

/*
*	@ Desc : API Request에서 자주 쓰이는 패턴들을 모은 클래스.
*
*/

export class MyRequest {

	constructor() {}

	public getHeaderCafeclassAPI(apiKey:string) :Headers{

	    let headers:Headers = new Headers(
	      { 
	        'Content-Type': 'application/json',
	        'Cafeclass-REST-API-Key': apiKey
	      }
	    );

	    return headers;
	}

	public getReqOptionCafeclassAPI(apiKey:string) :RequestOptions{

		let headers:Headers = this.getHeaderCafeclassAPI(apiKey);

		let options:RequestOptions = new RequestOptions({ headers: headers });

		return options;
	}
}