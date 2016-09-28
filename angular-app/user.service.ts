import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';
import { USERS } from './mock-users';

@Injectable()
export class UserService {

	private usersUrl = 'app/users';  // URL to web api

	constructor(private http: Http) { }

	getUsers(): Promise<User[]> {
	return this.http.get(this.usersUrl)
	           .toPromise()
	           .then(response => response.json().data as User[])
	           .catch(this.handleError);
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

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}

}
