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
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var NameComponent = (function () {
    function NameComponent(myLoggerService, myCheckerService, myEventService, watchTower) {
        this.myLoggerService = myLoggerService;
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.inputStrPrev = "";
        this.tooltipMsg = null;
        this.isShowTooltip = false;
        this.isFocus = false;
        this.isValid = false;
        // @ User Custom
        this.eventKey = "";
        this.checkerKey = "";
        this.isDisabled = false;
        this.tooltipMsgNotAllowed = "이름에 문제가 있습니다.";
        this.tooltipMsgRemoved = "한글만 입력 가능해요.";
        this.tooltipMsgEmpties = "빈칸을 2칸 이상 입력할 수 없습니다.";
        this.tooltipMsgAllowed = "성공! 멋진 이름이네요.";
        this.eventKey = this.myEventService.KEY_USER_NAME;
        this.checkerKey = "user_name";
    }
    NameComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / ngOnInit / init");
    };
    NameComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / ngAfterViewInit");
        this.asyncViewPack();
    };
    NameComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("name / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("name / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    NameComponent.prototype.setViewPack = function () {
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
    NameComponent.prototype.setMyChecker = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / setMyChecker / 시작");
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker(this.checkerKey);
            if (isDebug)
                console.log("name / setMyChecker / this.myChecker : ", this.myChecker);
        }
    };
    NameComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // checker를 설정합니다.
        this.setMyChecker();
    };
    NameComponent.prototype.isOK = function (input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / isOK / 시작");
        if (null == this.myCheckerService) {
            if (isDebug)
                console.log("name / isOK / 중단 / null == this.myCheckerService");
            return false;
        }
        var isOK = this.myCheckerService.isOK(this.myChecker, input);
        if (isDebug)
            console.log("name / isOK / isOK : ", isOK);
        if (!isOK) {
            var history_1 = this.myCheckerService.getLastHistory();
            if (isDebug)
                console.log("name / isOK / history : ", history_1);
        }
        return isOK;
    };
    // @ Common --> setInput(input:string) :void {
    NameComponent.prototype.setName = function (name) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("name / setName / 시작");
        if (isDebug)
            console.log("name / setName / name : ", name);
        if (this.isOK(name)) {
            if (isDebug)
                console.log("name / setName / updated!");
            this.inputStrPrev = name;
        }
    };
    NameComponent.prototype.initInput = function () {
        this.ngModelInput = "";
        this.inputStrPrev = "";
    };
    NameComponent.prototype.getInput = function () {
        return this.ngModelInput;
    };
    // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
    NameComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    NameComponent.prototype.hasDone = function () {
        var isOK = this.isOK(this.inputStrPrev);
        if (!isOK) {
            var history_2 = this.myCheckerService.getLastHistory();
            console.log("name / history : ", history_2);
        }
        return isOK;
    };
    NameComponent.prototype.onClick = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    NameComponent.prototype.onFocus = function (event, element) {
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    NameComponent.prototype.onKeydownTab = function (event) {
        // 탭 이동으로 다른 input 혹은 버튼으로 이동합니다. 
        // 포커싱을 잃습니다.
        this.isFocus = false;
    };
    NameComponent.prototype.onBlur = function (event, elementInput) {
        event.stopPropagation();
        event.preventDefault();
        if (null == this.myCheckerService) {
            return;
        }
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        // wonder.jung - 입력된 
        var inputStr = elementInput.value;
        this.onCheckInputValid(inputStr);
        /*
        let name:string = elementInput.value;
    
        // 입력한 이름을 검사합니다.
        // 패스워드를 검사합니다.
        if(null != name && "" != name) {
          // 1. 사용자가 입력한 이메일 주소를 검사합니다.
          let isOK:boolean = this.isOK(name);
    
          if(!isOK) {
    
            // 원인을 찾아봅니다.
            let history = this.myCheckerService.getLastHistory();
            console.log("password / onBlur / history : ",history);
    
            if(null != history && null != history.key && null != history.msg) {
              // Do something..
              if("min" === history.key) {
    
                // 최소 문자 갯수보다 적은 경우.
                this.showTooltipFailWarning(history.msg, false);
                  return;
    
              } else if("max" === history.key) {
    
                // 최대 문자 갯수보다 많은 경우.
                this.showTooltipFailWarning(history.msg, false);
    
                // 넘는 문자열은 지웁니다.
                elementInput.value = name = name.slice(0, history.value);
    
                this.isValid = false;
                return;
    
              } else if("regexExclude" === history.key) {
    
                // 정규표현식에 포함되지 않는 문자열인 경우.
                this.showTooltipFailWarning(history.msg, false);
    
                let regExpStr:string = history.value + "";
                let regExpStrNameRange:string =  /[^a-zA-Z가-힣0-9 ]+/g + "";
    
                if(regExpStr == regExpStrNameRange) {
    
                  this.showTooltipFailWarning("이름에 사용할 수 없는 문자가 있어요.", false);
                  let matchArr:string[] = history.matchArr;
                  if(null != matchArr && 0 < matchArr.length) {
                    for (var i = 0; i < matchArr.length; ++i) {
                      let keywordNotAllowed:string = matchArr[i];
                      // 사용할 수 없는 문자들을 지웁니다.
                      elementInput.value = name = name.replace(keywordNotAllowed, "");
                    } // end for
                  } // end if
    
                  this.isValid = false;
                  return;
    
                } // end if
    
              } else {
                // 이에 해당되지 않는 예외 실패.
                this.showTooltipFailWarning(this.tooltipMsgNotAllowed, false);
    
                this.isValid = false;
                return;
    
              } // end if
            } // end if
          } // end if - isOK
    
          // 비속어, 욕설 검사.
          let nameBeforeSanitize:string = name;
          name = this.myCheckerService.sanitizeDirtyWord(name);
    
          if(nameBeforeSanitize != name) {
            // 비속어, 욕설이 제거되었습니다.
            // 사용자에게 금칙어임을 알립니다.
            this.showTooltipFailWarning("금칙어는 제외됩니다.", true);
    
            elementInput.value = name;
            elementInput.focus();
    
            // Logger - Spam 행위로 등록.
            this.myLoggerService.logActionDirtyWord(
              // apiKey:string
              this.watchTower.getApiKey(),
              // dirtyWord:string
              nameBeforeSanitize
            );
    
            return;
    
          } else {
    
            // 성공! 비속어가 포함되지 않았습니다.
            // 이전에 노출한 툴팁을 내립니다.
    
            this.hideWarningTooptip();
            elementInput.value = name;
    
            // 부모 객체에게 정상적인 이름을 전달합니다.
            // 부모 객체에게 Ready Event 발송
            this.emitEventOnChange(
              // eventKey:string
              this.myEventService.KEY_USER_NAME,
              // value:string
              name
            );
    
          } // end if - dirty word
    
          // 마지막 공백 입력이 있다면 공백을 제거해줍니다.
          let regExpLastEmptySpace:RegExp = /[\s]+$/gi;
          elementInput.value = name = name.replace(regExpLastEmptySpace, "");
    
        } // end if - check Name
        */
    }; // end method
    NameComponent.prototype.emitEventOnChange = function (value) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("name / emitEventOnChange / 시작");
        if (null == value) {
            if (isDebug)
                console.log("name / emitEventOnChange / 중단 / value is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        this.eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("name / emitEventOnChange / Done!");
    };
    NameComponent.prototype.emitEventOnChangeNotValid = function (value, metaObj) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("name / emitEventOnChangeNotValid / 시작");
        if (null == value) {
            if (isDebug)
                console.log("name / emitEventOnChangeNotValid / 중단 / value is not valid!");
            return;
        }
        if (null == metaObj) {
            if (isDebug)
                console.log("name / emitEventOnChangeNotValid / 중단 / metaObj is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE_NOT_VALID, 
        // public key:string
        this.eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        metaObj, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (isDebug)
            console.log("name / emitEventOnChangeNotValid / Done!");
    };
    // @ Desc : 실패 툴팁을 보여줍니다.
    NameComponent.prototype.showTooltipFailWarning = function (msg, isTimeout) {
        var isDebug = true;
        // let isDebug:boolean = false;    
        if (isDebug)
            console.log("name / showTooltipFailWarning / init");
        if (isDebug)
            console.log("name / showTooltipFailWarning / msg : ", msg);
        this.isShowTooltip = true;
        this.isFocus = true;
        this.isValid = false;
        this.tooltipMsg = msg;
        if (isDebug)
            console.log("name / showTooltipFailWarning / this.isShowTooltip : ", this.isShowTooltip);
        if (null != isTimeout && isTimeout) {
            if (isDebug)
                console.log("name / showTooltipFailWarning / this.hideTooltipHead(2)");
            this.hideTooltip(2);
        } // end if
    };
    NameComponent.prototype.hideWarningTooptip = function () {
        this.tooltipMsg = null;
        this.isShowTooltip = false;
    };
    NameComponent.prototype.hideTooltip = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 지정된 시간 뒤에 화면에서 지웁니다.
            _self.hideWarningTooptip();
        }, 1000 * sec);
    };
    // @ Desc : 새로 입력받은 값이 문제가 없는지 확인합니다.
    // 입력받은 모든 값은 문자열입니다.
    NameComponent.prototype.onCheckInputValid = function (input) {
        var isDebug = true;
        // let isDebug:boolean = false;    
        if (isDebug)
            console.log("name / onCheckInputValid / init");
        // 여기서 유저가 설정한 조건이 필요합니다.
        // 비어있는 문자열이라면 검사하지 않습니다.
        if (null == input || "" == input) {
            if (isDebug)
                console.log("name / onCheckInputValid / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
            return;
        }
        // 바뀌지 않았다면 검사하지 않습니다.
        if (this.inputStrPrev === input) {
            if (isDebug)
                console.log("name / onCheckInputValid / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        // MyChecker로 검사, 예외 사항에 대한 처리.
        var isOK = this.isOK(input);
        if (!isOK) {
            // 원인을 찾아봅니다.
            var history_3 = this.myCheckerService.getLastHistory();
            if (null != history_3 && null != history_3.key && null != history_3.msg) {
                // 문제 원인 별로 처리해줍니다.
                if ("max" === history_3.key) {
                    // 최대 문자 갯수보다 많은 경우.
                    if (isDebug)
                        console.log("name / onCheckInputValid / 최대 문자 갯수보다 많은 경우.");
                    this.showTooltipFailWarning(history_3.msg, false);
                    // 넘는 문자열은 지웁니다.
                    input = input.slice(0, history_3.value);
                    this.isValid = false;
                    if (isDebug)
                        console.log("name / onCheckInputValid / 최대 문자 갯수보다 많은 경우. / history : ", history_3);
                }
                else if ("min" === history_3.key) {
                    // 최소 문자 갯수보다 적은 경우.
                    if (isDebug)
                        console.log("name / onCheckInputValid / 최소 문자 갯수보다 적은 경우.");
                } // end if
                /*
                } else if("regexInclude" === history.key) {
        
                  // 정규표현식에 포함되지 않은 경우입니다.
                  // 이 객체를 사용하는 외부에서 history를 받아서 처리해줘야 합니다.
                  // 부모 객체는 예외 사항에 파악한뒤, 피드백을 input.component에게 주어야 합니다.
        
        
                } else if("regexExclude" === history.key) {
        
                  // 정규표현식에 포함되지 않은 경우입니다.
                  // 이 객체를 사용하는 외부에서 history를 받아서 처리해줘야 합니다.
                  // 부모 객체는 예외 사항에 파악한뒤, 피드백을 input.component에게 주어야 합니다.
        
                  this.emitEventOnChangeNotValid(
                    // value:string
                    input,
                    // history
                    history
                  );
        
                } // end if
                */
                // 모든 예외 사항에 대해 부모 객체에 전달합니다.
                var metaObj = {
                    view: this,
                    history: history_3
                };
                this.emitEventOnChangeNotValid(
                // value:string
                input, 
                // metaObj
                metaObj);
            } // end if      
        }
        else {
            // 정상적인 값입니다. 
            // 부모 객체에 전파합니다.
            this.emitEventOnChange(input);
        } // end if
    }; // end method
    NameComponent.prototype.onKeyup = function (event, elementInput) {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("name / onKeyup / init");
        event.stopPropagation();
        event.preventDefault();
        var inputStr = elementInput.value;
        this.onCheckInputValid(inputStr);
        // REMOVE ME
        /*
        
        // @ Common
        // 정규 표현식 - regex_include 조건을 위반하는 문자가 있는 경우의 처리.
    
        // 한글이 아닌 문자에 대해서 삭제 처리
        let regExpNotAllowed:RegExp = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]/gi;
        let matchArr:RegExpMatchArray = inputStr.match(regExpNotAllowed);
        if(null != matchArr && 0 < matchArr.length) {
          // 지워야 할 문자를 발견했습니다.
          for (var i = 0; i < matchArr.length; ++i) {
            let match:string = matchArr[i];
            if(null == match || "" == match) {
              continue;
            }
    
            inputStr = inputStr.replace(match, "");
          }
    
          // wonder.jung
          // 예외 문자를 삭제했음을 사용자에게 알려줍니다.
          if(isDebug) console.log("name / onKeyup / 예외 문자를 삭제했음을 사용자에게 알려줍니다.");
          this.showTooltipFailWarning(this.tooltipMsgRemoved, false);
          elementInput.value = this.inputStrPrev = inputStr;
          return;
    
        }
        
        // @ User Custom
        // 2칸 이상 공백에 대해 1칸으로 줄임.
        // 2칸 이상의 공백을 포함하지 않는 조건을 찾아내는 것은 가능
        // 이 조건을 1칸의 공백으로 바꾸는 기능은 지원 불가.
        let regExpEmptySpaces:RegExp = /[\s]{2,10}/gi;
        let matchArrEmptySpaces:RegExpMatchArray = inputStr.match(regExpEmptySpaces);
        if(null != matchArrEmptySpaces && 0 < matchArrEmptySpaces.length) {
          
          for (var i = 0; i < matchArrEmptySpaces.length; ++i) {
            let match:string = matchArrEmptySpaces[i];
            if(null == match || "" == match) {
              continue;
            }
    
            inputStr = inputStr.replace(match, " ");
          }
    
          // wonder.jung
          // 공백 삭제에 대해 사용자에게 메시지로 알려줍니다.
          if(isDebug) console.log("name / onKeyup / 공백 삭제에 대해 사용자에게 메시지로 알려줍니다.");
          this.showTooltipFailWarning(this.tooltipMsgEmpties, false);
          elementInput.value = this.inputStrPrev = inputStr;
          return;
    
        }
    
        // 최대 길이 제한 검사
        let isOK:boolean = this.isOK(inputStr);
        if(!isOK) {
    
          // 원인을 찾아봅니다.
          let history = this.myCheckerService.getLastHistory();
          if(null != history && null != history.key && null != history.msg) {
            // Do something..
            if("max" === history.key) {
    
              // 최대 문자 갯수보다 많은 경우.
              if(isDebug) console.log("name / onKeyup / 최대 문자 갯수보다 많은 경우.");
              this.showTooltipFailWarning(history.msg, false);
    
              // this.tooltipMsg = history.msg;
              // this.hideTooltip(2);
    
              // 넘는 문자열은 지웁니다.
              inputStr = inputStr.slice(0, history.value);
              this.isValid = false;
    
              if(isDebug) console.log("name / onKeyup / 최대 문자 갯수보다 많은 경우. / history : ",history);
            } // end if
          } // end if
    
        } else {
          // 입력된 문자열에 문제가 없습니다. 경고창을 띄웠다면 내립니다.
          if(isDebug) console.log("name / onKeyup / 입력된 문자열에 문제가 없습니다. 경고창을 띄웠다면 내립니다.");
          this.hideWarningTooptip();
    
          // 부모 객체에게 안전한 이름 문자열을 전달합니다.
          this.emitEventOnChange(
            // eventKey:string
            this.myEventService.KEY_USER_NAME,
            // value:string
            inputStr
          );
    
        } // end if
    
        elementInput.value = this.inputStrPrev = inputStr;
        */
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], NameComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NameComponent.prototype, "eventKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NameComponent.prototype, "checkerKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], NameComponent.prototype, "isDisabled", void 0);
    NameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'name',
            templateUrl: 'name.component.html',
            styleUrls: ['name.component.css']
        }), 
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService, my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], NameComponent);
    return NameComponent;
}());
exports.NameComponent = NameComponent;
//# sourceMappingURL=name.component.js.map