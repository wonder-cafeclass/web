"use strict";
var my_is_1 = require('../../../util/helper/my-is');
var my_format_1 = require('../../../util/helper/my-format');
var user_1 = require('../../../users/model/user');
var klass_1 = require('../../../widget/klass/model/klass');
var teacher_1 = require('../../../teachers/model/teacher');
var PaymentImport = (function () {
    function PaymentImport() {
        this.id = -1;
        this.date_created = "";
        this.paymentImport_id = -1;
        this.user_id = -1;
        this.klass_id = -1;
        // 아임포트 결제 고유 UID
        this.imp_uid = "";
        // 가맹점(카페클래스)에서 전달한 거래 고유 UID
        this.merchant_uid = "";
        // samsung : 삼성페이 / card : 신용카드 / trans : 계좌이체 / vbank : 가상계좌
        this.pay_method = "";
        // 5 - INSERT
        // PG사 명칭. inicis(이니시스) / nice(나이스정보통신)
        this.pg_provider = "";
        // PG사 승인정보
        this.pg_tid = "";
        // 에스크로결제 여부
        this.escrow = false;
        // 카드사 승인정보(계좌이체/가상계좌는 값 없음)
        this.apply_num = "";
        // 카드사 명칭
        this.card_name = "";
        // 10 - INSERT
        // 할부개월 수(0이면 일시불)
        this.card_quota = 0;
        // 입금받을 가상계좌 은행명
        this.vbank_name = "";
        // 입금받을 가상계좌 계좌번호
        this.vbank_num = "";
        // 입금받을 가상계좌 예금주
        this.vbank_holder = "";
        // 입금받을 가상계좌 마감기한 UNIX timestamp - ex) 1484063719
        this.vbank_date = 0;
        // 15 - INSERT
        // 입금받을 가상계좌 마감기한 UNIX YYYY-MM-DD HH:mm:ss
        this.my_date_vbank_date = "";
        // 주문명칭
        this.name = "";
        // 주문(결제)금액
        this.amount = 0;
        // 주문(결제)금액 / ex) 65,000
        this.amountWithFormat = "";
        // 결제취소금액
        this.cancel_amount = 0;
        // 결제승인화폐단위(KRW:원, USD:미화달러, EUR:유로)
        this.currency = "";
        // 20 - INSERT
        // 주문자명
        this.buyer_name = "";
        // 주문자 Email주소
        this.buyer_email = "";
        // 주문자 전화번호
        this.buyer_tel = "";
        // 주문자 주소
        this.buyer_addr = "";
        // 주문자 우편번호
        this.buyer_postcode = "";
        // 25 - INSERT
        // 결제상태. 
        // ready:미결제, 
        // paid:결제완료, 
        // cancelled:결제취소, 
        // failed:결제실패
        this.status = "";
        // 결제완료시점 UNIX timestamp. 결제완료가 아닐 경우 0
        this.paid_at = 0;
        // 결제완료시점 YYYY-MM-DD HH:mm:ss
        this.my_date_paid_at = "";
        // 결제실패시점 UNIX timestamp. 결제실패가 아닐 경우 0
        this.failed_at = 0;
        // 결제실패시점 YYYY-MM-DD HH:mm:ss
        this.my_date_failed_at = "";
        // 30 - INSERT
        // 결제취소시점 UNIX timestamp. 결제취소가 아닐 경우 0
        this.cancelled_at = 0;
        // 결제취소시점 YYYY-MM-DD HH:mm:ss
        this.my_date_cancelled_at = "";
        // 결제실패 사유
        this.fail_reason = "";
        // 결제취소 사유
        this.cancel_reason = "";
        // 신용카드 매출전표 확인 URL
        this.receipt_url = "";
        // 35 - INSERT
        // 취소/부분취소 시 생성되는 취소 매출전표 확인 URL. 부분취소 횟수만큼 매출전표가 별도로 생성됨. 여기서는 마지막 등록된 결제 취소 영수증만 등록
        this.cancel_receipt_url = "";
        this.myIs = null;
        this.myFormat = null;
        this.user = null;
        this.klass = null;
        this.teacher = null;
        this.myIs = new my_is_1.HelperMyIs();
        this.myFormat = new my_format_1.HelperMyFormat();
    }
    PaymentImport.prototype.setJSON = function (json) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("paymentImport / setJSON / init");
        if (isDebug)
            console.log("paymentImport / setJSON / json : ", json);
        var paymentImport = this._setJSON(json);
        if (isDebug)
            console.log("paymentImport / setJSON / paymentImport : ", paymentImport);
        // json 자동 설정 이후의 추가 작업을 여기서 합니다.
        if (null != paymentImport.user) {
            var userJSON = paymentImport.user;
            paymentImport.user = new user_1.User().setJSON(userJSON);
        }
        if (null != paymentImport.klass) {
            var klassJSON = paymentImport.klass;
            paymentImport.klass = new klass_1.Klass().setJSON(klassJSON);
        }
        if (null != paymentImport.teacher) {
            var teacherJSON = paymentImport.teacher;
            paymentImport.teacher = new teacher_1.Teacher().setJSON(teacherJSON);
        }
        // 금액 포맷 추가.
        paymentImport.amountWithFormat = this.myFormat.getKRWWithCommas(paymentImport.amount);
        return paymentImport;
    }; // end method
    PaymentImport.prototype._setJSON = function (json) {
        return this.myIs.copyFromJSON(
        // target:any,
        this, 
        // json
        json);
    }; // end method	
    return PaymentImport;
}());
exports.PaymentImport = PaymentImport;
//# sourceMappingURL=payment-import.js.map