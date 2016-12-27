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
var url_service_1 = require('../util/url.service');
var image_service_1 = require('../util/image.service');
var my_event_1 = require('../util/model/my-event');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_event_service_1 = require('../util/service/my-event.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_is_1 = require('../util/helper/my-is');
var my_array_1 = require('../util/helper/my-array');
var smart_editor_component_1 = require('../widget/smart-editor/smart-editor.component');
var comment_1 = require('../widget/comment/model/comment');
var comment_list_component_1 = require('../widget/comment/comment-list.component');
var klass_1 = require('./model/klass');
var klass_question_1 = require('./model/klass-question');
var klass_review_1 = require('./model/klass-review');
var klass_color_service_1 = require('./service/klass-color.service');
var klass_comment_service_1 = require('./service/klass-comment.service');
var klass_radiobtn_service_1 = require('./service/klass-radiobtn.service');
var klass_service_1 = require('./service/klass.service');
var klass_venue_search_list_component_1 = require('./widget/klass-venue-search-list.component');
var KlassDetailNavListComponent = (function () {
    function KlassDetailNavListComponent(klassColorService, klassCommentService, klassService, watchTower, myEventService, myCheckerService, radiobtnService, myLoggerService, urlService, imageService) {
        this.klassColorService = klassColorService;
        this.klassCommentService = klassCommentService;
        this.klassService = klassService;
        this.watchTower = watchTower;
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
        this.radiobtnService = radiobtnService;
        this.myLoggerService = myLoggerService;
        this.urlService = urlService;
        this.imageService = imageService;
        this.isAdmin = false;
        this.cageWidth = -1;
        // Nav Focus
        this.isFocusKlassDesc = true;
        this.isFocusKlassVenue = false;
        this.isFocusTutorDesc = false;
        this.isFocusStudentReview = false;
        this.isFocusStudentQuestion = false;
        this.isFocusCaution = false;
        this.navHeight = 50;
        this.borderTopBottomWidth = 2;
        // Admin Show
        this.isShowKlassFeatureAdmin = false;
        this.isShowKlassTargetAdmin = false;
        this.isShowKlassScheduleAdmin = false;
        this.isPreviewKlassSchedule = false;
        this.emitter = new core_1.EventEmitter();
        this.myIs = new my_is_1.HelperMyIs();
        this.myArray = new my_array_1.HelperMyArray();
    }
    KlassDetailNavListComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / ngOnInit / init");
        // WIDTH
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        } // end if
        this.subscribeEventPack();
        this.subscribeLoginUser();
    };
    KlassDetailNavListComponent.prototype.subscribeLoginUser = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / subscribeLoginUser / init");
        this.loginUser = this.watchTower.getLoginUser();
        if (isDebug)
            console.log("k-d-n-l / subscribeLoginUser / this.loginUser : ", this.loginUser);
        if (null != this.loginUser) {
            // 로그인 유저 정보가 필요한 컴포넌트들에게 로그인 정보를 전달!
            this.tossLoginUser();
            return;
        } // end if
        // 로그인 유저 정보를 가져오지 못했습니다. watchTowerd에서 전달해주기를 기다립니다.
        this.watchTower.loginAnnounced$.subscribe(function (loginUser) {
            if (isDebug)
                console.log("k-d-n-l / subscribeLoginUser / loginUser : ", loginUser);
            // 이벤트 관련 정보가 준비되었습니다.
            _this.loginUser = loginUser;
            // 로그인 유저 정보가 필요한 컴포넌트들에게 로그인 정보를 전달!
            _this.tossLoginUser();
        }); // end subscribe
    }; // end method
    KlassDetailNavListComponent.prototype.tossLoginUser = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / tossLoginUser / init");
        if (null == this.loginUser) {
            return;
        }
        if (null != this.questionListComponent) {
            this.questionListComponent.setLoginUser(this.loginUser);
        }
        if (null != this.reviewListComponent) {
            this.reviewListComponent.setLoginUser(this.loginUser);
        }
    };
    KlassDetailNavListComponent.prototype.subscribeEventPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / subscribeEventPack / init");
        var isEventPackReady = this.watchTower.getIsEventPackReady();
        if (isDebug)
            console.log("k-d-n-l / subscribeEventPack / isEventPackReady : ", isEventPackReady);
        if (this.watchTower.getIsEventPackReady()) {
            // 1. 이미 EventPack 로딩이 완료된 경우
            // 부모 객체에게 component가 준비된 것을 알립니다.
            this.emitEventOnReady();
        }
        else {
            // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
            this.watchTower.isEventPackReady$.subscribe(function (isEventPackReady) {
                if (isDebug)
                    console.log("k-d-n-l / subscribeEventPack / isEventPackReady : ", isEventPackReady);
                // 이벤트 관련 정보가 준비되었습니다.
                // 부모 객체에게 component가 준비된 것을 알립니다.
                _this.emitEventOnReady();
            }); // end subscribe
        } // end if
    }; // end method
    KlassDetailNavListComponent.prototype.emitEventOnReady = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / emitEventOnReady / init");
        if (!this.watchTower.getIsEventPackReady()) {
            if (isDebug)
                console.log("k-d-n-l / emitEventOnReady / 중단 / EventPack is not valid!");
            return;
        }
        var myEventOnReady = this.watchTower.getEventOnReady(
        // eventKey:string, 
        this.watchTower.getMyEventService().KEY_KLASS_DETAIL_NAV_LIST, 
        // component
        this);
        if (isDebug)
            console.log("k-d-n-l / emitEventOnReady / myEventOnReady : ", myEventOnReady);
        this.emitter.emit(myEventOnReady);
        if (isDebug)
            console.log("k-d-n-l / emitEventOnReady / Done!");
    };
    KlassDetailNavListComponent.prototype.emitEvent = function (myEvent) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / emitEvent / init");
        if (!this.watchTower.getIsEventPackReady()) {
            if (isDebug)
                console.log("k-d-n-l / emitEvent / 중단 / EventPack is not valid!");
            return;
        }
        if (null == myEvent) {
            if (isDebug)
                console.log("k-d-n-l / emitEvent / 중단 / myEvent is not valid!");
            return;
        }
        this.emitter.emit(myEvent);
    };
    KlassDetailNavListComponent.prototype.setKlass = function (klass) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / setKlass / init");
        if (null == klass) {
            return;
        }
        if (isDebug)
            console.log("k-d-n-l / setKlass / klass : ", klass);
        this.klass = klass;
        // klass의 정보가 들어온 시점에 레이아웃 정보를 설정합니다.
        this.init();
    };
    KlassDetailNavListComponent.prototype.setKlassFeature = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / setKlassFeature / init");
        if (null == this.klass) {
            if (isDebug)
                console.log("k-d-n-l / setKlassFeature / 중단 / this.klass is not valid!");
            return;
        }
        var featureList = this.klass.getFeatureList();
        if (null == featureList || 0 == featureList.length) {
            // 설정된 값이 없다면 기본 설정 값을 넣어줍니다.
            featureList =
                [
                    "(예시) 해외 여행시 다양한 상황에서 필요한 영어 표현들을 연습",
                    "(예시) 초급 분들도 영어로 묻고 답하는데 어려움 없도록 코칭",
                    "(예시) 자신감을 심어주는 클래스",
                ];
        }
        this.updateKlassFeature(featureList);
    }; // end method
    KlassDetailNavListComponent.prototype.updateKlassFeature = function (featureList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / updateKlassFeature / init");
        // 3개 열 고정 노출입니다. 모자라다면 채워서 노출합니다.
        if (this.myArray.isNotOK(featureList)) {
            featureList = [];
        }
        var lengthFixed = 3;
        var lengthNeeded = lengthFixed - featureList.length;
        if (0 < lengthNeeded) {
            for (var i = (lengthFixed - lengthNeeded); i < lengthFixed; ++i) {
                featureList.push("수업 특징을 입력해주세요.");
            } // end for
        } // end if
        var myEventKlassFeatureList = [];
        if (this.myArray.isOK(featureList)) {
            for (var i = 0; i < featureList.length; ++i) {
                var klassFeature = featureList[i];
                var myEventKlassFeature = new my_event_1.MyEvent(
                // public id:string
                this.myEventService.getUniqueIdx(), 
                // public eventName:string
                this.myEventService.ANY, 
                // public key:string
                this.myEventService.KEY_KLASS_FEATURE_LIST, 
                // public value:string
                klassFeature, 
                // public metaObj:any
                { klassId: +this.klass.id }, 
                // public myChecker:MyChecker
                this.myCheckerService.getTitleChecker());
                myEventKlassFeatureList.push(myEventKlassFeature);
            } // end for      
        } // end if
        this.myEventListForKlassFeature = myEventKlassFeatureList;
    }; // end method  
    KlassDetailNavListComponent.prototype.setKlassTarget = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / setKlassTarget / init");
        if (null == this.klass) {
            if (isDebug)
                console.log("k-d-n-l / setKlassTarget / 중단 / this.klass is not valid!");
            return;
        }
        var targetList = this.klass.getTargetList();
        if (null == targetList || 0 == targetList.length) {
            targetList =
                [
                    "(예시) 1. 여행가서 당황하지 않을 만큼 영어 회화 연습하고 싶은 분들",
                    "(예시) 2. 여행 상황별로 충분히 연습해 자신감을 갖고 싶은 분들"
                ];
        }
        this.updateKlassTarget(targetList);
    }; // end method
    KlassDetailNavListComponent.prototype.updateKlassTarget = function (targetList) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / updateKlassTarget / init");
        // 3개 열 고정 노출입니다. 모자라다면 채워서 노출합니다.
        if (this.myArray.isNotOK(targetList)) {
            targetList = [];
        }
        var lengthFixed = 3;
        var lengthNeeded = lengthFixed - targetList.length;
        if (0 < lengthNeeded) {
            for (var i = (lengthFixed - lengthNeeded); i < lengthFixed; ++i) {
                targetList.push("수업 대상을 입력해주세요.");
            } // end for
        } // end if
        var myEventKlassTargetList = [];
        if (this.myArray.isOK(targetList)) {
            for (var i = 0; i < targetList.length; ++i) {
                var klassTarget = targetList[i];
                var myEventKlassTarget = new my_event_1.MyEvent(
                // public id:string
                this.myEventService.getUniqueIdx(), 
                // public eventName:string
                this.myEventService.ON_CHANGE, 
                // public key:string
                this.myEventService.KEY_KLASS_TARGET_LIST, 
                // public value:string
                klassTarget, 
                // public metaObj:any
                { klassId: +this.klass.id }, 
                // public myChecker:MyChecker
                this.myCheckerService.getTitleChecker());
                myEventKlassTargetList.push(myEventKlassTarget);
            } // end for      
        } // end if
        this.myEventListForKlassTarget = myEventKlassTargetList;
    }; // end method
    KlassDetailNavListComponent.prototype.setKlassSchedule = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / setKlassSchedule / init");
        var klassSchedule = this.klass.schedule;
        if (null === klassSchedule || "" === klassSchedule) {
            klassSchedule = '<p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)1. Small talk &amp; 지난 시간 배운 표현 복습 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)2. Brainstorming – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)3. Key word 익히기 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)4. key expression – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)5. Break – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)6. Practice + Roleplay – <span style="color: rgb(255, 170, 0);">30분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)7. Q&amp;A, feedback + closing – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><br></p>';
        }
        this.klassSchedule = klassSchedule;
    }; // end method
    KlassDetailNavListComponent.prototype.setImages = function () {
        this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
        this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);
        this.klassPointsImgUrl = this.imageService.get(this.imageService.classFeatureUrl);
    };
    KlassDetailNavListComponent.prototype.setTeacher = function () {
        if (null != this.klass.teacher) {
            this.klassTeacher = this.klass.teacher;
        } // end if
    };
    KlassDetailNavListComponent.prototype.setReview = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("k-d-n-l / setReview / init");
        var loginUserId = -1;
        if (null != this.loginUser) {
            loginUserId = +this.loginUser.id;
        }
        if (null == this.klass.review_list) {
            return;
        }
        this.reviewCommentList =
            this.klassCommentService.getReviewCommentList(this.klass.review_list, loginUserId);
        if (isDebug)
            console.log("k-d-n-l / setReview / this.reviewCommentList : ", this.reviewCommentList);
        // MyEvent for Review
        this.myEventForReview =
            this.myEventService.getMyEvent(
            // eventName:string
            this.myEventService.ANY, 
            // key:string
            this.myEventService.KEY_COMMENT_REVIEW, 
            // value:string
            "", 
            // metaObj:any
            this.klass, 
            // myChecker:MyChecker
            this.myCheckerService.getCommentChecker());
    }; // end method
    KlassDetailNavListComponent.prototype.setQuestion = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / setQuestion / init");
        var loginUserId = -1;
        if (null != this.loginUser) {
            loginUserId = +this.loginUser.id;
        }
        if (null == this.klass.question_list) {
            return;
        }
        this.questionCommentList =
            this.klassCommentService.getQuestionCommentList(this.klass.question_list, loginUserId);
        // MyEvent for Question
        this.myEventForQuestion =
            this.myEventService.getMyEvent(
            // eventName:string
            this.myEventService.ANY, 
            // key:string
            this.myEventService.KEY_COMMENT_QUESTION, 
            // value:string
            "", 
            // metaObj:any
            this.klass, 
            // myChecker:MyChecker
            this.myCheckerService.getCommentChecker());
    }; // end method
    KlassDetailNavListComponent.prototype.setNavTabs = function () {
        this.radiobtnOptionListNavTabs =
            this.radiobtnService.getNavTabsKlassInfo(
            // klass:Klass, 
            this.klass, 
            // keyFocus:string
            this.watchTower.getMyEventService().KLASS_DESC);
    };
    KlassDetailNavListComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / init / init");
        if (null == this.klass) {
            if (isDebug)
                console.log("k-d-n-l / init / 중단 / this.klass is not valid!");
            return;
        }
        if (isDebug)
            console.log("k-d-n-l / init / this.klass : ", this.klass);
        // COLOR
        this.colorWhite = this.klassColorService.white;
        this.colorOrange = this.klassColorService.orange;
        this.colorGray = this.klassColorService.gray;
        // KLASS FEATURE
        this.setKlassFeature();
        // KLASS TARGET
        this.setKlassTarget();
        // KLASS SCHEDULE
        this.setKlassSchedule();
        // 수업 특징, 대상, 일정에 대한 정보를 백업합니다.
        this.overwriteKlassCopies();
        // 뷰에 사용되는 이미지 설정
        this.setImages();
        // 수업 강사님 정보 가져오기
        this.setTeacher();
        // 수업 리뷰 가져오기
        this.setReview();
        // 수업 질문 가져오기
        this.setQuestion();
        // Nav Tab 설정
        this.setNavTabs();
    };
    KlassDetailNavListComponent.prototype.removeMyEventFromList = function (myEventToRemove, myEventList) {
        var myEventListNext = [];
        for (var i = 0; i < myEventList.length; ++i) {
            var myEventNext = myEventList[i];
            if (myEventNext.isSame(myEventToRemove)) {
                // 지울 이벤트를 찾았습니다. 리스트에서 제외합니다.
                continue;
            }
            myEventListNext.push(myEventNext);
        }
        // 삭제할 이벤트가 없습니다. 받은 리스트를 돌려줍니다.
        return myEventListNext;
    };
    KlassDetailNavListComponent.prototype.getEventValues = function (myEventList) {
        var eventValues = "";
        if (null == myEventList || 0 === myEventList.length) {
            return eventValues;
        }
        for (var i = 0; i < myEventList.length; ++i) {
            var myEvent = myEventList[i];
            eventValues += myEvent.value;
            if (i < (myEventList.length - 1)) {
                // unless last index...
                eventValues += "|";
            }
        }
        return eventValues;
    };
    KlassDetailNavListComponent.prototype.setQuestionList = function () {
        if (null == this.questionListComponent) {
            return;
        }
        this.questionListComponent.setLoginUser(this.loginUser);
    };
    KlassDetailNavListComponent.prototype.setReviewList = function () {
        if (null == this.reviewListComponent) {
            return;
        }
        this.reviewListComponent.setLoginUser(this.loginUser);
    };
    KlassDetailNavListComponent.prototype.setVenueSearch = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / setVenueSearch / init");
        if (null == this.klass) {
            return;
        }
        if (null == this.venueSearchComponent) {
            return;
        }
        if (this.klass.hasNotKlassVenue()) {
            this.setVenueDefault();
        }
        else {
            this.venueSearchComponent.setVenue(this.klass.getKlassVenue());
        } // end if
    }; // end method
    KlassDetailNavListComponent.prototype.setVenueDefault = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / setVenueDefault / init");
        if (null == this.klass) {
            return;
        }
        if (null == this.venueSearchComponent) {
            return;
        }
        this.venueSearchComponent.setVenue(this.venueSearchComponent.getDefaultVenue());
    }; // end method
    // @ 로그인 페이지로 이동합니다. 현재 페이지 주소를 리다이렉트 주소로 사용합니다.
    KlassDetailNavListComponent.prototype.goLogin = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / goLogin / init");
        var appViewUrl = this.urlService.getAppViewUrl();
        if (isDebug)
            console.log("k-d-n-l / goLogin / appViewUrl : ", appViewUrl);
        var req_url = this.urlService.get("#/login?redirect=" + appViewUrl);
        if (isDebug)
            console.log("k-d-n-l / goLogin / req_url : ", req_url);
        window.location.href = req_url;
    };
    KlassDetailNavListComponent.prototype.removeReview = function (reviewId) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / removeReview / init");
        if (isDebug)
            console.log("k-d-n-l / removeReview / reviewId : ", reviewId);
        // DB UPDATE!
        this.klassService.removeKlassReview(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // klassId:number,
        +this.klass.id, 
        // reviewId:number
        reviewId).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("klass-detail / removeReview / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("klass_review")) {
            }
            else if (myResponse.isFailed() && null != myResponse.error) {
                _this.watchTower.announceErrorMsgArr([myResponse.error]);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "klass-detail-nav-list / removeReview / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klass.id + " / reviewId : " + reviewId); // end logger      
            } // end if
        }); // end service     
    };
    KlassDetailNavListComponent.prototype.addReview = function (newComment) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / addReview / init");
        if (isDebug)
            console.log("k-d-n-l / addReview / newComment : ", newComment);
        // DB UPDATE!
        this.klassService.addKlassReview(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // klassId:number,
        +this.klass.id, 
        // review:string,
        newComment.comment, 
        // star:number
        newComment.star).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("klass-detail / addReview / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("klass_review")) {
                // 리뷰가 등록되었습니다.  
                // 컴포넌트에게 등록된 데이터를 전달, id를 업데이트 합니다.
                var klassReviewJSON = myResponse.getDataProp("klass_review");
                var klassReview = null;
                if (null != klassReviewJSON) {
                    klassReview = new klass_review_1.KlassReview().setJSON(klassReviewJSON);
                }
                if (null != klassReview) {
                    newComment.id = klassReview.id;
                }
                _this.reviewListComponent.updateComment(newComment);
            }
            else if (myResponse.isFailed() && null != myResponse.error) {
                _this.watchTower.announceErrorMsgArr([myResponse.error]);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "klass-detail-nav-list / addReview / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klass.id + " / comment : " + newComment.comment); // end logger      
            } // end if
        }); // end service     
    }; // end if
    KlassDetailNavListComponent.prototype.addReviewReply = function (newComment) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / addReviewReply / init");
        if (isDebug)
            console.log("k-d-n-l / addReviewReply / newComment : ", newComment);
        // DB UPDATE!
        this.klassService.addKlassReviewReply(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // klassId:number,
        +this.klass.id, 
        // parentId:number,
        +newComment.parentId, 
        // question:string
        newComment.comment).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("k-d-n-l / addReviewReply / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("klass_review")) {
                // 리뷰가 등록되었습니다.  
                // 컴포넌트에게 등록된 데이터를 전달, id를 업데이트 합니다.
                var klassReviewJSON = myResponse.getDataProp("klass_review");
                var klassReview = null;
                if (null != klassReviewJSON) {
                    klassReview = new klass_review_1.KlassReview().setJSON(klassReviewJSON);
                }
                if (null != klassReview) {
                    newComment.id = klassReview.id;
                }
                _this.reviewListComponent.updateComment(newComment);
            }
            else if (myResponse.isFailed() && null != myResponse.error) {
                _this.watchTower.announceErrorMsgArr([myResponse.error]);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "klass-detail-nav-list / addReviewReply / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klass.id + " / comment : " + newComment.comment); // end logger      
            } // end if
        }); // end service
    };
    KlassDetailNavListComponent.prototype.removeQuestion = function (questionId) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / removeQuestion / init");
        if (isDebug)
            console.log("k-d-n-l / removeQuestion / questionId : ", questionId);
        // DB UPDATE!
        this.klassService.removeKlassQuestion(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // klassId:number,
        +this.klass.id, 
        // questionId:number
        questionId).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("klass-detail / removeQuestion / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("klass_question")) {
            }
            else if (myResponse.isFailed() && null != myResponse.error) {
                _this.watchTower.announceErrorMsgArr([myResponse.error]);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "klass-detail-nav-list / removeQuestion / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klass.id + " / questionId : " + questionId); // end logger      
            } // end if
        }); // end service     
    };
    KlassDetailNavListComponent.prototype.addQuestion = function (newComment) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / addQuestion / init");
        if (isDebug)
            console.log("k-d-n-l / addQuestion / newComment : ", newComment);
        // DB UPDATE!
        this.klassService.addKlassQuestion(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // klassId:number,
        +this.klass.id, 
        // question:string
        newComment.comment).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("klass-detail / addQuestion / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("klass_question")) {
                // 리뷰가 등록되었습니다.  
                // 컴포넌트에게 등록된 데이터를 전달, id를 업데이트 합니다.
                var klassQuestionJSON = myResponse.getDataProp("klass_question");
                var klassQuestion = null;
                if (null != klassQuestionJSON) {
                    klassQuestion = new klass_question_1.KlassQuestion().setJSON(klassQuestionJSON);
                }
                if (null != klassQuestion) {
                    newComment.id = klassQuestion.id;
                }
                _this.questionListComponent.updateComment(newComment);
            }
            else if (myResponse.isFailed() && null != myResponse.error) {
                _this.watchTower.announceErrorMsgArr([myResponse.error]);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "klass-detail-nav-list / addQuestion / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klass.id + " / comment : " + newComment.comment); // end logger      
            } // end if
        }); // end service     
    }; // end if
    KlassDetailNavListComponent.prototype.addQuestionReply = function (newComment) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / addQuestionReply / init");
        if (isDebug)
            console.log("k-d-n-l / addQuestionReply / newComment : ", newComment);
        // DB UPDATE!
        this.klassService.addKlassQuestionReply(
        // apiKey:string, 
        this.watchTower.getApiKey(), 
        // userId:number,
        +this.loginUser.id, 
        // klassId:number,
        +this.klass.id, 
        // parentId:number,
        +newComment.parentId, 
        // question:string
        newComment.comment).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("k-d-n-l / addQuestionReply / myResponse : ", myResponse);
            if (myResponse.isSuccess() && myResponse.hasDataProp("klass_question")) {
                // 리뷰가 등록되었습니다.  
                // 컴포넌트에게 등록된 데이터를 전달, id를 업데이트 합니다.
                var klassQuestionJSON = myResponse.getDataProp("klass_question");
                var klassQuestion = null;
                if (null != klassQuestionJSON) {
                    klassQuestion = new klass_question_1.KlassQuestion().setJSON(klassQuestionJSON);
                }
                if (null != klassQuestion) {
                    newComment.id = klassQuestion.id;
                }
                _this.questionListComponent.updateComment(newComment);
            }
            else if (myResponse.isFailed() && null != myResponse.error) {
                _this.watchTower.announceErrorMsgArr([myResponse.error]);
            }
            else {
                // 에러 로그 등록
                _this.myLoggerService.logError(
                // apiKey:string
                _this.watchTower.getApiKey(), 
                // errorType:string
                _this.myLoggerService.errorAPIFailed, 
                // errorMsg:string
                "klass-detail-nav-list / addQuestion / user_id : " + _this.loginUser.id + " / klass_id : " + _this.klass.id + " / comment : " + newComment.comment); // end logger      
            } // end if
        }); // end service     
    };
    KlassDetailNavListComponent.prototype.onChangedFromInputRow = function (myEvent) {
        // Smart Editor를 사용하는 Element에서 발생한 callback 처리.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("k-d-n-l / onChangedFromInputRow / init");
        if (isDebug)
            console.log("k-d-n-l / onChangedFromInputRow / myEvent : ", myEvent);
        if (null == myEvent || null == myEvent.key || "" == myEvent.key) {
            return;
        } // end if
        if (myEvent.hasEventName(this.myEventService.ON_READY)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {
                if (null != myEvent.metaObj) {
                    this.questionListComponent = myEvent.metaObj;
                    this.setQuestionList();
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_REVIEW_LIST)) {
                if (null != myEvent.metaObj) {
                    this.reviewListComponent = myEvent.metaObj;
                    this.setReviewList();
                } // end if
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DETAIL_NAV_VENUE_MAP)) {
                // wonder.jung
                if (null != myEvent.metaObj) {
                    // 네이버 맵 장소 검색 컴포넌트가 준비됨.
                    this.venueSearchComponent = myEvent.metaObj;
                    this.setVenueSearch();
                } // end if
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_LOGIN_REQUIRED)) {
            this.goLogin();
        }
        else if (myEvent.hasEventName(this.myEventService.ON_CHANGE)) {
            if (this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key) {
                this.myEventListForKlassFeature =
                    this.myEventService.setEventValue(myEvent, this.myEventListForKlassFeature);
                // 부모 객체에 전달합니다.
                this.emitEvent(myEvent);
            }
            else if (this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key) {
                this.myEventListForKlassTarget =
                    this.myEventService.setEventValue(myEvent, this.myEventListForKlassTarget);
                // 부모 객체에 전달합니다.
                this.emitEvent(myEvent);
            }
            else if (this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
                this.klassSchedule = myEvent.value;
                // 부모 객체에 전달합니다.
                this.emitter.emit(myEvent);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_DETAIL_NAV_VENUE_MAP)) {
                this.emitEvent(myEvent);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_ADD_COMMENT)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {
                // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
                // metaObj로 받는 comment 객체
                var newComment = new comment_1.Comment().setJSON(myEvent.metaObj);
                if (isDebug)
                    console.log("k-d-n-l / onChangedFromInputRow / newComment : ", newComment);
                this.addQuestion(newComment);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_REVIEW_LIST)) {
                // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
                // metaObj로 받는 comment 객체
                var newComment = new comment_1.Comment().setJSON(myEvent.metaObj);
                if (isDebug)
                    console.log("k-d-n-l / onChangedFromInputRow / newComment : ", newComment);
                this.addReview(newComment);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_ADD_COMMENT_REPLY)) {
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {
                // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
                // metaObj로 받는 comment 객체        
                var newComment = new comment_1.Comment().setJSON(myEvent.metaObj);
                if (isDebug)
                    console.log("k-d-n-l / onChangedFromInputRow / newComment : ", newComment);
                this.addQuestionReply(newComment);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_REVIEW_LIST)) {
                // 1. 댓글을 추가하는 경우, 필요한 정보는 다음과 같습니다. 
                // metaObj로 받는 comment 객체        
                var newComment = new comment_1.Comment().setJSON(myEvent.metaObj);
                if (isDebug)
                    console.log("k-d-n-l / onChangedFromInputRow / newComment : ", newComment);
                this.addReviewReply(newComment);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {
            // 열이 추가되었습니다.
            if (this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key) {
                var klassFeatureNext = this.getEventValues(this.myEventListForKlassFeature);
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            }
            else if (this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key) {
                var klassFeatureTarget = this.getEventValues(this.myEventListForKlassTarget);
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {
            // 열을 지웁니다.
            if (myEvent.hasKey(this.myEventService.KEY_KLASS_FEATURE_LIST)) {
                this.klassFeature = this.klass.feature = myEvent.value;
                var nextEventList = this.removeMyEventFromList(myEvent, this.myEventListForKlassFeature);
                this.myEventListForKlassFeature = nextEventList;
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TARGET_LIST)) {
                this.klassTarget = this.klass.target = myEvent.value;
                var nextEventList = this.removeMyEventFromList(myEvent, this.myEventListForKlassTarget);
                this.myEventListForKlassTarget = nextEventList;
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_QUESTION_LIST)) {
                this.removeQuestion(parseInt(myEvent.value));
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_REVIEW_LIST)) {
                this.removeReview(parseInt(myEvent.value));
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_RESUME_LIST)) {
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            }
            else if (myEvent.hasKey(this.myEventService.KEY_KLASS_TEACHER_GREETING_LIST)) {
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            } // end if
        }
        else if (myEvent.hasEventName(this.myEventService.ON_SAVE)) {
            var hasChanged = false;
            if (this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key) {
                hasChanged = this.hasChangedFeature();
            }
            else if (this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key) {
                hasChanged = this.hasChangedTarget();
            }
            else if (this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
                hasChanged = this.hasChangedSchedule();
            }
            if (hasChanged) {
                // 변경된 사항을 모두 저장합니다.
                this.overwriteKlassCopies();
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_SHUTDOWN)) {
            // 입력창을 닫습니다.
            if (this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key ||
                this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key ||
                this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
                this.shutdownKlassInfos();
            }
        }
        else if (myEvent.hasEventName(this.myEventService.ON_SHUTDOWN_N_ROLLBACK)) {
            // 입력창을 닫습니다.
            if (this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key ||
                this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key ||
                this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
                this.shutdownKlassInfos();
            }
            // 데이터가 변경되었는지 확인합니다.
            var hasChanged = false;
            if (this.myEventService.KEY_KLASS_FEATURE_LIST === myEvent.key) {
                hasChanged = this.hasChangedFeature();
            }
            else if (this.myEventService.KEY_KLASS_TARGET_LIST === myEvent.key) {
                hasChanged = this.hasChangedTarget();
            }
            else if (this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
                hasChanged = this.hasChangedSchedule();
                // 부모에게 변경된 내역을 전파
                this.emitter.emit(myEvent);
            }
            if (hasChanged) {
                // 데이터를 롤백합니다.
                this.rollbackKlassCopies();
            }
        }
        else if (this.myEventService.ON_PREVIEW === myEvent.eventName) {
            if (this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
                // 화면에 현재 작업중인 모습을 보여줌.
                this.isPreviewKlassSchedule = true;
            }
        }
        else if (this.myEventService.ON_UNPREVIEW === myEvent.eventName) {
            if (this.myEventService.KEY_KLASS_SCHEDULE === myEvent.key) {
                // 화면에 현재 작업중인 모습을 보여주지 않음.
                this.isPreviewKlassSchedule = false;
            }
        }
    };
    KlassDetailNavListComponent.prototype.hasChangedFeature = function () {
        var hasChanged = this.myEventService.hasChangedList(this.myEventListForKlassFeature, this.myEventListForKlassFeatureCopy);
        return hasChanged;
    };
    KlassDetailNavListComponent.prototype.hasChangedTarget = function () {
        var hasChanged = this.myEventService.hasChangedList(this.myEventListForKlassTarget, this.myEventListForKlassTargetCopy);
        return hasChanged;
    };
    KlassDetailNavListComponent.prototype.hasChangedSchedule = function () {
        if (this.klassScheduleCopy != this.klassSchedule) {
            return true;
        }
        return false;
    };
    KlassDetailNavListComponent.prototype.onChangedFromChild = function (myEvent, klassDesc, klassVenue, tutorDesc, studentReview, studentQuestion, caution) {
        this.isFocusKlassDesc = false;
        this.isFocusKlassVenue = false;
        this.isFocusTutorDesc = false;
        this.isFocusStudentReview = false;
        this.isFocusStudentQuestion = false;
        this.isFocusCaution = false;
        var nextYPos = 0;
        var box = null;
        var firstBox = klassDesc.getBoundingClientRect();
        var scrollY = window.scrollY;
        if (this.myEventService.KLASS_DESC === myEvent.key) {
            this.isFocusKlassDesc = true;
            box = klassDesc.getBoundingClientRect();
        }
        else if (this.myEventService.KLASS_VENUE === myEvent.key) {
            this.isFocusKlassVenue = true;
            box = klassVenue.getBoundingClientRect();
        }
        else if (this.myEventService.TEACHER_DESC === myEvent.key) {
            this.isFocusTutorDesc = true;
            box = tutorDesc.getBoundingClientRect();
        }
        else if (this.myEventService.STUDENT_REVIEW === myEvent.key) {
            this.isFocusStudentReview = true;
            box = studentReview.getBoundingClientRect();
        }
        else if (this.myEventService.STUDENT_QUESTION === myEvent.key) {
            this.isFocusStudentQuestion = true;
            box = studentQuestion.getBoundingClientRect();
        }
        else if (this.myEventService.CAUTION === myEvent.key) {
            this.isFocusCaution = true;
            box = caution.getBoundingClientRect();
        } // end if
        if (null != box) {
            if (0 < (firstBox.top - this.navHeight)) {
                nextYPos = scrollY + box.top - (this.navHeight * 2 + this.borderTopBottomWidth);
            }
            else {
                nextYPos = scrollY + box.top - this.navHeight;
            }
            if (0 < nextYPos) {
                window.scrollTo(0, nextYPos);
            } // end inner if
        } // end if
    };
    KlassDetailNavListComponent.prototype.onClickKlassFeature = function () {
        this.isShowKlassFeatureAdmin = !this.isShowKlassFeatureAdmin;
        if (!this.isShowKlassFeatureAdmin) {
            this.shutdownKlassInfos();
        }
    };
    KlassDetailNavListComponent.prototype.onClickKlassTarget = function () {
        this.isShowKlassTargetAdmin = !this.isShowKlassTargetAdmin;
        if (!this.isShowKlassTargetAdmin) {
            this.shutdownKlassInfos();
        }
    };
    KlassDetailNavListComponent.prototype.onClickKlassSchedule = function () {
        this.isShowKlassScheduleAdmin = !this.isShowKlassScheduleAdmin;
        if (!this.isShowKlassScheduleAdmin) {
            this.shutdownKlassInfos();
        }
    };
    KlassDetailNavListComponent.prototype.shutdownKlassInfos = function () {
        this.isShowKlassFeatureAdmin = false;
        this.isShowKlassTargetAdmin = false;
        this.isShowKlassScheduleAdmin = false;
    };
    KlassDetailNavListComponent.prototype.overwriteKlassCopies = function () {
        this.myEventListForKlassTargetCopy =
            this.myEventService.getCopyEventList(this.myEventListForKlassTarget);
        this.myEventListForKlassFeatureCopy =
            this.myEventService.getCopyEventList(this.myEventListForKlassFeature);
        this.klassScheduleCopy = this.klassSchedule;
    };
    KlassDetailNavListComponent.prototype.rollbackKlassCopies = function () {
        this.myEventListForKlassTarget = this.myEventListForKlassTargetCopy;
        this.myEventListForKlassFeature = this.myEventListForKlassFeatureCopy;
        this.klassSchedule = this.klassScheduleCopy;
        this.overwriteKlassCopies();
    };
    __decorate([
        core_1.ViewChild(smart_editor_component_1.SmartEditorComponent), 
        __metadata('design:type', smart_editor_component_1.SmartEditorComponent)
    ], KlassDetailNavListComponent.prototype, "seComponent", void 0);
    __decorate([
        core_1.ViewChild(comment_list_component_1.CommentListComponent), 
        __metadata('design:type', comment_list_component_1.CommentListComponent)
    ], KlassDetailNavListComponent.prototype, "questionListComponent", void 0);
    __decorate([
        core_1.ViewChild(comment_list_component_1.CommentListComponent), 
        __metadata('design:type', comment_list_component_1.CommentListComponent)
    ], KlassDetailNavListComponent.prototype, "reviewListComponent", void 0);
    __decorate([
        core_1.ViewChild(klass_venue_search_list_component_1.KlassVenueSearchListComponent), 
        __metadata('design:type', klass_venue_search_list_component_1.KlassVenueSearchListComponent)
    ], KlassDetailNavListComponent.prototype, "venueSearchComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], KlassDetailNavListComponent.prototype, "radiobtnOptionListNavTabs", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', klass_1.Klass)
    ], KlassDetailNavListComponent.prototype, "klass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassDetailNavListComponent.prototype, "klassFeature", void 0);
    __decorate([
        // @ Deprecated
        core_1.Input(), 
        __metadata('design:type', Array)
    ], KlassDetailNavListComponent.prototype, "klassFeatureList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassDetailNavListComponent.prototype, "klassTarget", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], KlassDetailNavListComponent.prototype, "klassTargetList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], KlassDetailNavListComponent.prototype, "klassSchedule", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], KlassDetailNavListComponent.prototype, "isAdmin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], KlassDetailNavListComponent.prototype, "cageWidth", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], KlassDetailNavListComponent.prototype, "emitter", void 0);
    KlassDetailNavListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'klass-detail-nav-list',
            templateUrl: 'klass-detail-nav-list.component.html',
            styleUrls: ['klass-detail-nav-list.component.css']
        }), 
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, klass_comment_service_1.KlassCommentService, klass_service_1.KlassService, my_event_watchtower_service_1.MyEventWatchTowerService, my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService, klass_radiobtn_service_1.KlassRadioBtnService, my_logger_service_1.MyLoggerService, url_service_1.UrlService, image_service_1.ImageService])
    ], KlassDetailNavListComponent);
    return KlassDetailNavListComponent;
}());
exports.KlassDetailNavListComponent = KlassDetailNavListComponent;
//# sourceMappingURL=klass-detail-nav-list.component.js.map