import { Injectable }             from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptions }         from '@angular/http';
import { Observable }             from 'rxjs';

import { MyChecker }              from '../model/my-checker';

import { UrlService }             from "../../util/url.service";

import { MyExtractor }            from '../../util/http/my-extractor';
import { MyResponse }             from '../../util/model/my-response';


@Injectable()
export class MyCheckerService {

    private apiGetChecker:string = '/CI/index.php/api/admin/checker';
    private checkerMap;
    private constMap;
    private dirtyWordList;
    private apiKey:string;

    public TYPE_STRING:string="TYPE_STRING";
    public TYPE_NUMBER:string="TYPE_NUMBER";
    public TYPE_ARRAY:string="TYPE_ARRAY";

    public REGEX_SAFE_STR:RegExp=/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20\s\(\)\.\:\;?\!\=\'\"`\^\(\)\&\~]/g;

    public MIN_STR_SAFE_TITLE:number = 2;
    public MAX_STR_SAFE_TITLE:number = 48;

    public MIN_STR_SAFE_COMMENT:number = 2;
    public MAX_STR_SAFE_COMMENT:number = 120;

    private history:any;

    private myExtractor:MyExtractor;

    constructor(    private us:UrlService, 
                    private http: Http) {

        this.myExtractor = new MyExtractor();
    }

    // @ Desc : 외부에서 my-checker를 강제로 세팅할 경우에 사용.
    setReady(checkerMap:any, constMap:any, dirtyWordList:any, apiKey:string) :void {

        if(null == checkerMap) {
            return;
        }
        if(null == constMap) {
            return;
        }
        if(null == dirtyWordList) {
            return;
        }
        if(null == apiKey || "" == apiKey) {
            return;
        }
        this.checkerMap = checkerMap;
        this.constMap = constMap;
        this.dirtyWordList = dirtyWordList;
        this.apiKey = apiKey;
    }

    public getCheckerMap() :any {
        return this.checkerMap;
    }
    public getConstMap() :any {
        return this.constMap;
    }
    public getDirtyWordList() :any {
        return this.dirtyWordList;
    }
    public getAPIKey() :string {
        return this.apiKey;
    }

    getLastHistory() :any {
        return this.history;
    }

    // @ Desc : 서버에서 받아온 checker json 파일에 있는 filterKey를 넘겨 받으면 이를 기반으로 MyChecker 객체를 만들어 돌려줍니다.
    getMyChecker (filterKey:string) :MyChecker {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("my-checker.service / getMyChecker / 시작");

        if(null == this.checkerMap) {
            console.log("!Error! / my-checker.service / null == this.checkerMap");
            return null;
        }
        if(null == filterKey || "" == filterKey) {
            console.log("!Error! / my-checker.service / filterKey is not valid!");
            return null;
        }
        if(null == this.checkerMap[filterKey]) {
            console.log("!Error! / my-checker.service / null == this.checkerMap[filterKey]");
            return null;
        }

        let filters:string = this.checkerMap[filterKey];
        if(null == filters || "" == filters) {
            console.log("!Error! / my-checker.service / filters is not valid!");
            return null;
        }

        // 내부 필터링 조건을 배열로 분해.
        let filterArr:string[] = filters.split("|||");
        if(null == filterArr || 0 == filterArr.length) {
            console.log("!Error! / my-checker.service / filterArr is not valid!");
            return null;
        }

        let myChecker:MyChecker = this.getMyCheckerByFilters(filterArr);

        return myChecker;
    }

    // @ Desc : 사용자가 지정한 필터들로 MyChecker 객체를 만들어 돌려줍니다.
    private getMyCheckerByFilters(filterArr:string[]) :MyChecker {

        if(null == filterArr || 0 == filterArr.length) {
            return null;
        }

        // let isDebug:boolean = true;
        let isDebug:boolean = false;

        let type:string = ""; // @ Required

        // Type : String
        let minLength:number = -1;
        let maxLength:number = -1;
        let uniqueTable:string = "";
        let uniqueColumn:string = "";
        let matches:string[] = [];

        // Type : Number
        let greaterThan:number = -1;
        let greaterThanEqualTo:number = -1;
        let lessThan:number = -1;
        let lessThanEqualTo:number = -1;

        let regexInclude:RegExp = null;
        let regexIncludeArr:RegExp[] = [];
        let regexExclude:RegExp = null;
        let regexExcludeArr:RegExp[] = [];

        let dbQueryUnique:string = "";

        for (var i = 0; i < filterArr.length; ++i) {
            let filter:string = filterArr[i];

            // 필터 - 문자열 타입?
            let isTypeStr:boolean = this.isTypeStr(filter);
            if(isTypeStr) {
                type = this.TYPE_STRING;
                continue;
            }

            // 필터 - 숫자 타입?
            let isTypeNumber:boolean = this.isTypeNumber(filter);
            if(isTypeNumber) {
                type = this.TYPE_NUMBER;
                continue;
            }

            // 필터 - 문자열 고정 문자수
            let exactLengthReceived:number = this.getExactLength(filter);
            if(-1 < exactLengthReceived) {
                minLength = exactLengthReceived;
                maxLength = exactLengthReceived;
                type = this.TYPE_STRING;
                continue;
            } // end if

            // 필터 - 문자열 최소 문자수
            let minLengthReceived:number = this.getMinLength(filter);
            if(-1 < minLengthReceived) {
                minLength = minLengthReceived;
                type = this.TYPE_STRING;
                continue;
            } // end if

            // 필터 - 문자열 최대 문자수
            let maxLengthReceived:number = this.getMaxLength(filter);
            if(-1 < maxLengthReceived) {
                maxLength = maxLengthReceived;
                type = this.TYPE_STRING;
                continue;
            } // end if

            // 필터 - 정상 이메일 검증
            let regExpValidEmailReceived:RegExp = this.getValidEmails(filter);
            if(null != regExpValidEmailReceived) {
                type = this.TYPE_STRING;
                regexInclude = regExpValidEmailReceived;
                continue;
            } // end if

            // 필터 - 자연수만 허용
            let isNaturalNoZero = this.getNaturalNoZero(filter);
            if(isNaturalNoZero) {
                type = this.TYPE_NUMBER;
                greaterThanEqualTo = 1;
                continue;
            }

            // 핕터 - unique. DB에서 해당 값이 유일해야 함. DB 조회 및 검증은 사용하는 뷰에서 진행.
            let tableNColumnObj = this.getIsUnique(filter);
            if(tableNColumnObj.table != "" && tableNColumnObj.column != "") {
                type = this.TYPE_STRING;
                uniqueTable = tableNColumnObj.table;
                uniqueColumn = tableNColumnObj.column;
                continue;
            }

            // 필터 - matches. const map에서 지정된 key 배열에 포함된 인자라면 ok.
            let matchesReceived:string[] = this.getMatcheFromConstMap(filter);
            if(null != matchesReceived && 0 < matchesReceived.length) {
                type = this.TYPE_STRING;
                matches = matchesReceived;
                continue;
            }

            // 필터 - greaterThan
            let greaterThanReceived:number = this.getGreaterThan(filter); 
            if(null != greaterThanReceived && 0 < greaterThanReceived) {
                type = this.TYPE_NUMBER;
                greaterThan = greaterThanReceived;
                continue;
            }

            // 필터 - greaterThanEqualTo
            let greaterThanEqualToReceived:number = this.getGreaterThanEqualTo(filter); 
            if(null != greaterThanEqualToReceived && 0 < greaterThanEqualToReceived) {
                type = this.TYPE_NUMBER;
                greaterThanEqualTo = greaterThanEqualToReceived;
                continue;
            }

            // 필터 - lessThan
            let lessThanReceived:number = this.getLessThan(filter); 
            if(null != lessThanReceived && 0 < lessThanReceived) {
                type = this.TYPE_NUMBER;
                lessThan = lessThanReceived;
                continue;
            }

            // 필터 - lessThanEqualTo
            let lessThanEqualToReceived:number = this.getLessThanEqualTo(filter); 
            if(null != lessThanEqualToReceived && 0 < lessThanEqualToReceived) {
                type = this.TYPE_NUMBER;
                lessThanEqualTo = lessThanEqualToReceived;
                continue;
            }

            // 필터 - 정규표현식 일반 - 제외할 문자만 찾음
            let regExpExcludeRecevied:RegExp = this.getRegExExcludeMatch(filter);
            if(null != regExpExcludeRecevied) {
                regexExclude = regExpExcludeRecevied;
                regexExcludeArr.push(regexExclude);
                continue;
            } // end if

            // 필터 - 정규표현식 일반 - 허용할 문자만 찾음
            let regExpIncludeRecevied:RegExp = this.getRegExIncludeMatch(filter);
            if(null != regExpIncludeRecevied) {
                regexInclude = regExpIncludeRecevied;
                regexIncludeArr.push(regexInclude);
                continue;
            } // end if

            // 필터 - DB Query Unique
            let dbQueryUniqueReceived:string = this.getRegExpDBQueryUnique(filter);
            if(null != dbQueryUniqueReceived) {
                type = this.TYPE_STRING;
                dbQueryUnique = dbQueryUniqueReceived;
                continue;
            } // end if

        }

        // DEBUG
        if(isDebug) {
            console.log("my-checker / getMyCheckerByFilters / type : ",type);

            console.log("my-checker / getMyCheckerByFilters / minLength : ",minLength);
            console.log("my-checker / getMyCheckerByFilters / maxLength : ",maxLength);
            console.log("my-checker / getMyCheckerByFilters / uniqueTable : ",uniqueTable);
            console.log("my-checker / getMyCheckerByFilters / uniqueColumn : ",uniqueColumn);
            console.log("my-checker / getMyCheckerByFilters / matches : ",matches);

            console.log("my-checker / getMyCheckerByFilters / greaterThan : ",greaterThan);
            console.log("my-checker / getMyCheckerByFilters / greaterThanEqualTo : ",greaterThanEqualTo);
            console.log("my-checker / getMyCheckerByFilters / lessThan : ",lessThan);
            console.log("my-checker / getMyCheckerByFilters / lessThanEqualTo : ",lessThanEqualTo);

            console.log("my-checker / getMyCheckerByFilters / regexExclude : ",regexExclude);
            console.log("my-checker / getMyCheckerByFilters / regexInclude : ",regexInclude);

            console.log("my-checker / getMyCheckerByFilters / dbQueryUnique : ",dbQueryUnique);
        }

        // 핕터를 모두 확인했습니다. 
        // MyChecker 객체를 만듭니다.
        if(null == type || "" == type) {
            return null;
        }

        let myChecker:MyChecker = null;
        if(this.TYPE_STRING === type) {

            myChecker = 
            new MyChecker(
                // public type:string,
                type,
                // public min:number,
                minLength,
                // public max:number,
                maxLength,
                // public regexExclude:RegExp
                regexExclude
            );

            if( null != uniqueTable && 
                "" != uniqueTable &&
                null != uniqueColumn && 
                "" != uniqueColumn ) {

                myChecker.uniqueTable = uniqueTable;
                myChecker.uniqueColumn = uniqueColumn;
            }

            if( null != regexExclude ) {
                myChecker.regexExclude = regexExclude;
            }
            if( null != regexInclude ) {
                myChecker.regexInclude = regexInclude;
            }
            if( null != regexExcludeArr ) {
                myChecker.regexExcludeArr = regexExcludeArr;
            }
            if( null != regexIncludeArr ) {
                myChecker.regexIncludeArr = regexIncludeArr;
            }

            if( null != matches && 0 < matches.length ) {
                myChecker.matches = matches;
            }

            if( null != dbQueryUnique && "" != dbQueryUnique ) {
                myChecker.dbQueryUnique = dbQueryUnique;   
            }

        } else if(this.TYPE_NUMBER === type) {

            myChecker = 
            new MyChecker(
                // public type:string,
                type,
                // public min:number,
                -1,
                // public max:number,
                -1,
                // public regexExclude:RegExp
                regexExclude
            ); 

            if(-1 < greaterThan) {
                myChecker.greaterThan = greaterThan;
            }
            if(-1 < greaterThanEqualTo) {
                myChecker.greaterThanEqualTo = greaterThanEqualTo;
            }
            if(-1 < lessThan) {
                myChecker.lessThan = lessThan;
            }
            if(-1 < lessThanEqualTo) {
                myChecker.lessThanEqualTo = lessThanEqualTo;
            }
        }

        return myChecker;
    }

    private regExpIsStr:RegExp=/is_str/i;
    private isTypeStr(filter:string) : boolean {

        if(null == filter || 0 == filter.length) {
            return false;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpIsStr);
        if(null != matchArr) {
            return true;
        }

        return false;
    }

    private regExpIsNumber:RegExp=/is_number/i;
    private isTypeNumber(filter:string) : boolean {

        if(null == filter || 0 == filter.length) {
            return false;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpIsNumber);
        if(null != matchArr) {
            return true;
        }

        return false;
    }

    private regExpExactLength:RegExp=/exact_length\[([\d]+)\]/i;
    private getExactLength(filter:string) : number {

        if(null == filter || 0 == filter.length) {
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

        let matchArr:RegExpMatchArray = filter.match(this.regExpExactLength);
        if(null != matchArr && 2 == matchArr.length) {
            return parseInt(matchArr[1]);
        }

        return -1;
    }    

    private regExpMinLength:RegExp=/min_length\[([\d]+)\]/i;
    private getMinLength(filter:string) : number {

        if(null == filter || 0 == filter.length) {
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

        let matchArr:RegExpMatchArray = filter.match(this.regExpMinLength);
        if(null != matchArr && 2 == matchArr.length) {
            return parseInt(matchArr[1]);
        }

        return -1;
    }

    private regExpMaxLength:RegExp=/max_length\[([\d]+)\]/i;
    private getMaxLength(filter:string) : number {

        // ex) "max_length[32]"

        if(null == filter || 0 == filter.length) {
            return -1;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpMaxLength);
        if(null != matchArr && 2 == matchArr.length) {
            return parseInt(matchArr[1]);
        }
        
        return -1;
    } 

    private regExpRegExExcludeMatch:RegExp=/regex_match_exclude\[(.+)\]/i;
    private getRegExExcludeMatch(filter:string) : RegExp {

        // ex) regex_match[/^[a-zA-Z가-힣0-9]+$/]

        if(null == filter || 0 == filter.length) {
            return null;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpRegExExcludeMatch);
        if(null != matchArr && 2 == matchArr.length) {

            var patternStr = matchArr[1];

            // Escape backslash for RegExp
            // "^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$" --> "^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$"
            patternStr = patternStr.replace("\\", "\\\\");

            // Remove first & last slashes
            patternStr = patternStr.replace(/(^\/|\/$)/gi,"");

            var re = new RegExp(patternStr, 'g');

            return re;
        }
        
        return null;
    }

    private regExpRegExIncludeMatch:RegExp=/regex_match_include\[(.+)\]/i;
    private getRegExIncludeMatch(filter:string) : RegExp {

        // ex) regex_match[/^[a-zA-Z가-힣0-9]+$/]

        if(null == filter || 0 == filter.length) {
            return null;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpRegExIncludeMatch);
        if(null != matchArr && 2 == matchArr.length) {

            var patternStr = matchArr[1];

            // Escape backslash for RegExp
            // "^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$" --> "^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$"
            patternStr = patternStr.replace("\\", "\\\\");

            // Remove first & last slashes
            patternStr = patternStr.replace(/(^\/|\/$)/gi,"");

            var re = new RegExp(patternStr, 'g');

            return re;
        }
        
        return null;
    }    

    // @ Referer : http://jsfiddle.net/ghvj4gy9/embedded/result,js/
    private regValidEmail:RegExp = /valid_emails/i;
    private EMAIL_REGEX:RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    private getValidEmails(filter:string) :RegExp {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;

        if(isDebug) {
            console.log("my-checker / getValidEmails / filter : ",filter);
        }

        // ex) "user_email":"valid_emails"
        if(null == filter || 0 == filter.length) {
            return null;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regValidEmail);

        if(isDebug) {
            console.log("my-checker / getValidEmails / matchArr : ",matchArr);
        }

        if(null != matchArr && 1 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return this.EMAIL_REGEX;
        }
        
        return null;
    }

    // is_natural_no_zero
    private regIsNaturalNoZero:RegExp = /is_natural_no_zero/i;
    private getNaturalNoZero(filter:string) :boolean {

        // ex) "user_email":"valid_emails"

        if(null == filter || 0 == filter.length) {
            return false;
        }

         if(null == filter || 0 == filter.length) {
            return false;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regIsNaturalNoZero);
        if(null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return true;
        }
        
        return false;
    } 

    // is_unique
    private regExpIsUnique:RegExp = /is_unique\[(.+)\]/i;
    private getIsUnique(filter:string) :any {

        // ex) "user_email":"is_unique[user.nickname]"
        // let isDebug:boolean = true;
        let isDebug:boolean = false;

        if(isDebug) {
            console.log("my-checker / getIsUnique / filter : ",filter);
        }

        let tableNColumnObj = {
            table:"",
            column:""
        };        

        if(null == filter || 0 == filter.length) {
            return tableNColumnObj;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpIsUnique);
        let tableNColumn:string = "";
        if(null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            tableNColumn = matchArr[1];
        }
        let tableNColumnArr:string[];
        if(null != tableNColumn && 0 < tableNColumn.length) {
            tableNColumnArr = tableNColumn.split(".");
        }
        if(null != tableNColumnArr && 2 == tableNColumnArr.length) {
            tableNColumnObj["table"] = tableNColumnArr[0];
            tableNColumnObj["column"] = tableNColumnArr[1];
        }

        if(isDebug) {
            console.log("my-checker / getIsUnique / tableNColumnObj : ",tableNColumnObj);
        }
        
        return tableNColumnObj;
    }

    // matches
    private regExpMatches:RegExp = /matches\[(.+)\]/i;
    private getMatcheFromConstMap(filter:string) :string[] {

        // ex) "user_email":"is_unique[user.nickname]"
        let matches:string[]=[];
        if(null == filter || 0 == filter.length) {
            return matches;
        }
        if(null != this.constMap) {
            return matches;   
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpMatches);
        let keyMatches:string = "";
        if(null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            keyMatches = matchArr[1];
        }

        if( null != keyMatches && 
            0 < keyMatches.length && 
            null != this.constMap[keyMatches]) {

            matches = this.constMap[keyMatches];
        }
        
        return matches;
    }

    // greaterThan
    private regExpGreaterThan:RegExp = /greater_than\[(.+)\]/i;
    private getGreaterThan(filter:string) :number {

        // ex) "user_email":"is_unique[user.nickname]"
        if(null == filter || 0 == filter.length) {
            return -1;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpGreaterThan);
        let keyMatches:string = "";
        if(null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return parseInt(matchArr[1]);
        }
        
        return -1;
    }    
    // greaterThanEqualTo
    private regExpGreaterThanEqualTo:RegExp = /greater_than_equal_to\[(.+)\]/i;
    private getGreaterThanEqualTo(filter:string) :number {

        // ex) "user_email":"is_unique[user.nickname]"
        if(null == filter || 0 == filter.length) {
            return -1;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpGreaterThanEqualTo);
        let keyMatches:string = "";
        if(null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return parseInt(matchArr[1]);
        }
        
        return -1;
    }     

    // lessThan
    private regExpLessThan:RegExp = /less_than\[(.+)\]/i;
    private getLessThan(filter:string) :number {

        // ex) "user_email":"is_unique[user.nickname]"
        if(null == filter || 0 == filter.length) {
            return -1;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpLessThan);
        let keyMatches:string = "";
        if(null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return parseInt(matchArr[1]);
        }
        
        return -1;
    }     
    // lessThanEqualTo
    private regExpLessThanEqualTo:RegExp = /less_than_equal_to\[(.+)\]/i;
    private getLessThanEqualTo(filter:string) :number {

        // ex) "user_email":"is_unique[user.nickname]"
        if(null == filter || 0 == filter.length) {
            return -1;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpLessThanEqualTo);
        let keyMatches:string = "";
        if(null != matchArr && 2 == matchArr.length) {
            // email 검증을 할 수 있는 정규표현식을 돌려줍니다.
            return parseInt(matchArr[1]);
        }
        
        return -1;
    }
    private regExpDBQueryUnique:RegExp=/is_unique\[(.+)\]/i;
    private getRegExpDBQueryUnique(filter:string) : string {

        // ex) is_unique[user.nickname]

        if(null == filter || 0 == filter.length) {
            return null;
        }

        let matchArr:RegExpMatchArray = filter.match(this.regExpRegExIncludeMatch);

        return "";
    }    


    getChecker (): Promise<any> {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("my-checker.service / getChecker / 시작");

        let req_url = this.us.get(this.apiGetChecker);
        if(isDebug) console.log("my-checker.service / getChecker / req_url : ",req_url);

        return this.http.get(req_url)
                    .toPromise()
                    .then(this.myExtractor.extractData)
                    .catch(this.myExtractor.handleError);
    } 

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



    isOK(myChecker:MyChecker, input:any) :boolean {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;

        this.history = {
            myChecker:myChecker,
            input:input,
            reason:"",
            success:true,
            msg:""
        };

        if(undefined === myChecker || null === myChecker) {
            this.history.reason = "null === myChecker";
            this.history.success = false;

            if(isDebug) {
                console.log("my-checker / isOK / myChecker is not valid!");
            }

            return false;
        }
        if(undefined === input || null === input) {
            this.history.reason = "null === input";
            this.history.success = false;

            if(isDebug) {
                console.log("my-checker / isOK / input is not valid!");
            }

            return false;
        }

        if(this.TYPE_STRING === myChecker.type) {

            if ('string' != typeof input) {

                this.history.reason = "'string' != typeof input";
                this.history.success = false;

                if(isDebug) {
                    console.log("my-checker / isOK / 'string' != typeof input");
                }

                return false;
            }

            if(isDebug) {
                console.log("my-checker / isOK / myChecker : ",myChecker);
            }

            let inputStr:string = input;

            // 음수는 검사 영역에 포함되지 않습니다.
            let max = -1;
            if(null != myChecker.max) {
                max = myChecker.max;
            }
            if(0 < max && max < inputStr.length) {

                this.history.reason = 
                "0 < max && max < inputStr.length / max : " + max + " / inputStr.length : " + inputStr.length;
                this.history.success = false;
                this.history.msg = myChecker.msg = `최대 ${max}자까지 입력할 수 있어요.`;
                this.history.key = "max";
                this.history.value = max;

                return false;
            }

            let min = -1;
            if(null != myChecker.min) {
                min = myChecker.min;
            }
            if(0 <= min && inputStr.length < min) {

                this.history.reason = 
                "0 <= min && inputStr.length < min / min : " + min + " / inputStr.length : " + inputStr.length;
                this.history.success = false;
                this.history.msg = myChecker.msg = `최소 ${min}자 이상 입력해주셔야 해요.`;
                this.history.key = "min";
                this.history.value = min;

                return false;
            }

            let regexExclude:RegExp = myChecker.regexExclude;
            if(null != regexExclude) {
                // 1. 정규표현식에 포함되지 말아야할 문자가 이는지 검사.
                let matchArr = inputStr.match(regexExclude);
                if(null != matchArr && 0 < matchArr.length) {
                    this.history.reason = 
                    `target string is not allowed with regexExclude : ${regexExclude}`;
                    this.history.success = false;
                    this.history.matchArr = matchArr;
                    this.history.msg = myChecker.msg = "허용되지 않는 문자가 포함되어 있습니다. : " + matchArr.join(",");
                    this.history.key = "regexExclude";
                    this.history.value = regexExclude;
                    this.history.matchArr = matchArr;

                    return false;
                }
            }

            let regexExcludeArr:RegExp[] = myChecker.regexExcludeArr;
            if(null != regexExcludeArr && 0 < regexExcludeArr.length) {
                for (var i = 0; i < regexExcludeArr.length; ++i) {
                    let _regexExclude:RegExp = regexExcludeArr[i];
                    if(null == _regexExclude) {
                        continue;
                    } // end if

                    let matchArr = inputStr.match(_regexExclude);
                    if(null != matchArr && 0 < matchArr.length) {
                        this.history.reason = 
                        `target string is not allowed with regexExclude : ${regexExclude}`;
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


            let regexInclude:RegExp = myChecker.regexInclude;
            if(null != regexInclude) {
                // 1. 정규표현식에 포함되지 말아야할 문자가 이는지 검사.
                let matchArr = inputStr.match(regexInclude);
                if(null == matchArr || 0 == matchArr.length) {
                    this.history.reason = 
                    `target string is not allowed with regexInclude : ${regexInclude}`;
                    this.history.success = false;
                    this.history.msg = myChecker.msg = "허용되는 문자 범위 밖입니다.";
                    this.history.key = "regexInclude";
                    this.history.value = regexInclude;
                    this.history.matchArr = matchArr;

                    return false;
                }
            }

            let regexIncludeArr:RegExp[] = myChecker.regexIncludeArr;
            if(null != regexIncludeArr && 0 < regexIncludeArr.length) {
                for (var i = 0; i < regexIncludeArr.length; ++i) {
                    let _regexInclude:RegExp = regexIncludeArr[i];
                    if(null == _regexInclude) {
                        continue;
                    }

                    let matchArr = inputStr.match(_regexInclude);
                    if(null == matchArr || 0 == matchArr.length) {
                        this.history.reason = 
                        `target string is not allowed with _regexInclude : ${_regexInclude}`;
                        this.history.success = false;
                        this.history.msg = myChecker.msg = "허용되는 문자 범위 밖입니다.";
                        this.history.key = "regexInclude";
                        this.history.value = _regexInclude;
                        this.history.matchArr = matchArr;

                        return false;
                    } // end if
                } // end for
            } // end for


        } else if(this.TYPE_NUMBER === myChecker.type) {

            if ('number' != typeof input) {

                this.history.reason = "'number' != typeof input";
                this.history.success = false;

                return false;
            }

        } else if(this.TYPE_ARRAY === myChecker.type) {

        }

        return true;
    }

    private test:MyChecker;
    getTitleChecker() :MyChecker {
        // public myChecker:MyChecker
        return new MyChecker(
          // public type:string
          this.TYPE_STRING
          // public min:number
          , this.MIN_STR_SAFE_TITLE
          // public max:number
          , this.MAX_STR_SAFE_TITLE
          // public regex:string
          , this.REGEX_SAFE_STR
        );
    } // end method
    getCommentChecker() :MyChecker {
        // public myChecker:MyChecker
        return new MyChecker(
          // public type:string
          this.TYPE_STRING
          // public min:number
          , this.MIN_STR_SAFE_COMMENT
          // public max:number
          , this.MAX_STR_SAFE_COMMENT
          // public regex:string
          , this.REGEX_SAFE_STR
        );
    } // end method

    sanitizeDirtyWord(target:string) :string {

        if(null == this.dirtyWordList || 0 == this.dirtyWordList.length) {
            return target;
        }

        for (var i = 0; i < this.dirtyWordList.length; ++i) {
            let dirtyWord:string = this.dirtyWordList[i];

            // 대소문자 구분 없이 검색, 금칙어 삭제.
            let regExp:RegExp = new RegExp(dirtyWord,'gi');

            let matchArr:RegExpMatchArray = target.match(regExp);
            if(null != matchArr && 0 <  matchArr.length) {
                for (var j = 0; j < matchArr.length; ++j) {
                    let matched:string = matchArr[j];
                    if(null == matched || "" == matched) {
                        continue;
                    }

                    target = target.replace(matched, "");
                } // end inner for
            } // end if
        } // end outer for

        return target;
    }

}
