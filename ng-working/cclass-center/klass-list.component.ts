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
  styleUrls: ['klass-list.component.css'],
  templateUrl: 'klass-list.component.html',
  providers: [CClassSearchService]
})
export class KlassListComponent implements OnInit {

  cclasses: CClass[];
  public selectedId: number;

  // Search
  // TODO - 검색 관련 
  klassKeywords: Observable<KlassKeyword[]>;

  // 검색상태 관련
  isSearchEnabled: boolean = false;

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

  search(selectileList, searchKeyword:string): void {

    if(!this.isSearchEnabled) {
      return;
    }

    // wonder.jung
    console.log("search / selectileList :: ",selectileList);
    console.log("search / searchKeyword :: ",searchKeyword);

    // 항목별 filter 만들기
    var level = "";
    var station = "";
    var day = "";
    var time = "";

    for (var i = 0; i < selectileList.length; ++i) {
      let selectile = selectileList[i];
      if(selectile instanceof KlassLevel) {
        level = selectile.key;
      } else if(selectile instanceof KlassStation) {
        station = selectile.key;
      } else if(selectile instanceof KlassDay) {
        day = selectile.key;
      } else if(selectile instanceof KlassTime) {
        time = selectile.key;
      }
    }

    // keyword 안전성 검사 및 param 만들기(구분자추가)

    var q = "";

    this.service.searchKlassList(
      // level:string, 
      level,
      // station:string, 
      station,
      // day:string, 
      day,
      // time:string,
      time, 
      // q:string
      q
    ).then(cclasses => {
        console.log("cclasses ::: ",cclasses);
       this.cclasses = cclasses 

       // 검색 결과가 돌아오면 검색 버튼이 비활성화.
       // 유저는 자신이 선택한 필터가 유지되기를 원할까? --> 사용성 테스트
    });

  }
  onChangedSelectile(selectiles:any[]) {
    // 유저가 검색 필드를 변경한 상태입니다. Search 돋보기 버튼이 활성화 되어야 합니다.
    this.isSearchEnabled = true;
  }
  onKeyupSearch(keyword:string) {

    if(null === keyword || "" === keyword) {
      return;
    }

    // 2글자 이상이어야 유효한 단어

    // 최소 한단어 이상이어야 함.

    // 1. 단어 분할로 제목 검색.

    // 사용자가 입력한 단어를 공백 단위로 분할.

    // 2. 제목과 설명은 최대 3개 단어 조합으로 검색. 그 이상은 무리가 있음.

    // 검색 결과가 많을 경우, 스크롤로 더 보여줄 수 있어야 함. 
    // 검색 결과는 최초 10개만 보여줌.

    console.log("onKeyupSearch / keyword ::: ",keyword);

    // 유저가 검색어를 입력한 상태. 유효한 키워드라면, 검색 버튼을 활성화 해줍니다.
    if(!this.isSearchEnabled) {
      this.isSearchEnabled = true;
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
