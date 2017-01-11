import { HelperMyIs }	from '../../../util/helper/my-is';


export class PaymentImport {

  	public id:number=-1;
  	public date_created:string="";

    public paymentImport_id:number=-1;
    public user_id:number=-1;
    public klass_id:number=-1;
    
  	// 아임포트 결제 고유 UID
  	public imp_uid:string="";
  	// 가맹점(카페클래스)에서 전달한 거래 고유 UID
  	public merchant_uid:string="";
  	// samsung : 삼성페이 / card : 신용카드 / trans : 계좌이체 / vbank : 가상계좌
  	public pay_method:string="";
    // 5 - INSERT

  	// PG사 명칭. inicis(이니시스) / nice(나이스정보통신)
  	public pg_provider:string="";
  	// PG사 승인정보
  	public pg_tid:string="";
  	// 에스크로결제 여부
  	public escrow=false;
  	// 카드사 승인정보(계좌이체/가상계좌는 값 없음)
  	public apply_num:string="";
  	// 카드사 명칭
  	public card_name:string="";
    // 10 - INSERT

  	// 할부개월 수(0이면 일시불)
  	public card_quota:number=0;
  	// 입금받을 가상계좌 은행명
  	public vbank_name:string="";
  	// 입금받을 가상계좌 계좌번호
  	public vbank_num:string="";
  	// 입금받을 가상계좌 예금주
  	public vbank_holder:string="";
  	// 입금받을 가상계좌 마감기한 UNIX timestamp - ex) 1484063719
  	public vbank_date:number=0;
    // 15 - INSERT

  	// 입금받을 가상계좌 마감기한 UNIX YYYY-MM-DD HH:mm:ss
  	public my_date_vbank_date:string="";
  	// 주문명칭
  	public name:string="";
  	// 주문(결제)금액
  	public amount:number=0;
  	// 결제취소금액
  	public cancel_amount:number=0;
  	// 결제승인화폐단위(KRW:원, USD:미화달러, EUR:유로)
  	public currency:string="";
    // 20 - INSERT

  	// 주문자명
  	public buyer_name:string="";
  	// 주문자 Email주소
  	public buyer_email:string="";
  	// 주문자 전화번호
  	public buyer_tel:string="";
  	// 주문자 주소
  	public buyer_addr:string="";
  	// 주문자 우편번호
  	public buyer_postcode:string="";
    // 25 - INSERT

  	// 결제상태. 
  	// ready:미결제, 
  	// paid:결제완료, 
  	// cancelled:결제취소, 
  	// failed:결제실패
  	public status:string="";
  	// 결제완료시점 UNIX timestamp. 결제완료가 아닐 경우 0
  	public paid_at:number=0;
  	// 결제완료시점 YYYY-MM-DD HH:mm:ss
  	public my_date_paid_at:string="";
  	// 결제실패시점 UNIX timestamp. 결제실패가 아닐 경우 0
  	public failed_at:number=0;
  	// 결제실패시점 YYYY-MM-DD HH:mm:ss
  	public my_date_failed_at:string="";
    // 30 - INSERT

  	// 결제취소시점 UNIX timestamp. 결제취소가 아닐 경우 0
  	public cancelled_at:number=0;
  	// 결제취소시점 YYYY-MM-DD HH:mm:ss
  	public my_date_cancelled_at:string="";
  	// 결제실패 사유
  	public fail_reason:string="";
  	// 결제취소 사유
  	public cancel_reason:string="";
  	// 신용카드 매출전표 확인 URL
  	public receipt_url:string="";
    // 35 - INSERT

    // 취소/부분취소 시 생성되는 취소 매출전표 확인 URL. 부분취소 횟수만큼 매출전표가 별도로 생성됨. 여기서는 마지막 등록된 결재 취소 영수증만 등록
    public cancel_receipt_url:string="";

    private myIs:HelperMyIs=null;	

	constructor(
	) {
		this.myIs = new HelperMyIs();
	}

    setJSON(json):PaymentImport {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("paymentImport / setJSON / init");

        if(isDebug) console.log("paymentImport / setJSON / json : ",json);

        let paymentImport:PaymentImport = this._setJSON(json);

        if(isDebug) console.log("paymentImport / setJSON / paymentImport : ",paymentImport);

        // json 자동 설정 이후의 추가 작업을 여기서 합니다.

        return paymentImport;

    } // end method

    private _setJSON(json):PaymentImport {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method	
}