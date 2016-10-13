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
  // TODO - 검색 관련 
  klassKeywords: Observable<KlassKeyword[]>;

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
      term => term?this.cclassSearchService.search(term):Observable.of<KlassKeyword[]>([])
    )
    .catch(error => {
      // TODO: real error handling
      console.log(error);
      return Observable.of<KlassKeyword[]>([]);
    })
    ;

    // 요걸 한번에 해결하는 API를 호출하자!

    // 모든 레벨의 key를 가져온다.
    // 모든 레벨의 이미지 주소를 가져온다.

    // 모든 역의 key를 가져온다.
    // 모든 역의 이미지 주소를 가져온다.

    // 모든 요일의 key를 가져온다.
    // 모든 요일의 이미지 주소를 가져온다.

    // 모든 시간의 key를 가져온다.
    // 모든 시간의 이미지 주소를 가져온다.

  }

  // TODO 수업을 입력하는 방법을 제공해야 함. 첫번째 칸은 수업 입력칸으로 둠.(서비스 페이지에서는 노출되지 않음.)

  changeLevel() :void {
    console.log("TEST / changeLevel");

    // 레벨이 변경된다.
    // 변경된 레벨에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!
  }

  changeStation() :void {
    console.log("TEST / changeStation");

    // 지하철 역이 변경된다.
    // 변경된 지하철 역에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!
  }

  changeDay() :void {
    console.log("TEST / changeDay");

    // 수업 요일이 변경된다.
    // 변경된 수업 요일에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!
  }

  changeTime() :void {
    console.log("TEST / changeTime");

    // 수업 시간이 변경된다.
    // 변경된 수업 시간에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!
  }

  onSelectKlass(cclass: CClass) {

    // 유저가 수업을 선택했습니다.
    // 수업 상세 페이지로 이동해야 합니다.
    console.log("TEST / onSelectKlass / cclass :: ",cclass);

    // Navigate with relative link
    // this.router.navigate([cclass.id], { relativeTo: this.route });
  }

}
