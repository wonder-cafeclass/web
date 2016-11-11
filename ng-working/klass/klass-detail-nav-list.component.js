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
var my_event_service_1 = require('../util/my-event.service');
var my_event_1 = require('../util/model/my-event');
var my_checker_service_1 = require('../util/service/my-checker.service');
var image_service_1 = require('../util/image.service');
var klass_color_service_1 = require('./service/klass-color.service');
var smart_editor_component_1 = require('../widget/smart-editor/smart-editor.component');
var klass_1 = require('./model/klass');
var KlassDetailNavListComponent = (function () {
    function KlassDetailNavListComponent(klassColorService, myEventService, myCheckerService, imageService) {
        this.klassColorService = klassColorService;
        this.myEventService = myEventService;
        this.myCheckerService = myCheckerService;
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
    }
    KlassDetailNavListComponent.prototype.ngOnInit = function () {
        // WIDTH
        if (0 < this.cageWidth) {
            this.cageWidthStr = this.cageWidth + "px";
        }
        else {
            this.cageWidthStr = "100%";
        } // end if
        // COLOR
        this.colorWhite = this.klassColorService.white;
        this.colorOrange = this.klassColorService.orange;
        this.colorGray = this.klassColorService.gray;
        // KLASS FEATURE
        if (null == this.klassFeatureList || 0 == this.klassFeatureList.length) {
            this.klassFeatureList =
                [
                    "(예시) 해외 여행시 다양한 상황에서 필요한 영어 표현들을 연습",
                    "(예시) 초급 분들도 영어로 묻고 답하는데 어려움 없도록 코칭",
                    "(예시) 자신감을 심어주는 클래스",
                ];
        }
        this.myEventListForKlassFeature = [];
        for (var i = 0; i < this.klassFeatureList.length; ++i) {
            var klassFeature = this.klassFeatureList[i];
            var myEventKlassFeature = new my_event_1.MyEvent(
            // public id:string
            this.myEventService.getUniqueIdx(), 
            // public eventName:string
            this.myEventService.ANY, 
            // public key:string
            this.myEventService.KLASS_FEATURE, 
            // public value:string
            klassFeature, 
            // public metaObj:any
            { klassId: +this.klass.id }, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker());
            this.myEventListForKlassFeature.push(myEventKlassFeature);
        } // end for
        // KLASS TARGET
        if (null == this.klassTargetList || 0 == this.klassTargetList.length) {
            // this.klassFeature = '(예시) 해외 여행시 다양한 상황에서 필요한 영어 표현들을 연습|(예시) 초급 분들도 영어로 묻고 답하는데 어려움 없도록 코칭|(예시) 자신감을 심어주는 클래스';
            this.klassTargetList =
                [
                    "(예시) 1. 여행가서 당황하지 않을 만큼 영어 회화 연습하고 싶은 분들",
                    "(예시) 2. 여행 상황별로 충분히 연습해 자신감을 갖고 싶은 분들"
                ];
        }
        this.myEventListForKlassTarget = [];
        for (var i = 0; i < this.klassTargetList.length; ++i) {
            var klassTarget = this.klassTargetList[i];
            var myEventKlassTarget = new my_event_1.MyEvent(
            // public id:string
            this.myEventService.getUniqueIdx(), 
            // public eventName:string
            this.myEventService.ON_CHANGE, 
            // public key:string
            this.myEventService.KLASS_TARGET, 
            // public value:string
            klassTarget, 
            // public metaObj:any
            { klassId: +this.klass.id }, 
            // public myChecker:MyChecker
            this.myCheckerService.getTitleChecker());
            this.myEventListForKlassTarget.push(myEventKlassTarget);
        } // end for
        // KLASS SCHEDULE
        if (null === this.klassSchedule || "" === this.klassSchedule) {
            this.klassSchedule = '<p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)1. Small talk &amp; 지난 시간 배운 표현 복습 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)2. Brainstorming – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)3. Key word 익히기 – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)4. key expression – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)5. Break – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)6. Practice + Roleplay – <span style="color: rgb(255, 170, 0);">30분</span></span></font></p><p><font color="#ff0000"><br></font></p><p><font color="#ff0000"><span style="font-family: 나눔고딕, NanumGothic; font-size: 12pt; color: rgb(99, 99, 99);">(예시)7. Q&amp;A, feedback + closing – <span style="color: rgb(255, 170, 0);">10분</span></span></font></p><p><br></p>';
        }
        this.overwriteKlassCopies();
        // IMAGES
        this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);
        this.watchTowerWhiteImgUrl = this.imageService.get(this.imageService.watchTowerWhiteUrl);
        this.klassPointsImgUrl = this.imageService.get(this.imageService.classFeatureUrl);
    };
    // @ Deprecated
    KlassDetailNavListComponent.prototype.ngOnChanges = function (changes) {
        if (null != changes) {
            if (null != changes['title']) {
            }
        } // end outer if
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
    KlassDetailNavListComponent.prototype.onChangedFromInputRow = function (myEvent) {
        // Smart Editor를 사용하는 Element에서 발생한 callback 처리.
        if (null == myEvent || null == myEvent.key || "" == myEvent.key) {
            return;
        }
        console.log("klass-detail-nav-list / onChangedFromInputRow / myEvent : ", myEvent);
        if (this.myEventService.ON_CHANGE === myEvent.eventName) {
            if (this.myEventService.KLASS_FEATURE === myEvent.key) {
                this.myEventListForKlassFeature =
                    this.myEventService.setEventValue(myEvent, this.myEventListForKlassFeature);
            }
            else if (this.myEventService.KLASS_TARGET === myEvent.key) {
                this.myEventListForKlassTarget =
                    this.myEventService.setEventValue(myEvent, this.myEventListForKlassTarget);
            }
            else if (this.myEventService.KLASS_SCHEDULE === myEvent.key) {
                this.klassSchedule = myEvent.value;
                console.log("ON_CHANGE / this.klassSchedule.length : ", this.klassSchedule.length);
            }
        }
        else if (this.myEventService.ON_ADD_ROW === myEvent.eventName) {
            // 열이 추가되었습니다.
            console.log("열이 추가되었습니다. / myEvent : ", myEvent);
            if (this.myEventService.KLASS_FEATURE === myEvent.key) {
                var klassFeatureNext = this.getEventValues(this.myEventListForKlassFeature);
                console.log("klass-detail-nav-list / onChangedFromInputRow / feature / DB UPDATE");
                console.log(klassFeatureNext);
            }
            else if (this.myEventService.KLASS_TARGET === myEvent.key) {
                var klassFeatureTarget = this.getEventValues(this.myEventListForKlassTarget);
                console.log("klass-detail-nav-list / onChangedFromInputRow / target / DB UPDATE");
                console.log(klassFeatureTarget);
            }
        }
        else if (this.myEventService.ON_REMOVE_ROW === myEvent.eventName) {
            // 열을 지웁니다.
            console.log("열을 지웁니다. / myEvent : ", myEvent);
            if (this.myEventService.KLASS_FEATURE === myEvent.key) {
                this.klassFeature = this.klass.feature = myEvent.value;
                var nextEventList = this.removeMyEventFromList(myEvent, this.myEventListForKlassFeature);
                this.myEventListForKlassFeature = nextEventList;
                // DB UPDATE
                console.log("klass-detail-nav-list / onChangedFromInputRow / feature / DB UPDATE");
                console.log(this.myEventListForKlassFeature);
            }
            else if (this.myEventService.KLASS_TARGET === myEvent.key) {
                this.klassTarget = this.klass.target = myEvent.value;
                var nextEventList = this.removeMyEventFromList(myEvent, this.myEventListForKlassTarget);
                this.myEventListForKlassTarget = nextEventList;
                // DB UPDATE
                console.log("klass-detail-nav-list / onChangedFromInputRow / target / DB UPDATE");
                console.log(this.myEventListForKlassTarget);
            } // end if
        }
        else if (this.myEventService.ON_SAVE === myEvent.eventName) {
            console.log("klass-detail-nav-list / ON_SAVE / 데이터를 저장합니다.");
            // wonder.jung
            var hasChanged = false;
            if (this.myEventService.KLASS_FEATURE === myEvent.key) {
                hasChanged = this.hasChangedFeature();
            }
            else if (this.myEventService.KLASS_TARGET === myEvent.key) {
                hasChanged = this.hasChangedTarget();
            }
            else if (this.myEventService.KLASS_SCHEDULE === myEvent.key) {
                hasChanged = this.hasChangedSchedule();
            }
            if (hasChanged) {
                // 변경된 사항을 모두 저장합니다.
                console.log("변경된 사항을 모두 저장합니다.");
                this.overwriteKlassCopies();
            }
            console.log("ON_SAVE / this.klassSchedule.length : ", this.klassSchedule.length);
        }
        else if (this.myEventService.ON_SHUTDOWN === myEvent.eventName) {
            // 입력창을 닫습니다.
            if (this.myEventService.KLASS_FEATURE === myEvent.key ||
                this.myEventService.KLASS_TARGET === myEvent.key ||
                this.myEventService.KLASS_SCHEDULE === myEvent.key) {
                this.shutdownKlassInfos();
            }
        }
        else if (this.myEventService.ON_SHUTDOWN_N_ROLLBACK === myEvent.eventName) {
            // 입력창을 닫습니다.
            if (this.myEventService.KLASS_FEATURE === myEvent.key ||
                this.myEventService.KLASS_TARGET === myEvent.key ||
                this.myEventService.KLASS_SCHEDULE === myEvent.key) {
                this.shutdownKlassInfos();
            }
            // 데이터가 변경되었는지 확인합니다.
            var hasChanged = false;
            if (this.myEventService.KLASS_FEATURE === myEvent.key) {
                hasChanged = this.hasChangedFeature();
            }
            else if (this.myEventService.KLASS_TARGET === myEvent.key) {
                hasChanged = this.hasChangedTarget();
            }
            else if (this.myEventService.KLASS_SCHEDULE === myEvent.key) {
                hasChanged = this.hasChangedSchedule();
            }
            console.log("데이터가 변경되었는지 확인합니다. / hasChanged : ", hasChanged);
            if (hasChanged) {
                // 데이터를 롤백합니다.
                console.log("데이터를 롤백합니다.");
                this.rollbackKlassCopies();
            }
        }
        else if (this.myEventService.ON_PREVIEW === myEvent.eventName) {
            console.log("XXX - 01");
            if (this.myEventService.KLASS_SCHEDULE === myEvent.key) {
                // 화면에 현재 작업중인 모습을 보여줌.
                console.log("XXX - 02");
                this.isPreviewKlassSchedule = true;
            }
        }
        else if (this.myEventService.ON_UNPREVIEW === myEvent.eventName) {
            if (this.myEventService.KLASS_SCHEDULE === myEvent.key) {
                // 화면에 현재 작업중인 모습을 보여주지 않음.
                this.isPreviewKlassSchedule = false;
            }
        } /* else if(this.myEventService.ON_SHUTDOWN_N_ROLLBACK_INPUT_ROW === myEvent.eventName) {
    
          if( this.myEventService.KLASS_FEATURE === myEvent.key ||
              this.myEventService.KLASS_TARGET === myEvent.key ||
              this.myEventService.KLASS_SCHEDULE === myEvent.key) {
    
            this.shutdownKlassInfos();
          }
    
        } else if(this.myEventService.ON_CHANGE_INPUT_ROW === myEvent.eventName) {
    
          if(this.myEventService.KLASS_FEATURE === myEvent.key) {
            this.klassFeature = this.klass.feature = myEvent.value;
          } else if(this.myEventService.KLASS_TARGET === myEvent.key) {
            this.klassTarget = this.klass.target = myEvent.value;
          } else if(this.myEventService.KLASS_SCHEDULE === myEvent.key) {
            this.klassSchedule = this.klass.schedule = myEvent.value;
          }
    
        } else if(this.myEventService.ON_SAVE_INPUT_ROW === myEvent.eventName) {
    
          // @ Deprecated
    
          // DB로 변경된 데이터를 저장합니다.
          if(this.myEventService.KLASS_FEATURE === myEvent.key) {
            // Not implemented!
          } else if(this.myEventService.KLASS_TARGET === myEvent.key) {
            // Not implemented!
          } else if(this.myEventService.KLASS_SCHEDULE === myEvent.key) {
            // Not implemented!
          }
    
        }
        */
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
        else if (this.myEventService.TUTOR_DESC === myEvent.key) {
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
        __metadata('design:paramtypes', [klass_color_service_1.KlassColorService, my_event_service_1.MyEventService, my_checker_service_1.MyCheckerService, image_service_1.ImageService])
    ], KlassDetailNavListComponent);
    return KlassDetailNavListComponent;
}());
exports.KlassDetailNavListComponent = KlassDetailNavListComponent;
//# sourceMappingURL=klass-detail-nav-list.component.js.map