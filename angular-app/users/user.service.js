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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var common_1 = require('@angular/common');
var UserService = (function () {
    function UserService(location, http) {
        this.location = location;
        this.http = http;
        this.usersUrl = '/CI/index.php/api/users/list';
        this.usersInsertUrl = '/CI/index.php/api/users/insert';
        this.usersUpdateUrl = '/CI/index.php/api/users/update';
        this.usersDeleteUrl = '/CI/index.php/api/users/delete';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
    }
    // Legacy - Mock Test
    /*
    getUsers(): Promise<User[]> {
        return this.http.get(this.usersUrl)
                   .toPromise()
                   .then(response => response.json().data as User[])
                   .catch(this.handleError);
    }
    */
    // New - XHR
    // promise-based
    UserService.prototype.getUsers = function () {
        return this.http.get(this.usersUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    // observable-based
    /*
    getUsers (): Observable<User[]> {
        return this.http.get(this.usersUrl)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
    */
    // promise-based
    UserService.prototype.addUser = function (name) {
        var body = JSON.stringify({ name: name });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.usersInsertUrl, body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    // observable-based
    /*
    addUser (name: string): Observable<User> {

        let body = JSON.stringify({ name });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.usersUrl, body, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
    */
    // Legacy - Mock Test
    /*
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    */
    // New - XHR
    // promise-based
    UserService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    };
    // observable-based
    /*
    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    */
    UserService.prototype.extractData = function (res) {
        var body = res.json();
        console.log("extractData / body ::: ", body);
        // console.log("extractData / body.data ::: ",body.data);
        return body.data || {};
    };
    UserService.prototype.getUser = function (id) {
        return this.getUsers().then(function (users) { return users.find(function (user) { return +user.id === id; }); });
    };
    UserService.prototype.update = function (user) {
        var url = this.usersUpdateUrl + "/" + user.id;
        // TODO - 파라미터 전송 전에 파라미터의 유효성 검증.
        // API KEY 설정 - 외부에서 curl등으로 배치 호출로 들어왔을 경우에 대한 방어.
        return this.http
            .post(url, JSON.stringify({ name: user.name }), { headers: this.headers })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.create = function (name) {
        // TODO - 파라미터 전송 전에 파라미터의 유효성 검증.
        return this.http
            .post(this.usersInsertUrl, JSON.stringify({ name: name }), { headers: this.headers })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.delete = function (id) {
        var url = this.usersDeleteUrl + "/" + id;
        return this.http.post(url, { headers: this.headers })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [common_1.Location, http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map