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
var http_1 = require('@angular/http');
var my_checker_1 = require('../model/my-checker');
var url_service_1 = require("../../util/url.service");
var my_extractor_1 = require('../../util/http/my-extractor');
var MyCheckerService = (function () {
    function MyCheckerService(us, http) {
        this.us = us;
        this.http = http;
        this.apiGetChecker = '/CI/index.php/api/admin/checker';
        this.TYPE_STRING = "TYPE_STRING";
        this.TYPE_NUMBER = "TYPE_NUMBER";
        this.TYPE_ARRAY = "TYPE_ARRAY";
        this.REGEX_SAFE_STR = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20\s\(\)\.\:\;?\!\=\'\"`\^\(\)\&\~]/g;
        this.MIN_STR_SAFE_TITLE = 2;
        this.MAX_STR_SAFE_TITLE = 48;
        this.MIN_STR_SAFE_COMMENT = 2;
        this.MAX_STR_SAFE_COMMENT = 120;
        this.regExpIsStr = /is_str/i;
        this.regExpIsNumber = /is_number/i;
        this.regExpExactLength = /exact_length\[([\d]+)\]/i;
        this.regExpMinLength = /min_length\[([\d]+)\]/i;
        this.regExpMaxLength = /max_length\[([\d]+)\]/i;
        this.regExpRegExExcludeMatch = /regex_match_exclude\[(.+)\]/i;
        this.regExpRegExIncludeMatch = /regex_match_include\[(.+)\]/i;
        // @ Referer : http://jsfiddle.net/ghvj4gy9/embedded/result,js/
        this.regValidEmail = /valid_emails/i;
        this.EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // is_natural_no_zero
        this.regIsNaturalNoZero = /is_natural_no_zero/i;
        // is_unique
        this.regExpIsUnique = /is_unique\[(.+)\]/i;
        // matches
        this.regExpMatches = /matches\[(.+)\]/i;
        // greaterThan
        this.regExpGreaterThan = /greater_than\[(.+)\]/i;
        // greaterThanEqualTo
        this.regExpGreaterThanEqualTo = /greater_than_equal_to\[(.+)\]/i;
        // lessThan
        this.regExpLessThan = /less_than\[(.+)\]/i;
        // lessThanEqualTo
        this.regExpLessThanEqualTo = /less_than_equal_to\[(.+)\]/i;
        this.regExpDBQueryUnique = /is_unique\[(.+)\]/i;
        this.myExtractor = new my_extractor_1.MyExtractor();
    }
    // @ Desc : 외부에서 my-checker를 강제로 세팅할 경우에 사용.
    MyCheckerService.prototype.setReady = function (checkerMap, constMap, dirtyWordList, apiKey) {
        if (null == checkerMap) {
            return;
        }
        if (null == constMap) {
            return;
        }
        if (null == dirtyWordList) {
            return;
        }
        if (null == apiKey || "" == apiKey) {
            return;
        }
        this.checkerMap = checkerMap;
        this.constMap = constMap;
        this.dirtyWordList = dirtyWordList;
        this.apiKey = apiKey;
    };
    MyCheckerService.prototype.getCheckerMap = function () {
        return this.checkerMap;
    };
    MyCheckerService.prototype.getConstMap = function () {
        return this.constMap;
    };
    MyCheckerService.prototype.getDirtyWordList = function () {
        return this.dirtyWordList;
    };
    MyCheckerService.prototype.getAPIKey = function () {
        return this.apiKey;
    };
    MyCheckerService.prototype.getLastHistory = function () {
        return this.history;
    };
    // @ Desc : 서버에서 받아온 checker json 파일에 있는 filterKey를 넘겨 받으면 이를 기반으로 MyChecker 객체를 만들어 돌려줍니다.
    MyCheckerService.prototype.getMyChecker = function (filterKey) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-checker.service / getMyChecker / 시작");
        if (null == this.checkerMap) {
            console.log("!Error! / my-checker.service / null == this.checkerMap");
            return null;
        }
        if (null == filterKey || "" == filterKey) {
            console.log("!Error! / my-checker.service / filterKey is not valid!");
            return null;
        }
        if (null == this.checkerMap[filterKey]) {
            console.log("!Error! / my-checker.service / null == this.checkerMap[filterKey]");
            return null;
        }
        var filters = this.checkerMap[filterKey];
        if (null == filters || "" == filters) {
            console.log("!Error! / my-checker.service / filters is not valid!");
            return null;
        }
        // 내부 필터링 조건을 배열로 분해.
        var filterArr = filters.split("|||");
        if (null == filterArr || 0 == filterArr.length) {
            console.log("!Error! / my-checker.service / filterArr is not valid!");
            return null;
        }
        var myChecker = this.getMyCheckerByFilters(filterArr);
        return myChecker;
    };
    // @ Desc : 사용자가 지정한 필터들로 MyChecker 객체를 만들어 돌려줍니다.
    MyCheckerService.prototype.getMyCheckerByFilters = function (filterArr) {
        if (null == filterArr || 0 == filterArr.length) {
            return null;
        }
        // let isDebug:boolean = true;
        var isDebug = false;
        var type = ""; // @ Required
        // Type : String
        var minLength = -1;
        var maxLength = -1;
        var uniqueTable = "";
        var uniqueColumn = "";
        var matches = [];
        // Type : Number
        var greaterThan = -1;
        var greaterThanEqualTo = -1;
        var lessThan = -1;
        var lessThanEqualTo = -1;
        var regexInclude = null;
        var regexIncludeArr = [];
        var regexExclude = null;
        var regexExcludeArr = [];
        var dbQueryUnique = "";
        for (var i = 0; i < filterArr.length; ++i) {
            var filter = filterArr[i];
            // 필터 - 문자열 타입?
            var isTypeStr = this.isTypeStr(filter);
            if (isTypeStr) {
                type = this.TYPE_STRING;
                continue;
            }
            // 필터 - 숫자 타입?
            var isTypeNumber = this.isTypeNumber(filter);
            if (isTypeNumber) {
                type = this.TYPE_NUMBER;
                continue;
            }
            // 필터 - 문자열 고정 문자수
            var exactLengthReceived = this.getExactLength(filter);
            if (-1 < exactLengthReceived) {
                minLength = exactLengthReceived;
                maxLength = exactLengthReceived;
                type = this.TYPE_STRING;
                continue;
            } // end if
            // 필터 - 문자열 최소 문자수
            var minLengthReceived = this.getMinLength(filter);
            if (-1 < minLengthReceived) {
                minLength = minLengthReceived;
                type = this.TYPE_STRING;
                continue;
            } // end if
            // 필터 - 문자열 최대 문자수
            var maxLengthReceived = this.getMaxLength(filter);
            if (-1 < maxLengthReceived) {
                maxLength = maxLengthReceived;
                type = this.TYPE_STRING;
                continue;
            } // end if
            // 필터 - 정상 이메일 검증
            var regExpValidEmailReceived = this.getValidEmails(filter);
            if (null != regExpValidEmailReceived) {
                type = this.TYPE_STRING;
                regexInclude = regExpValidEmailReceived;
                continue;
            } // end if
            // 필터 - 자연수만 허용
            var isNaturalNoZero = this.getNaturalNoZero(filter);
            if (isNaturalNoZero) {
                type = this.TYPE_NUMBER;
                greaterThanEqualTo = 1;
                continue;
            }
            // 핕터 - unique. DB에서 해당 값이 유일해야 함. DB 조회 및 검증은 사용하는 뷰에서 진행.
            var tableNColumnObj = this.getIsUnique(filter);
            if (tableNColumnObj.table != "" && tableNColumnObj.column != "") {
                type = this.TYPE_STRING;
                uniqueTable = tableNColumnObj.table;
                uniqueColumn = tableNColumnObj.column;
                continue;
            }
            // 필터 - matches. const map에서 지정된 key 배열에 포함된 인자라면 ok.
            var matchesReceived = this.getMatcheFromConstMap(filter);
            if (null != matchesReceived && 0 < matchesReceived.length) {
                type = this.TYPE_STRING;
                matches = matchesReceived;
                continue;
            }
            // 필터 - greaterThan
            var greaterThanReceived = this.getGreaterThan(filter);
            if (null != greaterThanReceived && 0 < greaterThanReceived) {
                type = this.TYPE_NUMBER;
                greaterThan = greaterThanReceived;
                continue;
            }
            // 필터 - greaterThanEqualTo
            var greaterThanEqualToReceived = this.getGreaterThanEqualTo(filter);
            if (null != greaterThanEqualToReceived && 0 < greaterThanEqualToReceived) {
                type = this.TYPE_NUMBER;
                greaterThanEqualTo = greaterThanEqualToReceived;
                continue;
            }
            // 필터 - lessThan
            var lessThanReceived = this.getLessThan(filter);
            if (null != lessThanReceived && 0 < lessThanReceived) {
                type = this.TYPE_NUMBER;
                lessThan = lessThanReceived;
                continue;
            }
            // 필터 - lessThanEqualTo
            var lessThanEqualToReceived = this.getLessThanEqualTo(filter);
            if (null != lessThanEqualToReceived && 0 < lessThanEqualToReceived) {
                type = this.TYPE_NUMBER;
                lessThanEqualTo = lessThanEqualToReceived;
                continue;
            }
            // 필터 - 정규표현식 일반 - 제외할 문자만 찾음
            var regExpExcludeRecevied = this.getRegExExcludeMatch(filter);
            if (null != regExpExcludeRecevied) {
                regexExclude = regExpExcludeRecevied;
                regexExcludeArr.push(regexExclude);
                continue;
            } // end if
            // 필터 - 정규표현식 일반 - 허용할 문자만 찾음
            var regExpIncludeRecevied = this.getRegExIncludeMatch(filter);
            if (null != regExpIncludeRecevied) {
                regexInclude = regExpIncludeRecevied;
                regexIncludeArr.push(regexInclude);
                continue;
            } // end if
            // 필터 - DB Query Unique
            var dbQueryUniqueReceived = this.getRegExpDBQueryUnique(filter);
            if (null != dbQueryUniqueReceived) {
                type = this.TYPE_STRING;
                dbQueryUnique = dbQueryUniqueReceived;
                continue;
            } // end if
        }
        // DEBUG
        if (isDebug) {
            console.log("my-checker / getMyCheckerByFilters / type : ", type);
            console.log("my-checker / getMyCheckerByFilters / minLength : ", minLength);
            console.log("my-checker / getMyCheckerByFilters / maxLength : ", maxLength);
            console.log("my-checker / getMyCheckerByFilters / uniqueTable : ", uniqueTable);
            console.log("my-checker / getMyCheckerByFilters / uniqueColumn : ", uniqueColumn);
            console.log("my-checker / getMyCheckerByFilters / matches : ", matches);
            console.log("my-checker / getMyCheckerByFilters / greaterThan : ", greaterThan);
            console.log("my-checker / getMyCheckerByFilters / greaterThanEqualTo : ", greaterThanEqualTo);
            console.log("my-checker / getMyCheckerByFilters / lessThan : ", lessThan);
            console.log("my-checker / getMyCheckerByFilters / lessThanEqualTo : ", lessThanEqualTo);
            console.log("my-checker / getMyCheckerByFilters / regexExclude : ", regexExclude);
            console.log("my-checker / getMyCheckerByFilters / regexInclude : ", regexInclude);
            console.log("my-checker / getMyCheckerByFilters / dbQueryUnique : ", dbQueryUnique);
        }
        // 핕터를 모두 확인했습니다. 
        // MyChecker 객체를 만듭니다.
        if (null == type || "" == type) {
            return null;
        }
        var myChecker = null;
        if (this.TYPE_STRING === type) {
            myChecker =
                new my_checker_1.MyChecker(
                // public type:string,
                type, 
                // public min:number,
                minLength, 
                // public max:number,
                maxLength, 
                // public regexExclude:RegExp
                regexExclude);
            if (null != uniqueTable &&
                "" != uniqueTable &&
                null != uniqueColumn &&
                "" != uniqueColumn) {
                myChecker.uniqueTable = uniqueTable;
                myChecker.uniqueColumn = uniqueColumn;
            }
            if (null != regexExclude) {
                myChecker.regexExclude = regexExclude;
            }
            if (null != regexInclude) {
                myChecker.regexInclude = regexInclude;
            }
            if (null != regexExcludeArr) {
                myChecker.regexExcludeArr = regexExcludeArr;
            }
            if (null != regexIncludeArr) {
                myChecker.regexIncludeArr = regexIncludeArr;
            }
            if (null != matches && 0 < matches.length) {
                myChecker.matches = matches;
            }
            if (null != dbQueryUnique && "" != dbQueryUnique) {
                myChecker.dbQueryUnique = dbQueryUnique;
            }
        }
        else if (this.TYPE_NUMBER === type) {
            myChecker =
                new my_checker_1.MyChecker(
                // public type:string,
                type, 
                // public min:number,
                -1, 
                // public max:number,
                -1, 
                // public regexExclude:RegExp
                regexExclude);
            if (-1 < greaterThan) {
                myChecker.greaterThan = greaterThan;
            }
            if (-1 < greaterThanEqualTo) {
                myChecker.greaterThanEqualTo = greaterThanEqualTo;
            }
            if (-1 < lessThan) {
                myChecker.lessThan = lessThan;
            }
            if (-1 < lessThanEqualTo) {
                myChecker.lessThanEqualTo = lessThanEqualTo;
            }
        }
        return myChecker;
    };
    MyCheckerService.prototype.isTypeStr = function (filter) {
        if (null == filter || 0 == filter.length) {
            return false;
        }
        var matchArr = filter.match(this.regExpIsStr);
        if (null != matchArr) {
            return true;
        }
        return false;
    };
    MyCheckerService.prototype.isTypeNumber = function (filter) {
        if (null == filter || 0 == filter.length) {
            return false;
        }
        var matchArr = filter.match(this.regExpIsNumber);
        if (null != matchArr) {
            return true;
        }
        return false;
    };
    MyCheckerService.prototype.getExactLength = function (filter) {
        if (null == filter || 0 == filter.length) {
            return -1;
        }
        /*
            ex) "min_length[2]"
            
            result)
            Array[2]
            [
                0:"min_length[2]",
                1:"2"
            ];
        */
        var matchArr = filter.match(this.regExpExactLength);
        if (null != matchArr && 2 == matchArr.length) {
            return parseInt(matchArr[1]);
        }
        return -1;
    };
    MyCheckerService.prototype.getMinLength = function (filter) {
        if (null == filter || 0 == filter.length) {
            return -1;
        }
        /*
            ex) "min_length[2]"
            
            result)
            Array[2]
            [
                0:"min_length[2]",
                1:"2"
            ];
        */
        var matchArr = filter.match(this.regExpMinLength);
        if (null != matchArr && 2 == matchArr.length) {
            return parseInt(matchArr[1]);
        }
        return -1;
    };
    MyCheckerService.prototype.getMaxLength = function (filter) {
        // ex) "max_length[32]"
        if (null == filter || 0 == filter.length) {
            return -1;
        }
        var matchArr = filter.match(this.regExpMaxLength);
        if (null != matchArr && 2 == matchArr.length) {
            return parseInt(matchArr[1]);
        }
        return -1;
    };
    MyCheckerService.prototype.getRegExExcludeMatch = function (filter) {
        // ex) regex_match[/^[a-zA-Z가-힣0-9]+$/]
        if (null == filter || 0 == filter.length) {
            return null;
        }
        var matchArr = filter.match(this.regExpRegExExcludeMatch);
        if (null != matchArr && 2 == matchArr.length) {
            var patternStr = matchArr[1];
            // Escape backslash for RegExp
            // "^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$" --> "^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$"
            patternStr = patternStr.replace("\\", "\\\\");
            // Remove first & last slashes
            patternStr = patternStr.replace(/(^\/|\/$)/gi, "");
            var re = new RegExp(patternStr, 'g');
            return re;
        }
        return null;
    };
    MyCheckerService.prototype.getRegExIncludeMatch = function (filter) {
        // ex) regex_match[/^[a-zA-Z가-힣0-9]+$/]
        if (null == filter || 0 == filter.length) {
            return null;
        }
        var matchArr = filter.match(this.regExpRegExIncludeMatch);
        if (null != matchArr && 2 == matchArr.length) {
            var patternStr = matchArr[1];
            // Escape backslash for RegExp
            // "^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$" --> "^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$"
            patternStr = patternStr.replace("\\", "\\\\");
            // Remove first & last slashes
            patternStr = patternStr.replace(/(^\/|\/$)/gi, "");
            var re = new RegExp(patternStr, 'g');
            return re;
        }
        return null;
    };
    MyCheckerService.prototype.getValidEmails = function (filter) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug) {
            console.log("my-checker / getValidEmails / filter : ", filter);
        }
        // ex) "user_email":"valid_emails"
        if (null == filter || 0 == filter.length) {
            return null;
        }
        var matchArr = filter.match(this.regValidEmail);
        if (isDebug) {
            console.log("my-checker / getValidEmails / matchArr : ", matchArr);
        }
        if (null != matchArr && 1 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return this.EMAIL_REGEX;
        }
        return null;
    };
    MyCheckerService.prototype.getNaturalNoZero = function (filter) {
        // ex) "user_email":"valid_emails"
        if (null == filter || 0 == filter.length) {
            return false;
        }
        if (null == filter || 0 == filter.length) {
            return false;
        }
        var matchArr = filter.match(this.regIsNaturalNoZero);
        if (null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return true;
        }
        return false;
    };
    MyCheckerService.prototype.getIsUnique = function (filter) {
        // ex) "user_email":"is_unique[user.nickname]"
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug) {
            console.log("my-checker / getIsUnique / filter : ", filter);
        }
        var tableNColumnObj = {
            table: "",
            column: ""
        };
        if (null == filter || 0 == filter.length) {
            return tableNColumnObj;
        }
        var matchArr = filter.match(this.regExpIsUnique);
        var tableNColumn = "";
        if (null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            tableNColumn = matchArr[1];
        }
        var tableNColumnArr;
        if (null != tableNColumn && 0 < tableNColumn.length) {
            tableNColumnArr = tableNColumn.split(".");
        }
        if (null != tableNColumnArr && 2 == tableNColumnArr.length) {
            tableNColumnObj["table"] = tableNColumnArr[0];
            tableNColumnObj["column"] = tableNColumnArr[1];
        }
        if (isDebug) {
            console.log("my-checker / getIsUnique / tableNColumnObj : ", tableNColumnObj);
        }
        return tableNColumnObj;
    };
    MyCheckerService.prototype.getMatcheFromConstMap = function (filter) {
        // ex) "user_email":"is_unique[user.nickname]"
        var matches = [];
        if (null == filter || 0 == filter.length) {
            return matches;
        }
        if (null != this.constMap) {
            return matches;
        }
        var matchArr = filter.match(this.regExpMatches);
        var keyMatches = "";
        if (null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            keyMatches = matchArr[1];
        }
        if (null != keyMatches &&
            0 < keyMatches.length &&
            null != this.constMap[keyMatches]) {
            matches = this.constMap[keyMatches];
        }
        return matches;
    };
    MyCheckerService.prototype.getGreaterThan = function (filter) {
        // ex) "user_email":"is_unique[user.nickname]"
        if (null == filter || 0 == filter.length) {
            return -1;
        }
        var matchArr = filter.match(this.regExpGreaterThan);
        var keyMatches = "";
        if (null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return parseInt(matchArr[1]);
        }
        return -1;
    };
    MyCheckerService.prototype.getGreaterThanEqualTo = function (filter) {
        // ex) "user_email":"is_unique[user.nickname]"
        if (null == filter || 0 == filter.length) {
            return -1;
        }
        var matchArr = filter.match(this.regExpGreaterThanEqualTo);
        var keyMatches = "";
        if (null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return parseInt(matchArr[1]);
        }
        return -1;
    };
    MyCheckerService.prototype.getLessThan = function (filter) {
        // ex) "user_email":"is_unique[user.nickname]"
        if (null == filter || 0 == filter.length) {
            return -1;
        }
        var matchArr = filter.match(this.regExpLessThan);
        var keyMatches = "";
        if (null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return parseInt(matchArr[1]);
        }
        return -1;
    };
    MyCheckerService.prototype.getLessThanEqualTo = function (filter) {
        // ex) "user_email":"is_unique[user.nickname]"
        if (null == filter || 0 == filter.length) {
            return -1;
        }
        var matchArr = filter.match(this.regExpLessThanEqualTo);
        var keyMatches = "";
        if (null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return parseInt(matchArr[1]);
        }
        return -1;
    };
    MyCheckerService.prototype.getRegExpDBQueryUnique = function (filter) {
        // ex) is_unique[user.nickname]
        if (null == filter || 0 == filter.length) {
            return null;
        }
        var matchArr = filter.match(this.regExpRegExIncludeMatch);
        return "";
    };
    MyCheckerService.prototype.getChecker = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("my-checker.service / getChecker / 시작");
        var req_url = this.us.get(this.apiGetChecker);
        if (isDebug)
            console.log("my-checker.service / getChecker / req_url : ", req_url);
        return this.http.get(req_url)
            .toPromise()
            .then(this.myExtractor.extractData)
            .catch(this.myExtractor.handleError);
    };
    /*
    private extractData(res: Response) {

        let body = res.json();

        console.log("MyCheckerService / extractData / body ::: ",body);

        // TODO - 데이터 검증 프로세스.
        if(null == body.data || !body.success) {
          console.log("MyCheckerService / extractData / 데이터가 없습니다.");
          return null;
        }

        console.log("MyCheckerService / extractData / 3");

        return body.data;
    }
    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
    */
    MyCheckerService.prototype.isOK = function (myChecker, input) {
        // let isDebug:boolean = true;
        var isDebug = false;
        this.history = {
            myChecker: myChecker,
            input: input,
            reason: "",
            success: true,
            msg: ""
        };
        if (undefined === myChecker || null === myChecker) {
            this.history.reason = "null === myChecker";
            this.history.success = false;
            if (isDebug) {
                console.log("my-checker / isOK / myChecker is not valid!");
            }
            return false;
        }
        if (undefined === input || null === input) {
            this.history.reason = "null === input";
            this.history.success = false;
            if (isDebug) {
                console.log("my-checker / isOK / input is not valid!");
            }
            return false;
        }
        if (this.TYPE_STRING === myChecker.type) {
            if ('string' != typeof input) {
                this.history.reason = "'string' != typeof input";
                this.history.success = false;
                if (isDebug) {
                    console.log("my-checker / isOK / 'string' != typeof input");
                }
                return false;
            }
            if (isDebug) {
                console.log("my-checker / isOK / myChecker : ", myChecker);
            }
            var inputStr = input;
            var regexExclude = myChecker.regexExclude;
            if (null != regexExclude) {
                // 1. 정규표현식에 포함되지 말아야할 문자가 이는지 검사.
                var matchArr = inputStr.match(regexExclude);
                if (null != matchArr && 0 < matchArr.length) {
                    this.history.reason =
                        "target string is not allowed with regexExclude : " + regexExclude;
                    this.history.success = false;
                    this.history.matchArr = matchArr;
                    this.history.msg = myChecker.msg = "허용되지 않는 문자가 포함되어 있습니다. : " + matchArr.join(",");
                    this.history.key = "regexExclude";
                    this.history.value = regexExclude;
                    this.history.matchArr = matchArr;
                    return false;
                }
            }
            var regexExcludeArr = myChecker.regexExcludeArr;
            if (null != regexExcludeArr && 0 < regexExcludeArr.length) {
                for (var i = 0; i < regexExcludeArr.length; ++i) {
                    var _regexExclude = regexExcludeArr[i];
                    if (null == _regexExclude) {
                        continue;
                    } // end if
                    var matchArr = inputStr.match(_regexExclude);
                    if (null != matchArr && 0 < matchArr.length) {
                        this.history.reason =
                            "target string is not allowed with regexExclude : " + regexExclude;
                        this.history.success = false;
                        this.history.matchArr = matchArr;
                        this.history.msg = myChecker.msg = "허용되지 않는 문자가 포함되어 있습니다. : " + matchArr.join(",");
                        this.history.key = "regexExclude";
                        this.history.value = _regexExclude;
                        this.history.matchArr = matchArr;
                        return false;
                    } // end if
                } // end for
            } // end for
            var regexInclude = myChecker.regexInclude;
            if (null != regexInclude) {
                // 1. 정규표현식에 포함되지 말아야할 문자가 이는지 검사.
                var matchArr = inputStr.match(regexInclude);
                if (null == matchArr || 0 == matchArr.length) {
                    this.history.reason =
                        "target string is not allowed with regexInclude : " + regexInclude;
                    this.history.success = false;
                    this.history.msg = myChecker.msg = "허용되는 문자 범위 밖입니다.";
                    this.history.key = "regexInclude";
                    this.history.value = regexInclude;
                    this.history.matchArr = matchArr;
                    return false;
                }
            }
            var regexIncludeArr = myChecker.regexIncludeArr;
            if (null != regexIncludeArr && 0 < regexIncludeArr.length) {
                for (var i = 0; i < regexIncludeArr.length; ++i) {
                    var _regexInclude = regexIncludeArr[i];
                    if (null == _regexInclude) {
                        continue;
                    }
                    var matchArr = inputStr.match(_regexInclude);
                    if (null == matchArr || 0 == matchArr.length) {
                        this.history.reason =
                            "target string is not allowed with _regexInclude : " + _regexInclude;
                        this.history.success = false;
                        this.history.msg = myChecker.msg = "허용되는 문자 범위 밖입니다.";
                        this.history.key = "regexInclude";
                        this.history.value = _regexInclude;
                        this.history.matchArr = matchArr;
                        return false;
                    } // end if
                } // end for
            } // end for
            // 문자열의 최소, 최대 길이는 가장 마지막에 검사합니다.
            // 음수는 검사 영역에 포함되지 않습니다.
            var max = -1;
            if (null != myChecker.max) {
                max = myChecker.max;
            }
            if (0 < max && max < inputStr.length) {
                this.history.reason =
                    "0 < max && max < inputStr.length / max : " + max + " / inputStr.length : " + inputStr.length;
                this.history.success = false;
                this.history.msg = myChecker.msg = "\uCD5C\uB300 " + max + "\uC790\uAE4C\uC9C0 \uC785\uB825\uD560 \uC218 \uC788\uC5B4\uC694.";
                this.history.key = "max";
                this.history.value = max;
                return false;
            }
            var min = -1;
            if (null != myChecker.min) {
                min = myChecker.min;
            }
            if (0 <= min && inputStr.length < min) {
                this.history.reason =
                    "0 <= min && inputStr.length < min / min : " + min + " / inputStr.length : " + inputStr.length;
                this.history.success = false;
                this.history.msg = myChecker.msg = "\uCD5C\uC18C " + min + "\uC790 \uC774\uC0C1 \uC785\uB825\uD574\uC8FC\uC154\uC57C \uD574\uC694.";
                this.history.key = "min";
                this.history.value = min;
                return false;
            }
        }
        else if (this.TYPE_NUMBER === myChecker.type) {
            if ('number' != typeof input) {
                this.history.reason = "'number' != typeof input";
                this.history.success = false;
                return false;
            }
        }
        else if (this.TYPE_ARRAY === myChecker.type) {
        }
        return true;
    };
    MyCheckerService.prototype.getTitleChecker = function () {
        // public myChecker:MyChecker
        return new my_checker_1.MyChecker(
        // public type:string
        this.TYPE_STRING, this.MIN_STR_SAFE_TITLE, this.MAX_STR_SAFE_TITLE, this.REGEX_SAFE_STR);
    }; // end method
    MyCheckerService.prototype.getCommentChecker = function () {
        // public myChecker:MyChecker
        return new my_checker_1.MyChecker(
        // public type:string
        this.TYPE_STRING, this.MIN_STR_SAFE_COMMENT, this.MAX_STR_SAFE_COMMENT, this.REGEX_SAFE_STR);
    }; // end method
    MyCheckerService.prototype.sanitizeDirtyWord = function (target) {
        if (null == this.dirtyWordList || 0 == this.dirtyWordList.length) {
            return target;
        }
        for (var i = 0; i < this.dirtyWordList.length; ++i) {
            var dirtyWord = this.dirtyWordList[i];
            // 대소문자 구분 없이 검색, 금칙어 삭제.
            var regExp = new RegExp(dirtyWord, 'gi');
            var matchArr = target.match(regExp);
            if (null != matchArr && 0 < matchArr.length) {
                for (var j = 0; j < matchArr.length; ++j) {
                    var matched = matchArr[j];
                    if (null == matched || "" == matched) {
                        continue;
                    }
                    target = target.replace(matched, "");
                } // end inner for
            } // end if
        } // end outer for
        return target;
    };
    MyCheckerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [url_service_1.UrlService, http_1.Http])
    ], MyCheckerService);
    return MyCheckerService;
}());
exports.MyCheckerService = MyCheckerService;
//# sourceMappingURL=my-checker.service.js.map