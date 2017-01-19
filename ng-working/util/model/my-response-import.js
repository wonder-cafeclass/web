"use strict";
var my_is_1 = require('../helper/my-is');
var my_time_1 = require('../helper/my-time');
var my_format_1 = require('../helper/my-format');
// @ Desc : 결제 모듈 아임포트의 응답객체 (결제 이후)
// @ Referer : https://github.com/iamport/iamport-manual/blob/master/%EC%9D%B8%EC%A6%9D%EA%B2%B0%EC%A0%9C/README.md
var MyResponseImport = (function () {
    function MyResponseImport() {
        // COMMON DATA
        // 결제처리가 성공적이었는지 여부
        // 실제 결제승인이 이뤄졌거나, 가상계좌 발급이 성공된 경우, true
        this.success = false;
        // 결제처리에 실패한 경우 단축메세지 / 현재 코드체계는 없음
        this.error_code = "";
        // 결제처리에 실패한 경우 상세메세지
        this.error_msg = "";
        // 아임포트 거래 고유 번호 / 아임포트에서 부여하는 거래건 당 고유한 번호
        this.imp_uid = "";
        // 가맹점에서 생성 / 관리하는 고유 주문번호
        this.merchant_uid = "";
        // 결제수단 / card(신용카드), trans(실시간계좌이체), vbank(가상계좌), phone(휴대폰소액결제)
        this.pay_method = "";
        // 결제금액 / 실제 결제승인된 금액이나 가상계좌 입금예정 금액
        this.paid_amount = -1;
        // 결제상태 / ready(미결제), paid(결제완료), cancelled(결제취소, 부분취소포함), failed(결제실패)
        this.status = "";
        // 주문명
        this.name = "";
        // 결제승인/시도된 PG사
        // html5_inicis(웹표준방식의 KG이니시스), 
        // inicis(일반 KG이니시스), 
        // kakao(카카오페이), 
        // uplus(LGU+), 
        // nice(나이스정보통신), 
        // jtnet(JTNet), 
        // danal(다날) 
        this.pg_provider = "";
        // PG사 거래고유번호
        this.pg_tid = "";
        // 주문자 이름
        this.buyer_name = "";
        // 주문자 Email
        this.buyer_email = "";
        // 주문자 연락처
        this.buyer_tel = "";
        // 주문자 주소
        this.buyer_addr = "";
        // 주문자 우편번호
        this.buyer_postcode = "";
        // 가맹점 임의 지정 데이터
        this.custom_data = null;
        // 결제승인시각 / UNIX timestamp
        this.paid_at = -1;
        // PG사에서 발행되는 거래 매출전표 URL / 전달되는 URL을 그대로 open하면 매출전표 확인가능
        this.receipt_url = "";
        // EXTRA DATA
        // 카드사 승인번호 / 신용카드결제에 한하여 제공
        this.apply_num = "";
        // 가상계좌 입금계좌번호 / PG사로부터 전달된 정보 그대로 제공하므로 숫자 외 dash(-)또는 기타 기호가 포함되어 있을 수 있음
        this.vbank_num = "";
        // 가상계좌 은행명
        this.vbank_name = "";
        // 가상계좌 예금주 / 계약된 사업자명으로 항상 일정함. 단, 일부 PG사의 경우 null반환하므로 자체 처리 필요
        this.vbank_holder = "";
        // 가상계좌 입금기한 / UNIX timestamp
        this.vbank_date = -1;
        this.myIs = null;
        this.myTime = null;
        this.myFormat = null;
        this.myIs = new my_is_1.HelperMyIs();
        this.myTime = new my_time_1.HelperMyTime();
        this.myFormat = new my_format_1.HelperMyFormat();
    }
    MyResponseImport.prototype.copy = function () {
        return this.myIs.copy(
        // src:any
        this, 
        // copy:any
        new MyResponseImport());
    }; // end method
    MyResponseImport.prototype.setJSON = function (json) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("myResponseImport / setJSON / init");
        if (isDebug)
            console.log("myResponseImport / setJSON / json : ", json);
        var response = this._setJSON(json);
        if (isDebug)
            console.log("myResponseImport / setJSON / response : ", response);
        return response;
    }; // end method
    MyResponseImport.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method
    return MyResponseImport;
}());
exports.MyResponseImport = MyResponseImport; // end class
//# sourceMappingURL=my-response-import.js.map