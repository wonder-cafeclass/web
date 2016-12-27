import { NgModule }       from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Injectable }     from '@angular/core';

import { MyExtractor }    from '../http/my-extractor';
import { MyRequest }      from '../http/my-request';
import { MyResponse }     from '../model/my-response';

@Injectable()
export class UploadService {

    // progress:Observable<T>;
    // progressObserver:Observable<T>;

    private myExtractor:MyExtractor;
    private myRequest:MyRequest;

    constructor () {

        this.myExtractor = new MyExtractor();
        
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
        
    }

    // makeFileRequest (url: string, params: string[], files: File[]): Observable<any> {
    makeFileRequest (url: string, paramsObj: any, files: File[]): Observable<any> {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("upload.service / makeFileRequest / 시작");

        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            // 1개의 파일만 전송합니다.
            if(null != files && 1 == files.length) {
                formData.append("userfile", files[0], files[0].name);
            }

            // 파라미터 전달
            for (var key in paramsObj) {
                let value = paramsObj[key];
                formData.append(key, value);
            }

            /*
            // 여러개의 파일을 전송할 경우
            for (let i = 0; i < files.length; i++) {
                formData.append(
                    // form input의 "name" attr에 해당. 서버측에서 이 이름으로 파일 객체를 받습니다.
                    "uploads[]", 
                    // 실제 파일 객체.
                    files[i], 
                    // 실제 파일의 이름.
                    files[i].name);
            }
            */

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        // wonder.jung
                        // my-response로 만듦.
                        if(isDebug) console.log("upload.service / makeFileRequest / xhr : ",xhr);
                        if(isDebug) console.log("upload.service / makeFileRequest / xhr.response : ",xhr.response);

                        // JSON 객체일 경우만 진행합니다.

                        let resJSON = JSON.parse(xhr.response);

                        if(isDebug) console.log("upload.service / makeFileRequest / resJSON : ",resJSON);

                        let myResponse:MyResponse = this.myExtractor.getMyResponseFromJSON(resJSON);

                        if(isDebug) console.log("upload.service / makeFileRequest / myResponse : ",myResponse);

                        observer.next(myResponse);
                        
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            /*
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);

                console.log("upload / this.progress : ",this.progress);

                this.progressObserver.next(this.progress);
            };
            */

            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }
}