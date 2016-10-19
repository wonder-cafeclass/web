import { Component, OnInit }               from '@angular/core';
import { ActivatedRoute, Router, Params }  from '@angular/router';

import { Observable }                      from 'rxjs/Observable';
import { Subject }                         from 'rxjs/Subject';

import { KlassService }                    from './klass.service';
import { CClassSearchService }             from './cclass-search.service';
import { CClass }                          from './cclass';
import { KlassKeyword }                    from './klass-keyword';

import { KlassLevel }                      from './klass-level';
import { KlassStation }                    from './klass-station';
import { KlassDay }                        from './klass-day';
import { KlassTime }                        from './klass-time';

@Component({
  moduleId: module.id,
  styleUrls: ['cclass-list.component.css'],
  templateUrl: 'cclass-list.component.html',
  providers: [CClassSearchService]
})
export class CClassListComponent implements OnInit {

  cclasses: CClass[];
  public selectedId: number;

  // Search
  // TODO - 검색 관련 
  klassKeywords: Observable<KlassKeyword[]>;

  // 검색상태 관련
  isEnableSearch: boolean = false;

  private searchTerms = new Subject<string>();

  constructor(
    private cclassSearchService: CClassSearchService,
    private service: KlassService,
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

  ngOnInit(): void {

    // get class list
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['id'];
      this.service.getCClasses().then(cclasses => this.cclasses = cclasses);
    });

    // search class with keyword
    // @ referer : http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
    this.klassKeywords = 
    this.searchTerms
    .debounceTime(300)
    .distinctUntilChanged()
    .switchMap(
      term => term?this.cclassSearchService.search(term):Observable.of<KlassKeyword[]>([])
    )
    .catch(error => {
      // TODO: real error handling
      console.log(error);
      return Observable.of<KlassKeyword[]>([]);
    })
    ;
  }

  onChangedSelectile(selectiles:any[]) {

    for (var i = 0; i < selectiles.length; ++i) {
      let selectile = selectiles[i];
      if(selectile instanceof KlassLevel) {

        console.log("HERE! / onChangedSelectile / level / selectile ::: ",selectile);

      } else if(selectile instanceof KlassStation) {

        console.log("HERE! / onChangedSelectile / station / selectile ::: ",selectile);

      } else if(selectile instanceof KlassDay) {

        console.log("HERE! / onChangedSelectile / day / selectile ::: ",selectile);

      } else if(selectile instanceof KlassTime) {

        console.log("HERE! / onChangedSelectile / time / selectile ::: ",selectile);

      }
    }

  }


  onSelectKlass(cclass: CClass) {

    // 유저가 수업을 선택했습니다.
    // 수업 상세 페이지로 이동해야 합니다.
    console.log("TEST / onSelectKlass / cclass :: ",cclass);
    // Navigate with relative link
    // this.router.navigate([cclass.id], { relativeTo: this.route });
  }

}
