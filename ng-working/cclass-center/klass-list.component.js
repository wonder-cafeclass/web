"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var Observable_1 = require('rxjs/Observable');
var Subject_1 = require('rxjs/Subject');
var klass_service_1 = require('./klass.service');
var cclass_search_service_1 = require('./cclass-search.service');
var KlassListComponent = (function () {
    function KlassListComponent(cclassSearchService, service, route, router) {
        this.cclassSearchService = cclassSearchService;
        this.service = service;
        this.route = route;
        this.router = router;
        // 검색상태 관련
        this.isSearchEnabled = false;
        this.searchTerms = new Subject_1.Subject();
        // EVENT
        this.isOverMagnifier = false;
    }
    KlassListComponent.prototype.isSelected = function (cclass) {
        return cclass.id === this.selectedId;
    };
    KlassListComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get class list
        this.route.params.forEach(function (params) {
            _this.selectedId = params['id'];
            _this.service.getCClasses().then(function (cclasses) { return _this.cclasses = cclasses; });
        });
        // search class with keyword
        // @ referer : http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
        this.klassKeywords =
            this.searchTerms
                .debounceTime(300)
                .distinctUntilChanged()
                .switchMap(function (term) { return term ? _this.cclassSearchService.search(term) : Observable_1.Observable.of([]); })
                .catch(function (error) {
                // TODO: real error handling
                console.log(error);
                return Observable_1.Observable.of([]);
            });
    };
    // REMOVE ME
    /*
      clickSearch(selectileList, searchKeyword:string): void {
    
        if(!this.isSearchEnabled) {
          return;
        }
    
        let klassLevel:KlassLevel;
        let klassStation:KlassStation;
        let klassDay:KlassDay;
        let klassTime:KlassTime;
    
        for (var i = 0; i < selectileList.length; ++i) {
          let selectile = selectileList[i];
          if(selectile instanceof KlassLevel) {
    
            klassLevel = selectile;
            
          } else if(selectile instanceof KlassStation) {
    
            klassStation = selectile;
    
          } else if(selectile instanceof KlassDay) {
    
            klassDay = selectile;
    
          } else if(selectile instanceof KlassTime) {
    
            klassTime = selectile;
    
          } // end if
        } // end for
        
        this.search(
          klassLevel,
          klassStation,
          klassDay,
          klassTime,
          searchKeyword
        );
      }
    */
    KlassListComponent.prototype.onInitKlassFilterTile = function (searchBox) {
        console.log("TEST / 002");
        searchBox.focus();
    };
    KlassListComponent.prototype.search = function (level, station, day, time, searchKeyword) {
        var _this = this;
        // 항목별 filter 만들기
        var levelKey = "";
        if (null != level && null != level.key) {
            levelKey = level.key;
        }
        var stationKey = "";
        if (null != station && null != station.key) {
            stationKey = station.key;
        }
        var dayKey = "";
        if (null != day && null != day.key) {
            dayKey = day.key;
        }
        var timeKey = "";
        if (null != time && null != time.key) {
            timeKey = time.key;
        }
        // wonder.jung
        // keyword 안전성 검사 및 param 만들기(구분자추가)
        // TEST
        var keywordList = searchKeyword.split(" ");
        var searchKeywordSafe = "";
        for (var i = 0; i < keywordList.length; ++i) {
            var keyword = keywordList[i];
            var keywordSafe = this.getKeywordSafe(keyword);
            if (null == keywordSafe || "" === keywordSafe) {
                continue;
            }
            searchKeywordSafe += keywordSafe + "|";
        }
        this.service.searchKlassList(
        // level:string, 
        levelKey, 
        // station:string, 
        stationKey, 
        // day:string, 
        dayKey, 
        // time:string,
        timeKey, 
        // q:string
        searchKeywordSafe).then(function (cclasses) {
            console.log("cclasses ::: ", cclasses);
            _this.cclasses = cclasses;
        });
    };
    KlassListComponent.prototype.onMouseenterMagnifier = function () {
        if (!this.isSearchEnabled) {
            return;
        }
        if (!this.isOverMagnifier) {
            this.isOverMagnifier = true;
        }
    };
    KlassListComponent.prototype.onMouseleaveMagnifier = function () {
        if (!this.isSearchEnabled) {
            return;
        }
        if (this.isOverMagnifier) {
            this.isOverMagnifier = false;
        }
    };
    KlassListComponent.prototype.onChangedSelectile = function (selectiles) {
        // 유저가 검색 필드를 변경한 상태입니다. Search 돋보기 버튼이 활성화 되어야 합니다.
        // this.isSearchEnabled = true;
        if (null == selectiles || 0 === selectiles.length) {
            // error report
            console.log("!Error! / onChangedSelectile");
            return;
        }
        console.log("onChangedSelectile / selectiles : ", selectiles);
        // 유저가 검색 필드를 변경하면 변경된 값으로 리스트가 업데이트 됩니다.
        // this.search(selectiles, "");
    };
    KlassListComponent.prototype.onClickSearchInput = function (event, searchBox) {
        event.stopPropagation();
        // 시각적으로 보이는 검색창 영역을 클릭하면 focus되도록 해준다.
        searchBox.focus();
    };
    KlassListComponent.prototype.onMouseLeaveSearchInput = function (event, searchBox) {
        event.stopPropagation();
        this.onMouseleaveMagnifier();
    };
    KlassListComponent.prototype.onKeyupEnterSearch = function (keywordsFromUser, searchBox, selectile) {
        var keywordsSafe = this.getKeywordSafe(keywordsFromUser);
        if (keywordsFromUser.length !== keywordsSafe.length) {
            searchBox.value = keywordsSafe;
        }
        var selectileList = null;
        console.log("onKeyupEnterSearch / selectile :: ", selectile);
        this.search(selectile.klassLevelSelected, selectile.klassStationSelected, selectile.klassTimeSelected, selectile.klassDaySelected, searchBox.value);
        // REMOVE ME
        /*
        this.clickSearch(
          selectile.klassLevelSelected,
          selectile.klassStationSelected,
          selectile.klassTimeSelected,
          selectile.klassDaySelected,
          keywordsFromUser
        );
        */
        // wonder.jung
        // this.clickSearch(selectileList, keywordsFromUser);
    };
    KlassListComponent.prototype.isSafeSelectile = function (selectile) {
        if (null == selectile) {
            // error report
            console.log("error report / null == selectile");
            return false;
        }
        else if (null == selectile.klassDays) {
            // error report
            console.log("error report / null == selectile.klassDays");
            return false;
        }
        else if (null == selectile.klassLevels) {
            // error report
            console.log("error report / null == selectile.klassLevels");
            return false;
        }
        else if (null == selectile.klassStations) {
            // error report
            console.log("error report / null == selectile.klassStations");
            return false;
        }
        else if (null == selectile.klassTimes) {
            // error report
            console.log("error report / null == selectile.klassTimes");
            return false;
        }
        return true;
    };
    KlassListComponent.prototype.setKeywordMap = function (selectile) {
        if (!this.isSafeSelectile(selectile)) {
            return;
        }
        else if (null != this.keywordMap) {
            return;
        }
        this.keywordMap = {};
        var klassDays = selectile.klassDays;
        for (var i = 0; i < klassDays.length; ++i) {
            var curObj = klassDays[i];
            this.keywordMap[curObj.name_kor] = curObj;
            this.keywordMap[curObj.name_eng] = curObj;
        }
        var klassLevels = selectile.klassLevels;
        for (var i = 0; i < klassLevels.length; ++i) {
            var curObj = klassLevels[i];
            this.keywordMap[curObj.name_kor] = curObj;
            this.keywordMap[curObj.name_eng] = curObj;
        }
        var klassStations = selectile.klassStations;
        for (var i = 0; i < klassStations.length; ++i) {
            var curObj = klassStations[i];
            this.keywordMap[curObj.name_kor] = curObj;
            this.keywordMap[curObj.name_eng] = curObj;
        }
        var klassTimes = selectile.klassTimes;
        for (var i = 0; i < klassTimes.length; ++i) {
            var curObj = klassTimes[i];
            this.keywordMap[curObj.name_kor] = curObj;
            this.keywordMap[curObj.name_eng] = curObj;
        }
    };
    KlassListComponent.prototype.searchKeywordMap = function (keyword) {
        if (!this.keywordMap) {
            return;
        }
        if (!(1 < keyword.length)) {
            // 대조하는 글자는 2글자 이상이어야 한다.
            return;
        }
        var selectileObj = null;
        for (var key in this.keywordMap) {
            var keyNoEmpty = key.replace(" ", "");
            var isOK = false;
            if (2 == keyNoEmpty.length && 2 == keyword.length) {
                isOK = true;
            }
            else if (2 < keyNoEmpty.length && (keyNoEmpty.length - 1) == keyword.length) {
                isOK = true;
            }
            if (!isOK) {
                continue;
            }
            if (0 === keyNoEmpty.indexOf(keyword)) {
                // 첫글자부터 시작, 2글자 이상 매칭되는 경우만 허용.(공백은 제거합니다.)
                selectileObj = this.keywordMap[key];
                break;
            } // end if
        } // end for
        return selectileObj;
    };
    KlassListComponent.prototype.getKeywordSafe = function (keyword) {
        var regex = new RegExp("[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\\x20]+", "gi");
        var keywordsSafe = keyword.replace(regex, "");
        return keywordsSafe;
    };
    KlassListComponent.prototype.onKeyupSearchInput = function (keywordsFromUser, searchBox, selectile) {
        // TODO 입력 가능하지 않은 문자는 검색 창에서 사라짐. - 유저에게 안내 필요.
        var keywordsSafe = this.getKeywordSafe(keywordsFromUser);
        if (keywordsFromUser.length !== keywordsSafe.length) {
            searchBox.value = keywordsSafe;
        }
        if (null === keywordsFromUser || "" === keywordsFromUser || keywordsFromUser.length < 2) {
            // 공백 및 1글자 입력은 처리하지 않습니다.
            return;
        }
        else if (!this.isSafeSelectile(selectile)) {
            return;
        }
        // 이전과 동일한 내용이라면 중단한다.
        if (null != this.keywordsFromUserPrev &&
            this.keywordsFromUserPrev === keywordsFromUser) {
            return;
        }
        // 다르다면 키워드를 등록.
        this.keywordsFromUserPrev = keywordsFromUser;
        this.setKeywordMap(selectile);
        // 안전한 문자열만 받습니다. 
        // 허용 문자열은 알파벳,한글,숫자입니다. 
        // 특수문자는 검색어로 허용하지 않습니다.
        var keywordList = keywordsFromUser.split(" ");
        var keywordListSafe = [];
        for (var i = 0; i < keywordList.length; ++i) {
            var keyword = keywordList[i];
            var keywordSafe = this.getKeywordSafe(keyword);
            if (null == keywordSafe || "" === keywordSafe) {
                continue;
            }
            keywordListSafe.push(keywordSafe);
        }
        if (null == keywordListSafe || !(0 < keywordListSafe.length)) {
            return;
        }
        // 유효한 검색 키워드를 찾았습니다.
        // 검색 키워드인 selectile 데이터에서 사용자가 입력한 키워드가 있는지 찾아봅니다.
        var selectileMatchList = [];
        var keywordFoundList = [];
        var keywordNotFoundList = [];
        for (var i = 0; i < keywordListSafe.length; ++i) {
            var keywordSafe = keywordListSafe[i];
            var selectileObj = this.searchKeywordMap(keywordSafe);
            if (null == selectileObj) {
                keywordNotFoundList.push(keywordSafe);
                continue;
            }
            selectileMatchList.push(selectileObj);
            keywordFoundList.push(keywordSafe);
        }
        // 필터와 매칭된 키워드를 selectile 리스트에 노출합니다.
        // 사용자가 입력한 키워드는 검색창에서 제외합니다.
        for (var i = 0; i < selectileMatchList.length; ++i) {
            var selectileMatch = selectileMatchList[i];
            selectile.klassSelectileSubject.next(selectileMatch);
            // 사용자가 입력 및 매칭된 키워드는 제거합니다.
            var keywordFound = keywordFoundList[i];
            searchBox.value = searchBox.value.replace(keywordFound, "");
        }
        // 필터와 매칭되지 않은 키워드는 "제목","설명"의 검색 키워드로 사용합니다.
        // 1개의 단어만 검색 키워드로 지원합니다. - 엔터키와 검색 버튼 click으로 진행.
        // 유저가 검색어를 입력한 상태. 유효한 키워드라면, 검색 버튼을 활성화 해줍니다.
        if (!this.isSearchEnabled) {
            this.isSearchEnabled = true;
        }
    };
    KlassListComponent.prototype.onSelectKlass = function (cclass) {
        // 유저가 수업을 선택했습니다.
        // 수업 상세 페이지로 이동해야 합니다.
        console.log("TEST / onSelectKlass / cclass :: ", cclass);
        // Navigate with relative link
        // this.router.navigate([cclass.id], { relativeTo: this.route });
    };
    KlassListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-list.component.css'],
            templateUrl: 'klass-list.component.html',
            providers: [cclass_search_service_1.CClassSearchService]
        }), 
        __metadata('design:paramtypes', [cclass_search_service_1.CClassSearchService, klass_service_1.KlassService, router_1.ActivatedRoute, router_1.Router])
    ], KlassListComponent);
    return KlassListComponent;
}());
exports.KlassListComponent = KlassListComponent;
//# sourceMappingURL=klass-list.component.js.map