import { NgModule }       from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Injectable }     from '@angular/core';

@Injectable()
export class UploadService {

    // progress:Observable<T>;
    // progressObserver:Observable<T>;

    constructor () {
        
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
        
    }

    makeFileRequest (url: string, params: string[], files: File[]): Observable<any> {
        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            // 1개의 파일만 전송합니다.
            if(null != files && 1 == files.length) {
                formData.append("userfile", files[0], files[0].name);
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
                        observer.next(JSON.parse(xhr.response));
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