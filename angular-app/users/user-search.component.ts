import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { UserSearchService } from './user-search.service';
import { User } from './user';
@Component({
  // moduleId: module.id,
  selector: 'user-search',
  templateUrl: 'user-search.component.html',
  styleUrls: [ 'user-search.component.css' ],
  providers: [UserSearchService]
})
export class UserSearchComponent implements OnInit {

  users: Observable<User[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private userSearchService: UserSearchService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
  
  ngOnInit(): void {
    this.users = this.searchTerms
      .debounceTime(300)        // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time
        // return the http search observable
        ? this.userSearchService.search(term)
        // or the observable of empty useres if no search term
        : Observable.of<User[]>([]))
      .catch(error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<User[]>([]);
      });
  }
  gotoDetail(user: User): void {
    let link = ['/detail', user.id];
    this.router.navigate(link);
  }
}
