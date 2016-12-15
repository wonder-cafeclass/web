"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Observable_1 = require('rxjs/Observable');
var core_1 = require('@angular/core');
var UploadService = (function () {
    function UploadService() {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }
    // makeFileRequest (url: string, params: string[], files: File[]): Observable<any> {
    UploadService.prototype.makeFileRequest = function (url, paramsObj, files) {
        return Observable_1.Observable.create(function (observer) {
            var formData = new FormData(), xhr = new XMLHttpRequest();
            // 1개의 파일만 전송합니다.
            if (null != files && 1 == files.length) {
                formData.append("userfile", files[0], files[0].name);
            }
            // 파라미터 전달
            for (var key in paramsObj) {
                var value = paramsObj[key];
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
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    }
                    else {
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
    };
    UploadService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], UploadService);
    return UploadService;
}());
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map