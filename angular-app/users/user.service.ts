import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User }			from './../user';
import { Observable }	from 'rxjs/Observable';
import { Location } 	from '@angular/common';

@Injectable()
export class UserService {

	private usersUrl = '/CI/index.php/api/users/list';
	private usersInsertUrl = '/CI/index.php/api/users/insert';
	private usersUpdateUrl = '/CI/index.php/api/users/update';
	private usersDeleteUrl = '/CI/index.php/api/users/delete';

	constructor(
		private location:Location,
		private http: Http) {
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
	getUsers (): Promise<User[]> {
		return this.http.get(this.usersUrl)
		              .toPromise()
		              .then(this.extractData)
		              .catch(this.handleError);
	}	
	// observable-based
	/*
	getUsers (): Observable<User[]> {
		return this.http.get(this.usersUrl)
		                .map(this.extractData)
		                .catch(this.handleError);
	}
	*/
	// promise-based
	addUser (name: string): Promise<User> {
		let body = JSON.stringify({ name });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(this.usersInsertUrl, body, options)
		         .toPromise()
		         .then(this.extractData)
		         .catch(this.handleError);
	}
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
	private handleError (error: any) {
		// In a real world app, we might use a remote logging infrastructure
		// We'd also dig deeper into the error to get a better message
		let errMsg = (error.message) ? error.message :
		error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.error(errMsg); // log to console instead
		return Promise.reject(errMsg);
	}	
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
	private extractData(res: Response) {
		let body = res.json();

		console.log("extractData / body ::: ",body);
		// console.log("extractData / body.data ::: ",body.data);

		return body.data || { };
	}





	getUser(id: number): Promise<User> {
		return this.getUsers().then(users => users.find(user => +user.id === id));
	}

	private headers = new Headers({'Content-Type': 'application/json'});

	update(user: User): Promise<User> {

		let url = `${this.usersUpdateUrl}/${user.id}`;

		// TODO - 파라미터 전송 전에 파라미터의 유효성 검증.
		// API KEY 설정 - 외부에서 curl등으로 배치 호출로 들어왔을 경우에 대한 방어.

		return this.http
				.post(url, JSON.stringify({name: user.name}), {headers: this.headers})
				.toPromise()
				.then(this.extractData)
				.catch(this.handleError);
	}

	create(name: string): Promise<User> {

		// TODO - 파라미터 전송 전에 파라미터의 유효성 검증.

		return this.http
			    .post(this.usersInsertUrl, JSON.stringify({name: name}), {headers: this.headers})
			    .toPromise()
			    .then(this.extractData)
			    .catch(this.handleError);
	}

	delete(id: number): Promise<void> {
		let url = `${this.usersDeleteUrl}/${id}`;

		return this.http.post(url, {headers: this.headers})
				.toPromise()
				.then(this.extractData)
				.catch(this.handleError);
	}



}
