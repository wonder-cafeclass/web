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
var default_meta_1 = require('./model/default-meta');
var default_type_1 = require('./model/default-type');
var my_checker_service_1 = require('../../../util/service/my-checker.service');
var my_event_service_1 = require('../../../util/service/my-event.service');
var my_event_watchtower_service_1 = require('../../../util/service/my-event-watchtower.service');
var my_time_1 = require('../../../util/helper/my-time');
var my_format_1 = require('../../../util/helper/my-format');
var DefaultComponent = (function () {
    function DefaultComponent(myCheckerService, myEventService, watchTower) {
        this.myCheckerService = myCheckerService;
        this.myEventService = myEventService;
        this.watchTower = watchTower;
        // @ Common Props
        this.emitter = new core_1.EventEmitter();
        this.inputStrPrev = "";
        this.tooltipMsg = null;
        this.isShowTooltip = false;
        this.isFocus = false;
        this.isValid = true;
        this.isDisabled = false;
        this.isNoSpace = false;
        this.isNoBorder = false;
        this.isShowTitle = true;
        this.width = -1;
        this.height = -1; // 일부 엘리먼트만 지원됩니다.
        this.numUnit = -1; // 숫자 변경시 최소 변경 단위.
        this.minutesUnit = -1; // 시간 변경시 최소 변경 분 단위.
        this.tailPipeStr = ""; // 숫자 뒤에 들어가는 기호. ex) 10 --> 10명
        this.headPipeStr = ""; // 숫자 앞에 들어가는 기호. ex) 100000 --> ₩100000
        this.hasNumFormat = true; // 3자리 단위 표시 여부. ex) 100000 --> 100,000
        this.widthStr = "";
        this.heightStr = "";
        // @ Desc : 사용자가 입력한 값이 문제 없는지 확인합니다.
        this.lastHistory = null;
        if (this.isDebug())
            console.log("default / constructor / init");
        // set default meta
        this.meta =
            new default_meta_1.DefaultMeta(
            // public title:string
            "No Title", 
            // public placeholder:string
            "No PlaceHolder", 
            // public eventKey:string
            "", 
            // public checkerKey:string
            "", 
            // public type:string
            "");
        if (this.isDebug())
            console.log("default / constructor / meta : ", this.meta);
        if (this.isDebug())
            console.log("default / constructor / this.width : ", this.width);
        this.defaultType = new default_type_1.DefaultType();
        this.myTime = new my_time_1.HelperMyTime();
        this.myFormat = new my_format_1.HelperMyFormat();
    } // end constructor
    DefaultComponent.prototype.isDebug = function () {
        return this.watchTower.isDebug();
    }; // end method
    DefaultComponent.prototype.ngOnInit = function () {
        if (this.isDebug())
            console.log("default / ngOnInit / init");
        if (this.isDebug())
            console.log("default / ngOnInit / meta : ", this.meta);
        if (this.isDebug())
            console.log("default / ngOnInit / this.width : ", this.width);
        if (0 < this.width) {
            this.widthStr = this.width + "px";
        }
        else {
            this.widthStr = "100%";
        }
        if (0 < this.height) {
            this.heightStr = this.height + "px";
        }
        this.asyncViewPack();
    };
    DefaultComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        if (this.isDebug())
            console.log("default / ngAfterViewInit");
    };
    DefaultComponent.prototype.asyncViewPack = function () {
        var _this = this;
        if (this.isDebug())
            console.log("default / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (this.isDebug())
                console.log("default / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (_this.isDebug())
                console.log("default / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe
    };
    DefaultComponent.prototype.setViewPack = function () {
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
    DefaultComponent.prototype.setMyChecker = function () {
        if (this.isDebug())
            console.log("default / setMyChecker / 시작");
        if (null == this.myChecker) {
            this.myChecker = this.myCheckerService.getMyChecker(this.meta.checkerKey);
            if (this.isDebug())
                console.log("default / setMyChecker / this.myChecker : ", this.myChecker);
        }
    };
    DefaultComponent.prototype.init = function () {
        if (this.isDebug())
            console.log("default / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // checker를 설정합니다.
        this.setMyChecker();
        // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
        this.emitEventOnReady();
    };
    DefaultComponent.prototype.isNotOK = function (input) {
        return !this.isOK(input);
    };
    DefaultComponent.prototype.isOK = function (input) {
        if (this.isDebug())
            console.log("default / isOK / 시작");
        if (null == this.myCheckerService) {
            if (this.isDebug())
                console.log("default / isOK / 중단 / null == this.myCheckerService");
            return false;
        }
        var isOK = this.myCheckerService.isOK(this.myChecker, input);
        if (this.isDebug())
            console.log("default / isOK / isOK : ", isOK);
        if (!isOK) {
            var history_1 = this.myCheckerService.getLastHistory();
            if (this.isDebug())
                console.log("default / isOK / history : ", history_1);
        }
        return isOK;
    };
    DefaultComponent.prototype.getLastHistory = function () {
        if (null == this.myCheckerService) {
            return null;
        }
        return this.myCheckerService.getLastHistory();
    };
    DefaultComponent.prototype.getErrorMsg = function () {
        if (null == this.myCheckerService) {
            return null;
        }
        var history = this.myCheckerService.getLastHistory();
        if (null != history && null != history["msg"]) {
            return history["msg"];
        }
        return "";
    };
    DefaultComponent.prototype.setInput = function (input) {
        if (this.isDebug())
            console.log("default / setInput / 시작");
        if (this.isDebug())
            console.log("default / setInput / input : ", input);
        if (input === this.inputStrPrev) {
            if (this.isDebug())
                console.log("default / setInput / 중단 / input === this.inputStrPrev");
            return;
        } // end if
        if (this.isOK(input)) {
            if (this.isDebug())
                console.log("default / setInput / updated!");
            this.inputStrPrev = input;
            this.setInputNgModel(input);
            if (this.meta.type == this.defaultType.TYPE_NUMBER) {
                // 숫자 포맷인 경우, 숫자 관련 추가 처리를 해준다.
                this.updateInputNum(0);
            }
        }
        else {
            var history_2 = this.myCheckerService.getLastHistory();
            if (this.isDebug())
                console.log("default / setInput / history : ", history_2);
        }
    };
    DefaultComponent.prototype.setSelectOption = function (selectOptionList) {
        if (null == selectOptionList) {
            return;
        }
        this.selectOptionList = selectOptionList;
    };
    DefaultComponent.prototype.setCheckOption = function (checkOptionTable) {
        if (null == checkOptionTable || 0 == checkOptionTable.length) {
            return;
        }
        this.checkOptionTable = checkOptionTable;
    };
    DefaultComponent.prototype.initInput = function () {
        this.ngModelInput = "";
        this.inputStrPrev = "";
    };
    DefaultComponent.prototype.getInput = function () {
        return this.ngModelInput;
    };
    DefaultComponent.prototype.hasNotDone = function () {
        return !this.hasDone();
    };
    DefaultComponent.prototype.hasDone = function () {
        if (this.isDebug())
            console.log("default / hasDone / 시작");
        if (this.isDebug())
            console.log("default / hasDone / this.inputStrPrev : ", this.inputStrPrev);
        if (this.isDebug())
            console.log("default / hasDone / this.ngModelInput : ", this.ngModelInput);
        if (this.isDebug())
            console.log("default / hasDone / this.meta : ", this.meta);
        var input = this.inputStrPrev;
        if (null == input || "" === input) {
            input = this.inputStrPrev = this.ngModelInput;
        } // end if
        var isOK = this.isOK(input);
        if (this.defaultType.TYPE_SELECT == this.meta.type) {
            var optionSelected = this.getSelectedDefaultOption();
            if (this.isDebug())
                console.log("default / hasDone / optionSelected : ", optionSelected);
            if (null != optionSelected) {
                input = optionSelected.value;
                if (this.isDebug())
                    console.log("default / hasDone / input : ", input);
            } // end if
            isOK = this.isOK(input);
        }
        else if (this.defaultType.TYPE_CHECKBOX == this.meta.type) {
            var optionListChecked = this.getCheckedDefaultOptionList();
            if (this.isDebug())
                console.log("default / hasDone / optionListChecked : ", optionListChecked);
            for (var i = 0; i < optionListChecked.length; ++i) {
                var optionChecked = optionListChecked[i];
                input = optionChecked.value;
                isOK = this.isOK(input);
                if (!isOK) {
                    break;
                } // end if
            } // end for
        } // end if
        if (this.isDebug())
            console.log("default / hasDone / input : ", input);
        if (!isOK) {
            this.lastHistory = this.myCheckerService.getLastHistory();
            if (this.isDebug())
                console.log("default / hasDone / this.lastHistory : ", this.lastHistory);
        }
        return isOK;
    };
    DefaultComponent.prototype.getHistory = function () {
        return this.lastHistory;
    };
    DefaultComponent.prototype.onClick = function (event, element) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    DefaultComponent.prototype.onClickIncreaseNumber = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isDebug())
            console.log("default / onClickIncreaseNumber / 시작");
        if (0 < this.numUnit) {
            this.updateInputNum(this.numUnit);
        }
    };
    DefaultComponent.prototype.onClickDecreaseNumber = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isDebug())
            console.log("default / onClickDecreaseNumber / 시작");
        if (0 < this.numUnit) {
            this.updateInputNum(-1 * this.numUnit);
        }
    };
    DefaultComponent.prototype.reverseRawNumber = function (numStr) {
        if (this.isDebug())
            console.log("default / reverseRawNumber / 시작");
        if (null == numStr || "" === numStr) {
            if (this.isDebug())
                console.log("default / reverseRawNumber / 중단 / numStr is not valid!");
            return -1;
        } // end if
        if (null != this.tailPipeStr && "" != this.tailPipeStr) {
            numStr = numStr.replace(this.tailPipeStr, "");
        }
        if (this.isDebug())
            console.log("default / reverseRawNumber / 1 / numStr : ", numStr);
        if (null != this.headPipeStr && "" != this.headPipeStr) {
            numStr = numStr.replace(this.headPipeStr, "");
        }
        if (this.isDebug())
            console.log("default / reverseRawNumber / 2 / numStr : ", numStr);
        numStr = numStr.replace(",", "");
        if (this.isDebug())
            console.log("default / reverseRawNumber / 3 / numStr : ", numStr);
        return parseInt(numStr);
    }; // end method
    DefaultComponent.prototype.decorateRawNumber = function (numNext) {
        if (this.isDebug())
            console.log("default / decorateRawNumber / 시작");
        if (this.isDebug())
            console.log("default / decorateRawNumber / numNext : ", numNext);
        if (!(0 < numNext)) {
            if (this.isDebug())
                console.log("default / decorateRawNumber / 중단 / numNext is not valid!");
            return "";
        } // end if
        var numNextStr = "";
        if (this.hasNumFormat) {
            numNextStr = this.myFormat.numberWithCommas(numNext);
        }
        else {
            numNextStr = "" + numNext;
        }
        if (this.isDebug())
            console.log("default / decorateRawNumber / 1 / numNextStr : ", numNextStr);
        if (null != this.tailPipeStr && "" != this.tailPipeStr) {
            numNextStr = numNextStr + this.tailPipeStr;
        }
        if (this.isDebug())
            console.log("default / decorateRawNumber / 2 / numNextStr : ", numNextStr);
        if (null != this.headPipeStr && "" != this.headPipeStr) {
            numNextStr = this.headPipeStr + numNextStr;
        }
        if (this.isDebug())
            console.log("default / decorateRawNumber / 3 / numNextStr : ", numNextStr);
        return numNextStr;
    }; // end method
    DefaultComponent.prototype.updateInputNum = function (numAmountChanged) {
        if (this.isDebug())
            console.log("default / updateInputNum / 시작");
        if (this.isDebug())
            console.log("default / updateInputNum / updateInputNum : ", numAmountChanged);
        var curNumStr = this.ngModelInput;
        if (this.isDebug())
            console.log("default / updateInputNum / curNumStr : ", curNumStr);
        var curNum = this.reverseRawNumber(curNumStr);
        if (this.isDebug())
            console.log("default / updateInputNum / curNum : ", curNum);
        var nextNum = curNum + numAmountChanged;
        if (this.isDebug())
            console.log("default / updateInputNum / nextNum : ", nextNum);
        var error = null;
        if (!this.isOK("" + nextNum)) {
            if (this.isDebug())
                console.log("default / updateInputNum / 중단 / nextNum is not valid!");
            error = this.myCheckerService.getLastHistory();
        }
        if (null != error) {
            if (this.isDebug())
                console.log("default / updateInputNum / error : ", error);
            this.showTooltipFailWarning(error.msg, false);
            return;
        }
        this.hideWarningTooptip();
        // 반드시 0 이상이어야 합니다.
        if (0 <= nextNum) {
            var nextNumStr = this.decorateRawNumber(nextNum);
            if (this.isDebug())
                console.log("default / updateInputNum / nextNumStr : ", nextNumStr);
            this.inputStrPrev = nextNumStr;
            this.setInputNgModel(nextNumStr);
            this.emitEventOnChange("" + nextNum);
        } // end if
    }; // end method
    DefaultComponent.prototype.onClickIncreaseHHMM = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isDebug())
            console.log("default / onClickIncreaseHHMM / 시작");
        if (0 < this.minutesUnit) {
            this.updateInputHHMM(this.minutesUnit);
        }
    };
    DefaultComponent.prototype.onClickDecreaseHHMM = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isDebug())
            console.log("default / onClickDecreaseHHMM / 시작");
        if (0 < this.minutesUnit) {
            this.updateInputHHMM(-1 * this.minutesUnit);
        }
    };
    DefaultComponent.prototype.updateInputHHMM = function (minutesChanged) {
        if (this.isDebug())
            console.log("default / updateInputHHMM / 시작");
        if (this.isDebug())
            console.log("default / updateInputHHMM / minutesChanged : ", minutesChanged);
        var nextHHMM = this.myTime.addMinutesHHMM(this.ngModelInput, minutesChanged);
        var error = null;
        if (!this.isOK(nextHHMM)) {
            if (this.isDebug())
                console.log("default / updateInputHHMM / 중단 / nextNum is not valid!");
            error = this.myCheckerService.getLastHistory();
        }
        if (null != error) {
            if (this.isDebug())
                console.log("default / updateInputHHMM / error : ", error);
            this.showTooltipFailWarning(error.msg, false);
            return;
        }
        this.hideWarningTooptip();
        // UPDATE!
        this.inputStrPrev = nextHHMM;
        this.setInputNgModel(nextHHMM);
        this.emitEventOnChange(this.ngModelInput);
    }; // end method  
    DefaultComponent.prototype.onFocus = function (event, element) {
        if (!this.isFocus) {
            this.isFocus = true;
        } // end if
    };
    DefaultComponent.prototype.onKeydownTab = function (event) {
        // 탭 이동으로 다른 input 혹은 버튼으로 이동합니다. 
        // 포커싱을 잃습니다.
        this.isFocus = false;
    };
    DefaultComponent.prototype.onBlur = function (event, elementInput) {
        if (this.isDebug())
            console.log("default / onBlur / 시작");
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        var inputStr = elementInput.value;
        var isValidInput = this.onCheckInputValid(inputStr, true);
        if (this.isDebug())
            console.log("default / onBlur / isValidInput : ", isValidInput);
        if (isValidInput) {
            if (this.isDebug())
                console.log("default / onBlur / 입력이 문제없습니다.");
            this.hideWarningTooptip();
            this.emitEventOnSubmit(inputStr);
        }
        else {
        }
    }; // end method
    DefaultComponent.prototype.onCheck = function (event, selectedValue, isChecked) {
        if (this.isDebug())
            console.log("default / onCheck / 시작");
        if (this.isDebug())
            console.log("default / onCheck / selectedValue : ", selectedValue);
        if (this.isDebug())
            console.log("default / onCheck / isChecked : ", isChecked);
        var selectedOption = this.getCheckOptionFromTable(selectedValue);
        selectedOption.isFocus = isChecked;
        this.emitEventOnChangeWithMeta(
        // value:string
        selectedValue, 
        // metaObj:any  
        selectedOption);
    };
    DefaultComponent.prototype.getCheckOptionFromTable = function (value) {
        if (this.isDebug())
            console.log("default / getCheckOptionFromTable / 시작");
        if (null == value || "" === value) {
            return null;
        }
        for (var i = 0; i < this.checkOptionTable.length; ++i) {
            var row = this.checkOptionTable[i];
            if (null == row) {
                continue;
            }
            for (var j = 0; j < row.length; ++j) {
                var option = row[j];
                if (null == option) {
                    continue;
                }
                if (this.isDebug())
                    console.log("default / getCheckOptionFromTable / option : ", option);
                if (option.value === value) {
                    return option;
                } // end if
            } // end for
        } // end for
        return null;
    }; // end method
    DefaultComponent.prototype.onSelect = function (event, selectedValue) {
        if (this.isDebug())
            console.log("default / onSelect / 시작");
        if (this.isDebug())
            console.log("default / onSelect / selectedValue : ", selectedValue);
        event.stopPropagation();
        event.preventDefault();
        if (this.isFocus) {
            this.isFocus = false;
        } // end if
        // wonder.jung - 선택된 DefaultOption을 가져와서 metaObj로 전달해줍니다.
        var defaultOption = this.getSelectedDefaultOption();
        if (this.isDebug())
            console.log("default / onSelect / defaultOption : ", defaultOption);
        var isValidInput = this.onCheckInputValidNoEmit(selectedValue, true);
        if (this.isDebug())
            console.log("default / onSelect / isValidInput : ", isValidInput);
        if (isValidInput) {
            if (this.isDebug())
                console.log("default / onSelect / 입력이 문제없습니다.");
            this.hideWarningTooptip();
            if (null != defaultOption && null != defaultOption.metaObj) {
                this.emitEventOnChangeWithMeta(selectedValue, defaultOption.metaObj);
            }
            else {
                this.emitEventOnChange(selectedValue);
            }
        }
        else {
        }
    }; // end method 
    DefaultComponent.prototype.setFocus = function () {
        this.isFocus = true;
        // wonder.jung
        if (this.meta.type === this.defaultType.TYPE_INPUT) {
            var inputEl = document.getElementById("default-input");
            if (null != inputEl) {
                inputEl.focus();
            }
        } // end if
    };
    DefaultComponent.prototype.getSelectedValue = function () {
        var selectedOption = this.getSelectedDefaultOption();
        if (null == selectedOption ||
            null == selectedOption.value ||
            "" === selectedOption.value) {
            return "";
        }
        return selectedOption.value;
    }; // end method
    DefaultComponent.prototype.getSelectedDefaultOption = function () {
        if (this.isDebug())
            console.log("default / getSelectedDefaultOption / 시작");
        if (null == this.selectOptionList || 0 === this.selectOptionList.length) {
            return null;
        } // end if
        for (var i = 0; i < this.selectOptionList.length; ++i) {
            var defaultOption = this.selectOptionList[i];
            if (null == defaultOption) {
                continue;
            } // end if
            if (defaultOption.isFocus) {
                return defaultOption;
            } // end if
        } // end for
        return null;
    };
    DefaultComponent.prototype.getCheckedDefaultOptionList = function () {
        if (this.isDebug())
            console.log("default / getCheckedDefaultOptionList / 시작");
        if (null == this.checkOptionTable || 0 === this.checkOptionTable.length) {
            return null;
        } // end if
        if (this.isDebug())
            console.log("default / getCheckedDefaultOptionList / this.checkOptionTable : ", this.checkOptionTable);
        var checkedOptionList = [];
        for (var i = 0; i < this.checkOptionTable.length; ++i) {
            var row = this.checkOptionTable[i];
            if (null == row) {
                continue;
            }
            for (var j = 0; j < row.length; ++j) {
                var option = row[j];
                if (null == option) {
                    continue;
                }
                if (this.isDebug())
                    console.log("default / getCheckedDefaultOptionList / option : ", option);
                if (option.isFocus) {
                    checkedOptionList.push(option);
                } // end if
            } // end for
        } // end for
        return checkedOptionList;
    };
    DefaultComponent.prototype.getKeyFromSelect = function (value) {
        if (this.isDebug())
            console.log("default / getKeyFromSelect / 시작");
        if (this.isDebug())
            console.log("default / getKeyFromSelect / value : ", value);
        if (null == value || "" === value) {
            return "";
        }
        if (null == this.selectOptionList || 0 === this.selectOptionList.length) {
            return "";
        }
        for (var i = 0; i < this.selectOptionList.length; ++i) {
            var defaultOption = this.selectOptionList[i];
            if (null == defaultOption) {
                continue;
            }
            if (defaultOption.value === value) {
                return defaultOption.key;
            }
        }
        return "";
    };
    DefaultComponent.prototype.emitEventOnReady = function () {
        if (this.isDebug())
            console.log("default / emitEventOnReady / 시작");
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_READY, 
        // public key:string
        this.meta.eventKey, 
        // public value:string
        "", 
        // public metaObj:any
        this, 
        // public myChecker:MyChecker
        this.myCheckerService.getFreePassChecker());
        this.emitter.emit(myEventOnChange);
        if (this.isDebug())
            console.log("default / emitEventOnReady / Done!");
    };
    DefaultComponent.prototype.emitEventOnSubmit = function (value) {
        if (this.isDebug())
            console.log("default / emitEventOnSubmit / 시작");
        if (null == value) {
            if (this.isDebug())
                console.log("default / emitEventOnSubmit / 중단 / value is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_SUBMIT, 
        // public key:string
        this.meta.eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (this.isDebug())
            console.log("default / emitEventOnSubmit / Done!");
    };
    DefaultComponent.prototype.emitEventOnChange = function (value) {
        if (this.isDebug())
            console.log("default / emitEventOnChange / 시작");
        if (null == value) {
            if (this.isDebug())
                console.log("default / emitEventOnChange / 중단 / value is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        this.meta.eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        null, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (this.isDebug())
            console.log("default / emitEventOnChange / Done!");
    };
    DefaultComponent.prototype.emitEventOnChangeWithMeta = function (value, metaObj) {
        if (this.isDebug())
            console.log("default / emitEventOnChangeWithMeta / 시작");
        if (null == value) {
            if (this.isDebug())
                console.log("default / emitEventOnChangeWithMeta / 중단 / value is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE, 
        // public key:string
        this.meta.eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        metaObj, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (this.isDebug())
            console.log("default / emitEventOnChange / Done!");
    };
    DefaultComponent.prototype.emitEventOnChangeNotValid = function (value, metaObj) {
        if (this.isDebug())
            console.log("default / emitEventOnChangeNotValid / 시작");
        if (null == value) {
            if (this.isDebug())
                console.log("default / emitEventOnChangeNotValid / 중단 / value is not valid!");
            return;
        }
        if (null == metaObj) {
            if (this.isDebug())
                console.log("default / emitEventOnChangeNotValid / 중단 / metaObj is not valid!");
            return;
        }
        var myEventOnChange = this.myEventService.getMyEvent(
        // public eventName:string
        this.myEventService.ON_CHANGE_NOT_VALID, 
        // public key:string
        this.meta.eventKey, 
        // public value:string
        value, 
        // public metaObj:any
        metaObj, 
        // public myChecker:MyChecker
        this.myChecker);
        this.emitter.emit(myEventOnChange);
        if (this.isDebug())
            console.log("default / emitEventOnChangeNotValid / Done!");
    };
    // @ Desc : 실패 툴팁을 보여줍니다.
    DefaultComponent.prototype.showTooltipFailWarning = function (msg, isTimeout) {
        if (this.isDebug())
            console.log("default / showTooltipFailWarning / init");
        if (this.isDebug())
            console.log("default / showTooltipFailWarning / msg : ", msg);
        if (this.isDebug())
            console.log("default / showTooltipFailWarning / isTimeout : ", isTimeout);
        this.isShowTooltip = true;
        this.isFocus = true;
        this.isValid = false;
        this.tooltipMsg = msg;
        if (this.isDebug())
            console.log("default / showTooltipFailWarning / this.isShowTooltip : ", this.isShowTooltip);
        if (null != isTimeout && isTimeout) {
            if (this.isDebug())
                console.log("default / showTooltipFailWarning / this.hideTooltipHead(2)");
            this.hideTooltip(2);
        } // end if
    };
    DefaultComponent.prototype.hideWarningTooptip = function () {
        this.tooltipMsg = null;
        this.isValid = true;
        this.isFocus = false;
        this.isShowTooltip = false;
    };
    DefaultComponent.prototype.hideTooltip = function (sec) {
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
    DefaultComponent.prototype.onCheckInputValid = function (input, isBlur) {
        if (this.isDebug())
            console.log("default / onCheckInputValid / init");
        if (this.isDebug())
            console.log("default / onCheckInputValid / input : ", input);
        if ("" === input) {
            // 빈 문자열도 부모 객체에게 모두 지워진 것을 알려줍니다.
            this.emitEventOnChange(input);
            return true;
        } // end if
        // Blur가 아니라면, 비어있는 문자열이라면 검사하지 않습니다.
        if (!isBlur && null == input) {
            if (this.isDebug())
                console.log("default / onCheckInputValid / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
            return true;
        } // end if
        // MyChecker로 검사, 예외 사항에 대한 처리.
        var isNotOK = this.isNotOK(input);
        if (isNotOK) {
            // 원인을 찾아봅니다.
            var history_3 = this.myCheckerService.getLastHistory();
            if (null != history_3 &&
                null != history_3.key &&
                null != history_3.msg) {
                // 문제가 있습니다!
                // 문제 원인 별로 처리해줍니다.
                if ("max" === history_3.key) {
                    // 최대 문자 갯수보다 많은 경우.
                    if (this.isDebug())
                        console.log("default / onCheckInputValid / 최대 문자 갯수보다 많은 경우.");
                    this.showTooltipFailWarning(history_3.msg, false);
                    // 넘는 문자열은 지웁니다.
                    this.inputStrPrev = input = input.slice(0, history_3.value);
                    if (this.isDebug())
                        console.log("default / onCheckInputValid / 최대 문자 갯수보다 많은 경우. / history : ", history_3);
                }
                else if ("min" === history_3.key) {
                    // 최소 문자 갯수보다 적은 경우.
                    if (this.isDebug())
                        console.log("default / onCheckInputValid / 최소 문자 갯수보다 적은 경우.");
                    if (isBlur) {
                        // Blur 모드에서는 사용자가 입력을 완료했다고 판단합니다
                        // 그러므로 최소 글자수보다 작으면 경고를 표시해야 합니다.
                        this.showTooltipFailWarning(history_3.msg, false);
                    }
                    else {
                        // 사용자의 입력을 기다려야 하므로 해야하는 일이 없습니다.
                        // 예외적으로 true 반환.
                        return true;
                    }
                } // end if
                // 모든 예외 사항에 대해 부모 객체에 전달합니다.
                var metaObj = {
                    view: this,
                    history: history_3
                };
                if (this.isDebug())
                    console.log("default / onCheckInputValid / 모든 예외 사항에 대해 부모 객체에 전달합니다.");
                this.emitEventOnChangeNotValid(
                // value:string
                input, 
                // metaObj
                metaObj);
            }
            else {
                // TODO - 문제는 있으나 원인을 발견하지 못했습니다.
                // 내부에서 처리할 수 없으므로 부모에게 전달, 조치합니다.
                if (this.isDebug())
                    console.log("default / onCheckInputValid / 문제는 있으나 원인을 발견하지 못했습니다.");
                this.emitEventOnChangeNotValid(
                // value:string
                input, 
                // metaObj
                null);
            } // end if 
            return false;
        }
        else {
            // 정상적인 값입니다. 
            // 부모 객체에 전파합니다.
            if (this.isDebug())
                console.log("default / onCheckInputValid / 정상적인 값입니다.");
            this.hideWarningTooptip();
            this.emitEventOnChange(input);
            return true;
        } // end if
    }; // end method
    // @ Desc : 새로 입력받은 값이 문제가 없는지 확인합니다.
    // 입력받은 모든 값은 문자열입니다.
    DefaultComponent.prototype.onCheckInputValidNoEmit = function (input, isBlur) {
        if (this.isDebug())
            console.log("default / onCheckInputValid / init");
        if (this.isDebug())
            console.log("default / onCheckInputValid / input : ", input);
        // 여기서 유저가 설정한 조건이 필요합니다.
        // Blur가 아니라면, 비어있는 문자열이라면 검사하지 않습니다.
        if (!isBlur && (null == input || "" == input)) {
            if (this.isDebug())
                console.log("default / onCheckInputValid / 중단 / 비어있는 문자열이라면 검사하지 않습니다.");
            return true;
        }
        // MyChecker로 검사, 예외 사항에 대한 처리.
        var isNotOK = this.isNotOK(input);
        if (isNotOK) {
            // 원인을 찾아봅니다.
            var history_4 = this.myCheckerService.getLastHistory();
            if (null != history_4 &&
                null != history_4.key &&
                null != history_4.msg) {
                // 문제가 있습니다!
                // 문제 원인 별로 처리해줍니다.
                if ("max" === history_4.key) {
                    // 최대 문자 갯수보다 많은 경우.
                    if (this.isDebug())
                        console.log("default / onCheckInputValid / 최대 문자 갯수보다 많은 경우.");
                    this.showTooltipFailWarning(history_4.msg, false);
                    // 넘는 문자열은 지웁니다.
                    this.inputStrPrev = input = input.slice(0, history_4.value);
                    if (this.isDebug())
                        console.log("default / onCheckInputValid / 최대 문자 갯수보다 많은 경우. / history : ", history_4);
                }
                else if ("min" === history_4.key) {
                    // 최소 문자 갯수보다 적은 경우.
                    if (this.isDebug())
                        console.log("default / onCheckInputValid / 최소 문자 갯수보다 적은 경우.");
                    if (isBlur) {
                        // Blur 모드에서는 사용자가 입력을 완료했다고 판단합니다
                        // 그러므로 최소 글자수보다 작으면 경고를 표시해야 합니다.
                        this.showTooltipFailWarning(history_4.msg, false);
                    }
                    else {
                        // 사용자의 입력을 기다려야 하므로 해야하는 일이 없습니다.
                        // 예외적으로 true 반환.
                        return true;
                    }
                } // end if
            } // end if
            return false;
        } // end if
        return true;
    }; // end method  
    DefaultComponent.prototype.onKeyup = function (event, elementInput, value) {
        if (this.isDebug())
            console.log("default / onKeyup / init");
        if (this.isDebug())
            console.log("default / onKeyup / this.ngModelInput : ", this.ngModelInput);
        event.stopPropagation();
        event.preventDefault();
        // 1. 숫자 입력
        // 2. 문자 입력 
        var inputStr = this.ngModelInput;
        if (inputStr == this.inputStrPrev) {
            if (this.isDebug())
                console.log("default / onKeyup / 중단 / 동일한 내용이라면 중단합니다.");
            return;
        }
        // 입력이 완료되는 onBlur에서만 검사해야 하는 항목들은 제외합니다.
        if (this.myEventService.KEY_USER_EMAIL === this.meta.eventKey) {
            if (this.isDebug())
                console.log("default / onKeyup / 중단 / 입력이 완료되는 onBlur에서만 검사해야 하는 항목들은 제외합니다.");
            this.inputStrPrev = inputStr;
            return;
        }
        var isValidInput = this.onCheckInputValid(inputStr, false);
        if (this.isDebug())
            console.log("default / onKeyup / isValidInput : ", isValidInput);
        if (isValidInput) {
            if (this.isDebug())
                console.log("default / onKeyup / 입력이 문제없습니다. 저장합니다.");
            this.inputStrPrev = inputStr;
            this.hideWarningTooptip();
        }
        else {
            if (this.isDebug())
                console.log("default / onKeyup / 입력이 유효하지 않습니다. 이전으로 되돌립니다.");
            this.setInputNgModel(this.inputStrPrev);
            if (this.isDebug())
                console.log("default / onKeyup / 입력이 유효하지 않습니다. 이전으로 되돌립니다. / Done");
        } // end if
    }; // end method - keyup
    DefaultComponent.prototype.setInputNgModel = function (newInput) {
        if (this.isDebug())
            console.log("default / setInputNgModel / init");
        if (this.ngModelInput === newInput) {
            if (this.isDebug())
                console.log("default / setInputNgModel / 중단 / this.ngModelInput === newInput");
            return;
        }
        this.ngModelInput = newInput;
    }; // end method
    DefaultComponent.prototype.getEventKey = function () {
        if (this.meta.hasEventKey()) {
            return this.meta.eventKey;
        }
        return "";
    };
    DefaultComponent.prototype.hasEventKey = function (eventKey) {
        if (null == eventKey || "" === eventKey) {
            return false;
        }
        if (eventKey === this.getEventKey()) {
            return true;
        }
        return false;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DefaultComponent.prototype, "emitter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DefaultComponent.prototype, "ngModelInput", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', default_meta_1.DefaultMeta)
    ], DefaultComponent.prototype, "meta", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DefaultComponent.prototype, "isDisabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DefaultComponent.prototype, "isNoSpace", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DefaultComponent.prototype, "isNoBorder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DefaultComponent.prototype, "isShowTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DefaultComponent.prototype, "width", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DefaultComponent.prototype, "height", void 0);
    __decorate([
        // 일부 엘리먼트만 지원됩니다.
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DefaultComponent.prototype, "numUnit", void 0);
    __decorate([
        // 숫자 변경시 최소 변경 단위.
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DefaultComponent.prototype, "minutesUnit", void 0);
    __decorate([
        // 시간 변경시 최소 변경 분 단위.
        core_1.Input(), 
        __metadata('design:type', String)
    ], DefaultComponent.prototype, "tailPipeStr", void 0);
    __decorate([
        // 숫자 뒤에 들어가는 기호. ex) 10 --> 10명
        core_1.Input(), 
        __metadata('design:type', String)
    ], DefaultComponent.prototype, "headPipeStr", void 0);
    __decorate([
        // 숫자 앞에 들어가는 기호. ex) 100000 --> ₩100000
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DefaultComponent.prototype, "hasNumFormat", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], DefaultComponent.prototype, "selectOptionList", void 0);
    __decorate([
        // 셀렉 박스 선택 정보로 사용.
        core_1.Input(), 
        __metadata('design:type', Array)
    ], DefaultComponent.prototype, "checkOptionTable", void 0);
    DefaultComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'widget-input-default',
            templateUrl: 'default.component.html',
            styleUrls: ['default.component.css']
        }), 
        __metadata('design:paramtypes', [my_checker_service_1.MyCheckerService, my_event_service_1.MyEventService, my_event_watchtower_service_1.MyEventWatchTowerService])
    ], DefaultComponent);
    return DefaultComponent;
}());
exports.DefaultComponent = DefaultComponent; // end class
// TODO - Dirty word list 검수 과정 필요! 
//# sourceMappingURL=default.component.js.map