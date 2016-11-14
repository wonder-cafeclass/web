import { Injectable }             from '@angular/core';
import { MyChecker }             from '../model/my-checker';

@Injectable()
export class MyCheckerService {

    public TYPE_STRING:string="TYPE_STRING";
    public TYPE_NUMBER:string="TYPE_NUMBER";
    public TYPE_ARRAY:string="TYPE_ARRAY";

    public REGEX_SAFE_STR:RegExp=/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20\s\(\)\.\:\;?\!\=\'\"`\^\(\)\&\~]/g;

    public MIN_STR_SAFE_TITLE:number = 2;
    public MAX_STR_SAFE_TITLE:number = 48;

    public MIN_STR_SAFE_COMMENT:number = 2;
    public MAX_STR_SAFE_COMMENT:number = 120;

    private history:any;
    getLastHistory() :any {

        return this.history;
    }

    isOK(myChecker:MyChecker, value:any) :boolean {

        this.history = {
            myChecker:myChecker,
            value:value,
            reason:"",
            success:true,
            msg:""
        };

        if(undefined === myChecker || null === myChecker) {
            this.history.reason = "null === myChecker";
            this.history.success = false;

            return false;
        }
        if(undefined === value || null === value) {
            this.history.reason = "null === value";
            this.history.success = false;

            return false;
        }

        if(this.TYPE_STRING === myChecker.type) {

            if ('string' != typeof value) {

                this.history.reason = "'string' != typeof value";
                this.history.success = false;

                return false;
            }

            let valueStr:string = value;

            // 음수는 검사 영역에 포함되지 않습니다.
            let max = -1;
            if(null != myChecker.max) {
                max = myChecker.max;
            }
            if(0 < max && max < valueStr.length) {

                this.history.reason = 
                "0 < max && max < valueStr.length / max : " + max + " / valueStr.length : " + valueStr.length;
                this.history.success = false;
                this.history.msg = myChecker.msg = `최대 ${max}자까지 입력할 수 있습니다.`;
                

                return false;
            }

            let min = -1;
            if(null != myChecker.min) {
                min = myChecker.min;
            }
            if(0 <= min && valueStr.length < min) {

                this.history.reason = 
                "0 <= min && valueStr.length < min / min : " + min + " / valueStr.length : " + valueStr.length;
                this.history.success = false;
                this.history.msg = myChecker.msg = `최소 ${min}자까지 입력할 수 있습니다.`;

                return false;
            }

            let matchArr = valueStr.match(this.REGEX_SAFE_STR);
            if(null != matchArr && 0 < matchArr.length) {
                this.history.reason = 
                `target string is not allowed with this.REGEX_SAFE_STR : ${this.REGEX_SAFE_STR}`;
                this.history.success = false;
                this.history.msg = myChecker.msg = "허용되지 않는 문자가 포함되어 있습니다. : " + matchArr.join(",");

                return false;
            }

        } else if(this.TYPE_NUMBER === myChecker.type) {

            if ('number' != typeof value) {

                this.history.reason = "'number' != typeof value";
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

}
