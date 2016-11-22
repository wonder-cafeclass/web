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
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_logger_service_1 = require('../../../util/service/my-logger.service');
var MobileComponent = (function () {
    function MobileComponent(myLoggerService) {
        this.myLoggerService = myLoggerService;
        this.top = -1;
        this.left = -1;
        this.topWarning = -1;
        this.leftWarning = -1;
        this.myCheckerService = null;
        this.isSuccessHeadInput = false;
        this.isSuccessBodyInput = false;
        this.isSuccessTailInput = false;
        this.tooltipHeadMsg = null;
        this.tooltipBodyMsg = null;
        this.tooltipTailMsg = null;
        this.tooltipHeadNotAllowed = "전화번호에 문제가 있습니다.";
        this.tooltipHeadAllowed = "성공! 전화번호에 문제가 없습니다.";
        this.isFocus = false;
        this.isFocusInfo = false;
        this.isFocusMobileHead = false;
        this.isFocusMobileBody = false;
        this.isFocusMobileTail = false;
        this.isFocusMobileInfo = false;
        this.mobileHeadPrev = "";
        this.mobileBodyPrev = "";
        this.mobileTailPrev = "";
    }
    MobileComponent.prototype.ngOnInit = function () { };
    MobileComponent.prototype.setMyChecker = function () {
        if (null == this.myCheckerService) {
            return;
        }
        if (null == this.myCheckerMobileHead) {
            this.myCheckerMobileHead = this.myCheckerService.getMyChecker("user_mobile_kor_head");
        }
        if (null == this.myCheckerMobileBody) {
            this.myCheckerMobileBody = this.myCheckerService.getMyChecker("user_mobile_kor_body");
        }
        if (null == this.myCheckerMobileTail) {
            this.myCheckerMobileTail = this.myCheckerService.getMyChecker("user_mobile_kor_tail");
        }
    };
    MobileComponent.prototype.isOKHead = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myCheckerMobileHead, input);
    };
    MobileComponent.prototype.isOKBody = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myCheckerMobileBody, input);
    };
    MobileComponent.prototype.isOKTail = function (input) {
        if (null == this.myCheckerService) {
            return false;
        }
        return this.myCheckerService.isOK(this.myCheckerMobileTail, input);
    };
    MobileComponent.prototype.onMouseOverInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusInfo) {
            this.isFocusInfo = true;
        } // end if
    };
    MobileComponent.prototype.onMouseOutInfo = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusInfo) {
            this.isFocusInfo = false;
        } // end if
    };
    MobileComponent.prototype.onClickMobileHead = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusMobileHead) {
            this.isFocusMobileHead = true;
        } // end if
        this.setMyChecker();
        var inputStr = element.value;
        this.mobileHeadPrev = inputStr;
    };
    MobileComponent.prototype.onFocusMobileHead = function (event, element) {
        this.isFocusMobileHead = true;
        this.setMyChecker();
    };
    MobileComponent.prototype.onKeydownTabMobileHead = function (event, element) {
        this.isFocusMobileHead = true;
    };
    MobileComponent.prototype.onKeydownTabShiftMobileHead = function (event, element) {
        this.isFocusMobileHead = true;
    };
    MobileComponent.prototype.onKeyupHead = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        var isDebug = true;
        // let isDebug:boolean = false;  
        if (isDebug)
            console.log("mobile / onKeyupHead / init");
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("mobile / onKeyupHead / 중단 / 입력된 내용이 없습니다.");
            return;
        }
        if (this.mobileHeadPrev === inputStr) {
            // 방향키로 움직이는 경우를 방어
            if (isDebug)
                console.log("mobile / onKeyupHead / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        // 숫자가 아닌 글자들은 모두 삭제해준다.
        var inputStrFiltered = inputStr.replace(/[^0-9]/gi, "");
        if (element.value != inputStrFiltered) {
            // 툴팁을 보여줍니다.
            this.tooltipHeadMsg = "숫자만 가능합니다.";
            this.isFocusMobileHead = true;
            this.isSuccessHeadInput = false;
            element.focus();
            this.hideTooltipHead(2);
            if (isDebug)
                console.log("mobile / onKeyupHead / 숫자가 아닌 글자들은 모두 삭제해준다.");
            inputStr = inputStrFiltered;
        }
        var max = this.myCheckerMobileHead.max;
        var isOK = true;
        if (0 < max && max < inputStr.length) {
            isOK = false;
        }
        if (isDebug)
            console.log("mobile / onKeyupHead / isOK : ", isOK);
        if (isDebug)
            console.log("mobile / onKeyupHead / max : ", max);
        if (!isOK) {
            // 최대 길이보다 깁니다.
            this.tooltipHeadMsg = "숫자 3자리를 입력해주세요.";
            this.isFocusMobileHead = true;
            this.isSuccessHeadInput = false;
            element.focus();
            this.hideTooltipHead(2);
            // 마지막으로 입력한 문자를 지웁니다.
            inputStr = inputStr.slice(0, (inputStr.length - 1));
            if (isDebug)
                console.log("mobile / onKeyupHead / 마지막으로 입력한 문자를 지웁니다.");
        } // end if
        // 전체 필터 검사를 진행합니다.
        isOK = this.isOKHead(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_1 = this.myCheckerService.getLastHistory();
            if (null != history_1 &&
                null != history_1.key &&
                null != history_1.msg) {
                if (isDebug)
                    console.log("mobile / onKeyupHead / 전체 필터 검사 / history : ", history_1);
                if (isDebug)
                    console.log("mobile / onKeyupHead / 전체 필터 검사 / this.mobileHeadPrev : ", this.mobileHeadPrev);
                if ("regexInclude" === history_1.key) {
                    var regExpStr = history_1.value + "";
                    var regExpStrInputStrRange = /^01[0-9]$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipHeadMsg = "휴대전화 형식이 맞지 않습니다.";
                        this.isFocusMobileHead = true;
                        this.isSuccessHeadInput = false;
                        element.focus();
                        this.hideTooltipHead(2);
                        // 직전 내용으로 롤백.
                        inputStr = this.mobileHeadPrev;
                    }
                }
            } // end inner if
        }
        else {
            // 모든 조건이 맞습니다. 다음 번호 입력창으로 넘어갑니다.
            if (isDebug)
                console.log("mobile / onKeyupHead / 모든 조건이 맞습니다. 다음 번호 입력창으로 넘어갑니다.");
            // this.tooltipHeadMsg = this.tooltipHeadAllowed;
            this.isFocusMobileHead = false;
            this.isSuccessHeadInput = true;
            this.hideTooltipHead(2);
            if (null != elementNext && !this.isSuccessBodyInput) {
                elementNext.focus();
            }
        }
        this.mobileHeadPrev = element.value = inputStr;
    }; // end method
    MobileComponent.prototype.onBlurMobileHead = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("mobile / onBlurMobileHead / init");
        if (this.isFocusMobileHead) {
            this.isFocusMobileHead = false;
        } // end if
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            return;
        }
        var isOK = this.isOKHead(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_2 = this.myCheckerService.getLastHistory();
            if (null != history_2 &&
                null != history_2.key &&
                null != history_2.msg) {
                history_2.value;
                if ("regexInclude" === history_2.key) {
                    var regExpStr = history_2.value + "";
                    var regExpStrInputStrRange = /^01[0-9]$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipHeadMsg = "휴대전화 번호를 다시 확인해주세요.";
                        this.isFocusMobileHead = true;
                        this.isSuccessHeadInput = false;
                        element.focus();
                        // 숫자가 아닌 글자들은 모두 삭제해준다.
                        element.value = inputStr = inputStr.replace(/[^0-9]/gi, "");
                    }
                }
            } // end inner if
        }
        else {
            // 성공! 정상적인 입력입니다.
            // this.tooltipHeadMsg = this.tooltipHeadAllowed;
            this.isFocusMobileHead = false;
            this.isSuccessHeadInput = true;
            this.hideTooltipHead(2);
            if (null != elementNext && !this.isSuccessBodyInput) {
                elementNext.focus();
            }
        } // end if
    };
    MobileComponent.prototype.hideTooltipHead = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipHeadMsg = null;
        }, 1000 * sec);
    };
    MobileComponent.prototype.hideTooltipBody = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipBodyMsg = null;
        }, 1000 * sec);
    };
    MobileComponent.prototype.hideTooltipTail = function (sec) {
        if (null == sec || !(0 < sec)) {
            sec = 3;
        }
        var _self = this;
        setTimeout(function () {
            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.tooltipTailMsg = null;
        }, 1000 * sec);
    };
    MobileComponent.prototype.onClickMobileBody = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocusMobileBody) {
            this.isFocusMobileBody = true;
        } // end if
        this.setMyChecker();
        this.mobileBodyPrev = element.value;
    };
    MobileComponent.prototype.onFocusMobileBody = function (event, element) {
        this.isFocusMobileBody = true;
        this.setMyChecker();
    };
    MobileComponent.prototype.onKeydownTabMobileBody = function (event, element) {
        this.isFocusMobileBody = true;
    };
    MobileComponent.prototype.onKeydownTabShiftMobileBody = function (event, element) {
        this.isFocusMobileBody = true;
    };
    MobileComponent.prototype.onKeyupBody = function (event, element, elementNext) {
        // wonder.jung
        event.stopPropagation();
        event.preventDefault();
        // let isDebug:boolean = true;
        var isDebug = false;
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("mobile / onKeyupBody / 중단 / inputStr is not valid!");
            return;
        }
        if (this.mobileBodyPrev === inputStr) {
            // 방향키로 움직이는 경우를 방어
            if (isDebug)
                console.log("mobile / onKeyupBody / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        // 숫자가 아닌 글자들은 모두 삭제해준다.
        element.value = inputStr.replace(/[^0-9]/gi, "");
        // 툴팁을 보여줍니다.
        if (element.value != inputStr) {
            this.tooltipBodyMsg = "숫자만 가능합니다.";
            this.isFocusMobileBody = true;
            this.isSuccessBodyInput = false;
            element.focus();
            this.hideTooltipBody(2);
        }
        var max = this.myCheckerMobileBody.max;
        var isOK = true;
        if (0 < max && max < inputStr.length) {
            isOK = false;
        }
        if (isDebug)
            console.log("mobile / onKeyupBody / isOK : ", isOK);
        if (isDebug)
            console.log("mobile / onKeyupBody / max : ", max);
        if (!isOK) {
            // 최대 길이보다 깁니다.
            this.tooltipBodyMsg = "숫자 3자리를 입력해주세요.";
            this.isFocusMobileBody = true;
            this.isSuccessBodyInput = false;
            element.focus();
            this.hideTooltipBody(2);
            // 마지막으로 입력한 문자를 지웁니다.
            inputStr = inputStr.slice(0, (inputStr.length - 1));
            if (isDebug)
                console.log("mobile / onKeyupBody / 마지막으로 입력한 문자를 지웁니다.");
        } // end if
        // 전체 필터 검사를 진행합니다.
        isOK = this.isOKBody(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_3 = this.myCheckerService.getLastHistory();
            if (null != history_3 &&
                null != history_3.key &&
                null != history_3.msg) {
                if (isDebug)
                    console.log("mobile / onKeyupBody / 전체 필터 검사 / history : ", history_3);
                if (isDebug)
                    console.log("mobile / onKeyupBody / 전체 필터 검사 / this.mobileBodyPrev : ", this.mobileBodyPrev);
                if ("regexInclude" === history_3.key) {
                    var regExpStr = history_3.value + "";
                    var regExpStrInputStrRange = /^01[0-9]$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipBodyMsg = "휴대전화 형식이 맞지 않습니다.";
                        this.isFocusMobileBody = true;
                        this.isSuccessBodyInput = false;
                        element.focus();
                        this.hideTooltipBody(2);
                        // 직전 내용으로 롤백.
                        inputStr = this.mobileBodyPrev;
                    }
                }
            } // end inner if
        }
        else if (max === inputStr.length) {
            // 사용자가 입력한 전화번호가 가장 긴 4자리인 경우, 입력은 완료한 것으로 판단합니다.
            // 모든 조건이 맞습니다. 
            if (isDebug)
                console.log("mobile / onKeyupBody / 모든 조건이 맞습니다. 다음 번호 입력창으로 넘어갑니다.");
            // this.tooltipBodyMsg = this.tooltipHeadAllowed;
            this.isFocusMobileBody = false;
            this.isSuccessBodyInput = true;
            this.hideTooltipBody(2);
            // 다음 번호 입력창으로 넘어갑니다.
            if (null != elementNext && !this.isSuccessTailInput) {
                elementNext.focus();
                this.isFocusMobileTail = true;
            }
        }
        this.mobileBodyPrev = element.value = inputStr;
    };
    MobileComponent.prototype.onBlurMobileBody = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusMobileBody) {
            this.isFocusMobileBody = false;
        } // end if
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            return;
        }
        var isOK = this.isOKBody(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_4 = this.myCheckerService.getLastHistory();
            if (null != history_4 &&
                null != history_4.key &&
                null != history_4.msg) {
                //min
                if ("min" === history_4.key) {
                    this.tooltipBodyMsg = history_4.msg;
                    this.isFocusMobileBody = true;
                    this.isSuccessBodyInput = false;
                    element.focus();
                }
                else if ("max" === history_4.key) {
                    this.tooltipBodyMsg = history_4.msg;
                    this.isFocusMobileBody = true;
                    this.isSuccessBodyInput = false;
                    element.focus();
                }
                else if ("regexInclude" === history_4.key) {
                    var regExpStr = history_4.value + "";
                    var regExpStrInputStrRange = /^[0-9]{3,4}$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipBodyMsg = "휴대전화 번호를 다시 확인해주세요.";
                        this.isFocusMobileBody = true;
                        this.isSuccessBodyInput = false;
                        element.focus();
                        // 숫자가 아닌 글자들은 모두 삭제해준다.
                        element.value = inputStr = inputStr.replace(/[^0-9]/gi, "");
                    }
                }
            } // end inner if
        }
        else {
            // 성공! 정상적인 입력입니다.
            // this.tooltipBodyMsg = this.tooltipHeadAllowed;
            this.isFocusMobileBody = false;
            this.isSuccessBodyInput = true;
            this.hideTooltipBody(2);
            if (null != elementNext && !this.isSuccessTailInput) {
                elementNext.focus();
            }
        } // end if   
    };
    MobileComponent.prototype.onClickMobileTail = function (event, element, elementPrev) {
        event.stopPropagation();
        event.preventDefault();
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("mobile / onClickMobileTail / init");
        if (!this.isFocusMobileTail) {
            this.isFocusMobileTail = true;
        } // end if
        this.setMyChecker();
        this.mobileTailPrev = element.value;
        // 중간 전화번호 입력이 안되어 있다면 중간 전화번호 입력으로 먼저 이동합니다.
        if (null != elementPrev && (null == elementPrev.value || "" === elementPrev.value)) {
            if (isDebug)
                console.log("mobile / onClickMobileTail / 중간 전화번호 입력이 안되어 있다면 중간 전화번호 입력으로 먼저 이동합니다.");
            this.isFocusMobileTail = false;
            // 사용자에게 안내메시지 노출.
            this.tooltipBodyMsg = "휴대전화 번호를 먼저 확인해주세요.";
            this.isFocusMobileBody = true;
            this.isSuccessBodyInput = false;
            elementPrev.focus();
            this.hideTooltipTail(2);
        }
    };
    MobileComponent.prototype.onFocusMobileTail = function (event, element) {
        this.isFocusMobileTail = true;
        this.setMyChecker();
    };
    MobileComponent.prototype.onKeydownTabMobileTail = function (event, element) {
        this.isFocusMobileTail = true;
    };
    MobileComponent.prototype.onKeydownTabShiftMobileTail = function (event, element) {
        this.isFocusMobileTail = true;
    };
    MobileComponent.prototype.onKeyupTail = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        // wonder.jung
        // let isDebug:boolean = true;
        var isDebug = false;
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            if (isDebug)
                console.log("mobile / onKeyupTail / 중단 / inputStr is not valid!");
            return;
        }
        if (this.mobileTailPrev === inputStr) {
            // 방향키로 움직이는 경우를 방어
            if (isDebug)
                console.log("mobile / onKeyupTail / 중단 / 바뀌지 않았다면 검사하지 않습니다.");
            return;
        }
        // 숫자가 아닌 글자들은 모두 삭제해준다.
        element.value = inputStr.replace(/[^0-9]/gi, "");
        // 툴팁을 보여줍니다.
        if (element.value != inputStr) {
            this.tooltipTailMsg = "숫자만 가능합니다.";
            this.isFocusMobileTail = true;
            this.isSuccessTailInput = false;
            element.focus();
            this.hideTooltipTail(2);
        }
        var max = this.myCheckerMobileTail.max;
        var isOK = true;
        if (0 < max && max < inputStr.length) {
            isOK = false;
        }
        if (isDebug)
            console.log("mobile / onKeyupTail / isOK : ", isOK);
        if (isDebug)
            console.log("mobile / onKeyupTail / max : ", max);
        if (!isOK) {
            // 최대 길이보다 깁니다.
            this.tooltipTailMsg = "숫자 3자리를 입력해주세요.";
            this.isFocusMobileTail = true;
            this.isSuccessTailInput = false;
            element.focus();
            this.hideTooltipTail(2);
            // 마지막으로 입력한 문자를 지웁니다.
            inputStr = inputStr.slice(0, (inputStr.length - 1));
            if (isDebug)
                console.log("mobile / onKeyupTail / 마지막으로 입력한 문자를 지웁니다.");
        } // end if
        // 전체 필터 검사를 진행합니다.
        isOK = this.isOKTail(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_5 = this.myCheckerService.getLastHistory();
            if (null != history_5 &&
                null != history_5.key &&
                null != history_5.msg) {
                if (isDebug)
                    console.log("mobile / onKeyupTail / 전체 필터 검사 / history : ", history_5);
                if (isDebug)
                    console.log("mobile / onKeyupTail / 전체 필터 검사 / this.mobileTailPrev : ", this.mobileTailPrev);
                if ("regexInclude" === history_5.key) {
                    var regExpStr = history_5.value + "";
                    var regExpStrInputStrRange = /^01[0-9]$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipTailMsg = "휴대전화 형식이 맞지 않습니다.";
                        this.isFocusMobileTail = true;
                        this.isSuccessTailInput = false;
                        element.focus();
                        this.hideTooltipTail(2);
                        // 직전 내용으로 롤백.
                        inputStr = this.mobileTailPrev;
                    }
                }
            } // end inner if
        }
        else if (max === inputStr.length) {
            // 사용자가 입력한 전화번호가 가장 긴 4자리인 경우, 입력은 완료한 것으로 판단합니다.
            // 모든 조건이 맞습니다. 
            if (isDebug)
                console.log("mobile / onKeyupTail / 모든 조건이 맞습니다. 전화번호 입력을 종료합니다.");
            // this.tooltipTailMsg = this.tooltipHeadAllowed;
            this.isFocusMobileTail = false;
            this.isSuccessTailInput = true;
            this.hideTooltipTail(2);
            element.blur();
        }
        this.mobileBodyPrev = element.value = inputStr;
    };
    MobileComponent.prototype.onBlurMobileTail = function (event, element, elementNext) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocusMobileTail) {
            this.isFocusMobileTail = false;
        } // end if
        var inputStr = element.value;
        if (null == inputStr || "" == inputStr) {
            return;
        }
        var isOK = this.isOKTail(inputStr);
        if (!isOK) {
            // 조건에 맞지 않습니다.
            // 원인을 찾아봅니다.
            var history_6 = this.myCheckerService.getLastHistory();
            if (null != history_6 &&
                null != history_6.key &&
                null != history_6.msg) {
                //min
                if ("min" === history_6.key) {
                    this.tooltipTailMsg = history_6.msg;
                    this.isFocusMobileTail = true;
                    this.isSuccessTailInput = false;
                    element.focus();
                }
                else if ("max" === history_6.key) {
                    this.tooltipTailMsg = history_6.msg;
                    this.isFocusMobileTail = true;
                    this.isSuccessTailInput = false;
                    element.focus();
                }
                else if ("regexInclude" === history_6.key) {
                    var regExpStr = history_6.value + "";
                    var regExpStrInputStrRange = /^[0-9]{3,4}$/g + "";
                    if (regExpStr == regExpStrInputStrRange) {
                        this.tooltipTailMsg = "휴대전화 번호를 다시 확인해주세요.";
                        this.isFocusMobileTail = true;
                        this.isSuccessTailInput = false;
                        element.focus();
                        // 숫자가 아닌 글자들은 모두 삭제해준다.
                        element.value = inputStr = inputStr.replace(/[^0-9]/gi, "");
                    }
                }
            } // end inner if
        }
        else {
            // 성공! 정상적인 입력입니다.
            // this.tooltipTailMsg = this.tooltipHeadAllowed;
            this.isFocusMobileTail = false;
            this.isSuccessTailInput = true;
            this.hideTooltipTail(2);
            if (null != elementNext) {
                elementNext.focus();
            } // end if
        } // end if 
    }; // end method
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MobileComponent.prototype, "top", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MobileComponent.prototype, "left", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MobileComponent.prototype, "topWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MobileComponent.prototype, "leftWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', my_checker_service_1.MyCheckerService)
    ], MobileComponent.prototype, "myCheckerService", void 0);
    MobileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'mobile',
            templateUrl: 'mobile.component.html',
            styleUrls: ['mobile.component.css']
        }), 
        __metadata('design:paramtypes', [my_logger_service_1.MyLoggerService])
    ], MobileComponent);
    return MobileComponent;
}());
exports.MobileComponent = MobileComponent; // end class
//# sourceMappingURL=mobile.component.js.map