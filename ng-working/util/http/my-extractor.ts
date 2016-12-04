import { Response } 			from '@angular/http';

/*
*	@ Desc : API 통신에서 돌아온 response에 대해 처리하는 클래스
*
*/

export class MyExtractor {
	constructor() {}

	public extractData(res: Response) :any{

		let isDebug:boolean = true;
		// let isDebug:boolean = false;
		if(isDebug) console.log("my-extractor / extractData / 시작");
		if(isDebug) console.log("my-extractor / extractData / res : ",res);
		

		function isJsonString(str:string) {

			if(null == str || "" == str) {
				return false;
			}

		    try {
		        JSON.parse(str);
		    } catch (e) {
		        return false;
		    }
		    return true;
		}		

		function hasJsonString(res: Response) :boolean{
			let bodyStr:string = "";
			if(null != res && null != res["_body"]) {
				bodyStr = res["_body"];
			}

			if(isJsonString(bodyStr)) {
				return true;
			}

			return false;
		}

		function getJson(res: Response) :any{
			if(null == res) {
				return null;
			}

			return res.json();
		}

		function isErrorHtml(str:string) {

			// Do something...
	        let matchArr:RegExpMatchArray = str.match(/^\<.+\>$/gi);
	        if(null != matchArr && 2 == matchArr.length) {

	        }


			return true;
		}	

		function hasErrorHtml(res: Response) :boolean {

			let bodyStr:string = "";
			if(null != res && null != res["_body"]) {
				bodyStr = res["_body"];
			}

			if(isErrorHtml(bodyStr)) {
				return true;
			}

			return false;
		}

		function getErrorHtml(res: Response) :string {

			let bodyStr:string = "";
			if(null != res && null != res["_body"]) {
				bodyStr = res["_body"];
			}

			return bodyStr;
		}		

		if(hasJsonString(res)) {

			if(isDebug) console.log("my-extractor / extractData / 1-1. body string이 json object인 경우.");
			let json = getJson(res);

			let data = null;
			if(null != json && null != json["data"]) {
				data = json["data"];
			}
			return data;
			
		} else if(hasErrorHtml(res)){

			if(isDebug) console.log("my-extractor / extractData / 1-2. body string이 json object이 아니고, 에러 메시지 html일 경우.");
			return getErrorHtml(res);
			
		} else {

			if(isDebug) console.log("my-extractor / extractData / 1-3. 그 외의 경우.");
			return null;
			
		} // end if
	}

	public handleError (error: any) {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-extractor / handleError / 시작");

		// In a real world app, we might use a remote logging infrastructure
		// We'd also dig deeper into the error to get a better message
		let errMsg = (error.message) ? error.message :
		error.status ? `${error.status} - ${error.statusText}` : 'Server error';

		if(isDebug) console.log("my-extractor / handleError / errMsg : ",errMsg);

		// console.error(errMsg); // log to console instead
		// TODO - 에러 내용을 저장해 두어야 합니다.

		return Promise.reject(errMsg);
	}



}