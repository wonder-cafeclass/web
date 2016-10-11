import { Injectable }     	from '@angular/core';
import { Http, Response } 	from '@angular/http';
import { Observable }		from 'rxjs';
import { CClass }           	from './cclass.service';

@Injectable()
export class CClassSearchService {
	constructor(private http: Http) {}
	search(term: string): Observable<CClass[]> {
	return this.http
	           .get(`CI/index.php/cclass/?name=${term}`)
	           .map((r: Response) => r.json().data as CClass[]);
	}
}