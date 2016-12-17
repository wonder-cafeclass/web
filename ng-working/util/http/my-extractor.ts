import { Response } 			from '@angular/http';

import { MyResponse }			from '../model/my-response';

/*
*	@ Desc : API 통신에서 돌아온 response에 대해 처리하는 클래스
*
*/

export class MyExtractor {
	constructor() {}

	public extractData(res: Response) :MyResponse{

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
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

		let myResponse:MyResponse = null;
		if(hasJsonString(res)) {

			if(isDebug) console.log("my-extractor / extractData / 1-1. body string이 json object인 경우.");

			let jsonObj = getJson(res);

			if(	null != jsonObj && 
				null != jsonObj["success"] && 
				null != jsonObj["message"] ) {

				// wonder.jung - 에러 정보 넘어오지 않음.

				myResponse = 
				new MyResponse(
					// public success:boolean
					jsonObj["success"],
					// public message:string
					jsonObj["message"],
					// public query:string
					jsonObj["query"],
					// public error:string
					jsonObj["error"],
					// public data:any
					jsonObj["data"],
					// public extra:any
					jsonObj["extra"]
				);
			}

			return myResponse;

		} else if(hasErrorHtml(res)){

			// let jsonObj = getJson(res);

			if(isDebug) console.log("my-extractor / extractData / 1-2. body string이 json object이 아니고, 에러 메시지 html일 경우.");
			// if(isDebug) console.log("my-extractor / extractData / jsonObj : ",jsonObj);

			myResponse = 
			new MyResponse(
				// public success:boolean
				false,
				// public message:string
				"",
				// public query:string
				"",
				// public error:string
				getErrorHtml(res),
				// public data:any
				null,
				// public extra:any
				res
			);			
			return myResponse;
			
		} else {

			if(isDebug) console.log("my-extractor / extractData / 1-3. 그 외의 경우.");
			return null;
			
		} // end if
	}

	public getMyResponseFromJSON(jsonObj:any) :MyResponse{

		let myResponse:MyResponse = null;

		if(	null != jsonObj && 
			null != jsonObj["success"] && 
			null != jsonObj["message"] ) {

			// wonder.jung - 에러 정보 넘어오지 않음.

			myResponse = 
			new MyResponse(
				// public success:boolean
				jsonObj["success"],
				// public message:string
				jsonObj["message"],
				// public query:string
				jsonObj["query"],
				// public error:string
				jsonObj["error"],
				// public data:any
				jsonObj["data"],
				// public extra:any
				jsonObj["extra"]
			);
		}

		return myResponse;		

	}

	public handleError (error: Response) :MyResponse{

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("my-extractor / handleError / 시작");
		if(isDebug) console.log("my-extractor / handleError / error : ",error);

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

		let myResponse:MyResponse = null;
		if(hasJsonString(error)) {
			// 에러 객체에서 에러 메시지를 뽑아냅니다.
			let jsonError = getJson(error);
			if(isDebug) console.log("my-extractor / handleError / jsonError : ",jsonError);

			myResponse = 
			new MyResponse(
				// public success:boolean
				false,
				// public message:string
				error["statusText"],
				// public query:string
				"",
				// public error:string
				"",
				// public data:any
				null,
				// public extra:any
				jsonError
			);			

		}
		else 
		{
			myResponse = 
			new MyResponse(
				// public success:boolean
				false,
				// public message:string
				error["statusText"],
				// public query:string
				"",
				// public error:string
				error["_body"],
				// public data:any
				null,
				// public extra:any
				null
			);	
		}

		return myResponse;

		// Legacy
		/*
		// 그 이외의 에러 상황. console에 노출합니다.

		// In a real world app, we might use a remote logging infrastructure
		// We'd also dig deeper into the error to get a better message
		let errMsg = (error.message) ? error.message :
		error.status ? `${error.status} - ${error.statusText}` : 'Server error';

		if(isDebug) console.log("my-extractor / handleError / errMsg : ",errMsg);

		return Promise.reject(errMsg);
		*/
	}



}