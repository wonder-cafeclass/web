import { Component, OnInit }               from '@angular/core';
import { ActivatedRoute, Router, Params }  from '@angular/router';

import { CClassService }                   from './cclass.service';
import { CClassSearchService }             from './cclass-search.service';
import { CClass }                          from './cclass';

import { Observable }                      from 'rxjs/Observable';
import { Subject }                         from 'rxjs/Subject';

@Component({
  styleUrls: ['./ng-working/cclass-center/cclass-list.component.css'],
  templateUrl: './ng-working/cclass-center/cclass-list.component.html'
  // ,
  // providers: [CClassSearchService]
})
export class CClassListComponent implements OnInit {

  cclasses: CClass[];
  public selectedId: number;

  // Search
  cclassesObservable: Observable<CClass[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private cclassSearchService: CClassSearchService,
    private service: CClassService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  isSelected(cclass: CClass): boolean {
    return cclass.id === this.selectedId;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {

    /*
    // get class list
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['id'];
      this.service.getCClasses()
        .then(cclasses => this.cclasses = cclasses);
    });
    */

    // search class with keyword
    // @ referer : http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
    this.cclassesObservable = 
    this.searchTerms
    .debounceTime(300)
    .distinctUntilChanged()
    .subscribe(
      // TEST
      // value => console.log('Received new subject value: ',value)

      // term => term   
      // // return the http search observable
      // ? this.cclassSearchService.search(term)
      // // or the observable of empty useres if no search term
      // : Observable.of<CClass[]>([])

      term => term
      // return the http search observable
      ? this.cclassSearchService.search(term)
      // or the observable of empty useres if no search term
      : Observable.of<CClass[]>([]),
      err => {
          // this.uiStateStore.endBackendAction();

          // handling errors.
      }      
    )

    /*
    this.searchTerms
    .debounceTime(300)        // wait for 300ms pause in events
    .distinctUntilChanged()   // ignore if next search term is same as previous
    .switchMap(
      this.test

      // // switch to new observable each time
      // term => term   
      // // return the http search observable
      // ? this.cclassSearchService.search(term)
      // // or the observable of empty useres if no search term
      // : Observable.of<CClass[]>([])
    )
    .catch(error => {
      // TODO: real error handling
      console.log(error);
      return Observable.of<CClass[]>([]);
    });
    */

  }

  test(term: string, index:number): Observable<CClass[]> {

    console.log("TEST / term ::: ",term);
    console.log("TEST / index ::: ",index);

    return Observable.of<CClass[]>([]);

  }


  // Legacy
  /*
  onSelect(cclass: CClass) {
    this.selectedId = cclass.id;

    // Navigate with relative link
    // this.router.navigate([cclass.id], { relativeTo: this.route });
  }
  */

}
