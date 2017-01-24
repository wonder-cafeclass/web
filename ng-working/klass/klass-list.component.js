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
var klass_simple_service_1 = require('../widget/klass/service/klass-simple.service');
var klass_simple_1 = require('../widget/klass/model/klass-simple');
var pagination_1 = require('../widget/pagination/model/pagination');
var url_service_1 = require('../util/url.service');
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_array_1 = require('../util/helper/my-array');
var user_service_1 = require('../users/service/user.service');
var user_1 = require('../users/model/user');
var teacher_1 = require('../teachers/model/teacher');
var KlassListComponent = (function () {
    // private keywordMap;
    function KlassListComponent(ksService, urlService, userService, myLoggerService, watchTower, myCheckerService, route, router) {
        this.ksService = ksService;
        this.urlService = urlService;
        this.userService = userService;
        this.myLoggerService = myLoggerService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.route = route;
        this.router = router;
        // 검색상태 관련
        this.isSearchEnabled = false;
        this.isAdmin = false;
        this.hasInit = false;
        // EVENT
        this.isOverMagnifier = false;
        this.prevSelectileMap = null;
        this.myArray = new my_array_1.HelperMyArray();
        this.ksService.setWatchTower(this.watchTower);
        this.pagination = new pagination_1.Pagination();
    }
    KlassListComponent.prototype.isDebug = function () {
        // return true;
        return this.watchTower.isDebug();
    };
    KlassListComponent.prototype.isSelected = function (klass) {
        return klass.id === this.selectedId;
    };
    KlassListComponent.prototype.ngAfterViewInit = function () {
        this.asyncViewPack();
        this.subscribeLoginUser();
        this.subscribeLoginTeacher();
        // 홈화면인 수업 리스트에서는 상단 메뉴를 보여줍니다.
        this.watchTower.announceToggleTopMenu(true);
        this.watchTower.announceToggleFooter(true);
    };
    KlassListComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            _this.init();
        }); // end subscribe    
    };
    KlassListComponent.prototype.subscribeLoginUser = function () {
        var _this = this;
        // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
        this.watchTower.loginAnnounced$.subscribe(function (loginUser) {
            _this.loginUser = loginUser;
        }); // end service
    }; // end method
    KlassListComponent.prototype.subscribeLoginTeacher = function () {
        var _this = this;
        // 이미 들어온 선생님 정보가 있는지 확인합니다.
        this.loginTeacher = this.watchTower.getLoginTeacher();
        // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
        // Subscribe login user
        this.watchTower.loginTeacherAnnounced$.subscribe(function (loginTeacher) {
            // 로그인한 선생님 정보가 들어왔습니다.
            _this.loginTeacher = new teacher_1.Teacher().setJSON(loginTeacher);
        });
    };
    KlassListComponent.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdminServer();
        this.myCheckerService.setReady(
        // checkerMap:any
        this.watchTower.getCheckerMap(), 
        // constMap:any
        this.watchTower.getConstMap(), 
        // dirtyWordList:any
        this.watchTower.getDirtyWordList(), 
        // apiKey:string
        this.watchTower.getApiKey()); // end setReady
    };
    KlassListComponent.prototype.setLoginUser = function () {
        // 1. watch tower에게 직접 요청
        // 로그인 학생 데이터를 가져옵니다.
        var userJSON = this.watchTower.getLoginUser();
        var loginUser = null;
        if (null != userJSON) {
            loginUser = new user_1.User().setJSON(userJSON);
        }
        // 로그 아웃시 null 허용.
        this.loginUser = loginUser;
    };
    KlassListComponent.prototype.getLoginUserId = function () {
        var loginUser = this.watchTower.getLoginUser();
        var loginUserId = -1;
        if (null != loginUser) {
            loginUserId = loginUser.id;
        }
        return loginUserId;
    };
    KlassListComponent.prototype.logActionPage = function () {
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeKlassList).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
        }); // end service
    };
    KlassListComponent.prototype.init = function () {
        if (this.hasInit) {
            return;
        }
        this.hasInit = true;
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
        // 클래스 리스트 가져오기
        this.getKlassListOnInit();
    }; // end method
    // @ Desc : 초기화시 1번만 수업 리스트를 가져옴. 
    KlassListComponent.prototype.getKlassListOnInit = function () {
        if (this.myArray.isOK(this.klassList)) {
            // 이미 리스트가 있다면 로딩하지 않습니다.
            return;
        }
        // TODO - 선생님의 경우, 선생님 수업(오픈되지 않았더라도)이 처음 리스트에 위치해야 한다.
        this.fetchKlassList(
        // userId:Number, 
        this.getLoginUserId(), 
        // pageNum:number, 
        this.pagination.pageNum, 
        // pageRowCnt:number, 
        this.pagination.pageRowCnt, 
        // searchQuery:string, 
        "", 
        // klassStatus:string, /  E(Enrollment/모집),B(Begin/시작),C(Closed/마감),F(Finished/종료) - 4가지 상태의 수업을 가져와야 함.
        "E", 
        // klassLevel:string, 
        "", 
        // klassSubwayLine:string, 
        "", 
        // klassSubwayStation:string, 
        "", 
        // klassDays:string, 
        "", 
        // klassTime:string  
        "");
    }; // end method
    KlassListComponent.prototype.onInitKlassFilterTile = function (searchBox) {
        searchBox.focus();
    };
    KlassListComponent.prototype.updatePagination = function (jsonPagination) {
        if (null == jsonPagination) {
            this.pagination = new pagination_1.Pagination(); // 기본 값으로 설정
        }
        else {
            this.pagination = new pagination_1.Pagination().setJSON(jsonPagination);
        }
    };
    KlassListComponent.prototype.updateKlassList = function (jsonKlassList) {
        if (this.myArray.isNotOK(jsonKlassList)) {
            // 검색 결과가 없습니다.
            this.klassList = null;
        }
        else {
            var klassList = [];
            for (var i = 0; i < jsonKlassList.length; ++i) {
                var klassJSON = jsonKlassList[i];
                var klass = new klass_simple_1.KlassSimple().setJSON(klassJSON);
                klassList.push(klass);
            } // end for
            // 1. 스크롤로 추가적인 수업읇 보여준다면, 교체가 아닌 리스트에 덧붙이는 형식으로 표현.
            // 리스트 추가.
            // 2. 검색등으로 완전히 다른 리스트를 보여준다면, 교체.
            this.klassList = klassList; // 리스트 교체.
        } // end if
        this.updateFooter();
    }; // end method    
    KlassListComponent.prototype.updateFooter = function () {
        console.log("klass-list / TEST / updateFooter / this.watchTower : ", this.watchTower);
        // 푸터에게 업데이트 요청.
        this.watchTower.announceFooterUpdate();
    };
    KlassListComponent.prototype.fetchKlassList = function (loginUserId, pageNum, pageRowCnt, searchQuery, klassStatus, klassLevel, klassSubwayLine, klassSubwayStation, klassDays, klassTime) {
        var _this = this;
        this.ksService.fetchKlassList(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number, 
        loginUserId, 
        // pageNum:number, 
        this.pagination.pageNum, 
        // pageRowCnt:number, 
        this.pagination.pageRowCnt, 
        // searchQuery:string, 
        searchQuery, 
        // klassStatus:string,
        klassStatus, 
        // klassLevel:string,
        klassLevel, 
        // klassSubwayLine:string,
        klassSubwayLine, 
        // klassSubwayStation:string,
        klassSubwayStation, 
        // klassDays:string,
        klassDays, 
        // klassTime:string
        klassTime).then(function (myResponse) {
            if (myResponse.isSuccess() &&
                myResponse.hasDataProp("pagination") &&
                myResponse.hasDataProp("klass_list")) {
                // 1. Pagination 재설정
                var jsonPagination = myResponse.getDataProp("pagination");
                _this.updatePagination(jsonPagination);
                // 2. Klass List 재설정 
                var klassJSONList = myResponse.getDataProp("klass_list");
                _this.updateKlassList(klassJSONList);
            }
            else if (myResponse.isFailed()) {
                _this.watchTower.logAPIError("fetchKlassList has been failed!");
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
            } // end if
        }); // end service    
    }; // end method
    KlassListComponent.prototype.search = function (level, subwayLine, subwayStation, day, time, searchQuery) {
        // 항목별 filter 만들기
        var levelKey = "";
        if (null != level && null != level.key) {
            levelKey = level.getKeyNotDefault();
        }
        var subwayLineKey = "";
        if (null != subwayLine && null != subwayLine.key) {
            subwayLineKey = subwayLine.getKeyNotDefault();
        } // end if
        var subwayStationKey = "";
        if (null != subwayStation && null != subwayStation.key) {
            subwayStationKey = subwayStation.getKeyNotDefault();
        } // end if
        var dayKey = "";
        if (null != day && null != day.key) {
            dayKey = day.getKeyNotDefault();
        } // end if
        var timeKey = "";
        if (null != time && null != time.key) {
            timeKey = time.getKeyNotDefault();
        } // end if
        // 입력한 키워드중, 첫번째 단어만 검색에 사용합니다. 
        var keywordList = searchQuery.split(" ");
        var searchQuerySafe = "";
        if (this.myArray.isOK(keywordList)) {
            searchQuerySafe = keywordList[0];
        } // end if
        if (null == this.pagination) {
            this.pagination = new pagination_1.Pagination();
        }
        this.fetchKlassList(
        // userId:number, 
        this.getLoginUserId(), 
        // pageNum:number, 
        this.pagination.pageNum, 
        // pageRowCnt:number, 
        this.pagination.pageRowCnt, 
        // searchQuery:string, 
        searchQuerySafe, 
        // klassStatus:string, 
        "E", 
        // klassLevel:string, 
        levelKey, 
        // klassSubwayLine:string, 
        subwayLineKey, 
        // klassSubwayStation:string, 
        subwayStationKey, 
        // klassDays:string, 
        dayKey, 
        // klassTime:string  
        timeKey);
    }; // end method
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
    KlassListComponent.prototype.onChangedSelectile = function (selectileMap, searchBox) {
        // 유저가 검색 필드를 변경한 상태입니다. Search 돋보기 버튼이 활성화 되어야 합니다.
        this.isSearchEnabled = true;
        if (null == selectileMap) {
            // error report
            return;
        }
        this.search(selectileMap.level, selectileMap.subwayLine, selectileMap.subwayStation, selectileMap.day, selectileMap.time, searchBox.value);
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
        this.search(selectile.klassLevelSelected, selectile.klassSubwayLineSelected, selectile.klassSubwayStationSelected, selectile.klassDaySelected, selectile.klassTimeSelected, searchBox.value);
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
        else if (null == selectile.klassTimes) {
            // error report
            console.log("error report / null == selectile.klassTimes");
            return false;
        } // end if
        return true;
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
        if ("" === keywordsFromUser &&
            this.keywordsFromUserPrev !== keywordsFromUser) {
            // 공백일 경우는, 필터만을 이용해서 검색하는 것으로 가정합니다.
            this.keywordsFromUserPrev = keywordsFromUser;
            this.search(selectile.klassLevelSelected, selectile.klassSubwayLineSelected, selectile.klassSubwayStationSelected, selectile.klassDaySelected, selectile.klassTimeSelected, "");
            return;
        }
        if (null === keywordsFromUser || keywordsFromUser.length < 2) {
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
        var selectileMatchList = [];
        var keywordFoundList = [];
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
    KlassListComponent.prototype.onClickWishList = function (event, klass) {
        event.stopPropagation();
        event.preventDefault();
    };
    KlassListComponent.prototype.onSelectKlass = function (event, klass) {
        event.stopPropagation();
        event.preventDefault();
        var newClassId = -100;
        if (newClassId === +klass.id) {
            if (confirm("수업을 새로 만드시겠어요?")) {
                // 1. 새로운 클래스를 만든다.
                this.addNewKlass();
            } // end if
        }
        else if (0 < +klass.id) {
            this.gotoClassDetail(klass);
        } // end if
    }; // end method
    KlassListComponent.prototype.addNewKlass = function () {
        var _this = this;
        // 선생님인 경우에만 수업을 추가할 수 있습니다.
        if (null == this.loginUser) {
            return;
        }
        this.ksService.addKlassEmpty(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // teacherId:number,
        +this.loginTeacher.id, 
        // teacherResume:string,
        this.loginTeacher.resume, 
        // teacherGreeting:string
        this.loginTeacher.greeting).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (myResponse.isSuccess() && myResponse.hasDataProp("klass")) {
                var klass = new klass_simple_1.KlassSimple().setJSON(myResponse.getDataProp("klass"));
                if (null != klass) {
                    // 새로운 클래스가 등록되었습니다. 해당 수업 페이지로 이동합니다.
                    _this.gotoClassDetail(klass);
                } // end if
            }
            else if (myResponse.isFailed()) {
                if (null != myResponse.error) {
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                } // end if
                // 에러 로그 등록
                _this.watchTower.logAPIError("klass-list / addNewKlass / user_id : " + _this.loginUser.id);
            } // end if
        }); // end service
    }; // end method
    KlassListComponent.prototype.gotoClassDetail = function (klass) {
        // 수업 상세 페이지로 이동
        this.router.navigate(['/klass-detail/' + klass.id]);
    }; // end method
    KlassListComponent.prototype.onLoadFailClassImage = function (classImage, klassObj) {
        if (null != klassObj.class_img_err_url && "" != klassObj.class_img_err_url) {
            classImage.src = klassObj.class_img_err_url;
        }
    }; // end functions
    KlassListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-list.component.css'],
            templateUrl: 'klass-list.component.html',
        }), 
        __metadata('design:paramtypes', [klass_simple_service_1.KlassSimpleService, url_service_1.UrlService, user_service_1.UserService, my_logger_service_1.MyLoggerService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService, router_1.ActivatedRoute, router_1.Router])
    ], KlassListComponent);
    return KlassListComponent;
}());
exports.KlassListComponent = KlassListComponent; // end class
//# sourceMappingURL=klass-list.component.js.map