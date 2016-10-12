import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { CClassSearchService } from './cclass-search.service';
import { CClass } from './cclass';
@Component({
  // moduleId: module.id,
  selector: 'user-search',
  templateUrl: 'user-search.component.html',
  styleUrls: [ 'user-search.component.css' ],
  providers: [CClassSearchService]
})
export class UserSearchComponent implements OnInit {

  cclasses: Observable<CClass[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private cclassSearchService: CClassSearchService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
  
  ngOnInit(): void {
    this.cclasses = this.searchTerms
      .debounceTime(300)        // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time
        // return the http search observable
        ? this.cclassSearchService.search(term)
        // or the observable of empty useres if no search term
        : Observable.of<CClass[]>([]))
      .catch(error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<CClass[]>([]);
      });
  }
  gotoDetail(cclasses: CClass): void {
    // let link = ['/detail', user.id];
    // this.router.navigate(link);
  }
}
