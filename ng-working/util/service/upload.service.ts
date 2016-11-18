import { NgModule }       from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Injectable }     from '@angular/core';

@Injectable()
export class UploadService {
    constructor () {
        /*
        this.progress$ = Observable.create(observer => {
            this.progressObserver = observer
        }).share();
        */
    }

    private makeFileRequest (url: string, params: string[], files: File[]): Observable<any> {
        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            // TEST / 1개의 파일만 전송합니다.
            if(null != files && 1 == files.length) {

                console.log("TEST / filename / ",files[0].name);

                formData.append("userfile", files[0], files[0].name);
            }

            /*
            for (let i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
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

                this.progressObserver.next(this.progress);
            };
            */

            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }
}