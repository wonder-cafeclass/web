import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User }			from './user';
import { Observable }	from 'rxjs/Observable';
import { Location } 	from '@angular/common';

@Injectable()
export class UserService {

	private usersUrl = 'api/users';  // URL to web api
	private locationPath = "";

	constructor(
		private location:Location,
		private http: Http) {

		this.locationPath = this.location.path();
	}

	getRelativeUrl(targetUrl):string{
		return this.locationPath + "/" +  targetUrl;
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

		let relativePath = this.getRelativeUrl(this.usersUrl);

		return this.http.get(relativePath)
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
		return this.http.post(this.usersUrl, body, options)
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
		return body.data || { };
	}





	getUser(id: number): Promise<User> {
		return this.getUsers().then(users => users.find(user => user.id === id));
	}

	private headers = new Headers({'Content-Type': 'application/json'});

	update(user: User): Promise<User> {
	  const url = `${this.usersUrl}/${user.id}`;
	  return this.http
	    .put(url, JSON.stringify(user), {headers: this.headers})
	    .toPromise()
	    .then(() => user)
	    .catch(this.handleError);
	}

	create(name: string): Promise<User> {
	  return this.http
	    .post(this.usersUrl, JSON.stringify({name: name}), {headers: this.headers})
	    .toPromise()
	    .then(res => res.json().data)
	    .catch(this.handleError);
	}

	delete(id: number): Promise<void> {
		const url = `${this.usersUrl}/${id}`;
		return this.http.delete(url, {headers: this.headers})
		.toPromise()
		.then(() => null)
		.catch(this.handleError);
	}



}
