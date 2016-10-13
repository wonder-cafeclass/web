import { Component, OnInit }               from '@angular/core';
import { ActivatedRoute, Router, Params }  from '@angular/router';

import { Observable }                      from 'rxjs/Observable';
import { Subject }                         from 'rxjs/Subject';

import { CClassService }                   from './cclass.service';
import { CClassSearchService }             from './cclass-search.service';
import { CClass }                          from './cclass';
import { KlassKeyword }                    from './klass-keyword';


@Component({
  styleUrls: ['./ng-working/cclass-center/cclass-list.component.css'],
  templateUrl: './ng-working/cclass-center/cclass-list.component.html',
  providers: [CClassSearchService]
})
export class CClassListComponent implements OnInit {

  cclasses: CClass[];
  public selectedId: number;

  // Search
  klassKeywords: Observable<KlassKeyword[]>;
  // klassKeywords: Observable<{}>;

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
    console.log("TEST / search / term :: ",term);
    this.searchTerms.next(term);
  }

  testSwitchMap(term: string, index:number): Observable<CClass[]> {

    console.log("testSwitchMap / term ::: ",term);
    console.log("testSwitchMap / index ::: ",index);

    return Observable.of<CClass[]>([]);

  }

  ngOnInit(): void {

    // get class list
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['id'];
      this.service.getCClasses()
        .then(cclasses => this.cclasses = cclasses);
    });

    // search class with keyword
    // @ referer : http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
    this.klassKeywords = 
    this.searchTerms
    .debounceTime(300)
    .distinctUntilChanged()
    .switchMap(
      // this.testSwitchMap
      term => term?this.cclassSearchService.search(term):Observable.of<KlassKeyword[]>([])
    )
    .catch(error => {
      // TODO: real error handling
      console.log(error);
      return Observable.of<KlassKeyword[]>([]);
    })
    ;

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
