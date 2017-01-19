<?php

class PaymentImport {

  	public $id=-1;
  	public $date_created="";

    public $klass_id=-1;
    public $user_id=-1;
  	// 아임포트 결제 고유 UID
  	public $imp_uid="";
  	// 가맹점(카페클래스)에서 전달한 거래 고유 UID
  	public $merchant_uid="";
  	// samsung : 삼성페이 / card : 신용카드 / trans : 계좌이체 / vbank : 가상계좌
  	public $pay_method="";
    // 5 - INSERT

  	// PG사 명칭. inicis(이니시스) / nice(나이스정보통신)
  	public $pg_provider="";
  	// PG사 승인정보
  	public $pg_tid="";
  	// 에스크로결제 여부
  	public $escrow=false;
  	// 카드사 승인정보(계좌이체/가상계좌는 값 없음)
  	public $apply_num="";
  	// 카드사 명칭
  	public $card_name="";
    // 10 - INSERT

  	// 할부개월 수(0이면 일시불)
  	public $card_quota=0;
  	// 입금받을 가상계좌 은행명
  	public $vbank_name="";
  	// 입금받을 가상계좌 계좌번호
  	public $vbank_num="";
  	// 입금받을 가상계좌 예금주
  	public $vbank_holder="";
  	// 입금받을 가상계좌 마감기한 UNIX timestamp - ex) 1484063719
  	public $vbank_date=0;
    // 15 - INSERT

  	// 입금받을 가상계좌 마감기한 UNIX YYYY-MM-DD HH:mm:ss
  	public $my_date_vbank_date="";
  	// 주문명칭
  	public $name="";
  	// 주문(결제)금액
  	public $amount=0;
  	// 결제취소금액
  	public $cancel_amount=0;
  	// 결제승인화폐단위(KRW:원, USD:미화달러, EUR:유로)
  	public $currency="";
    // 20 - INSERT

  	// 주문자명
  	public $buyer_name="";
  	// 주문자 Email주소
  	public $buyer_email="";
  	// 주문자 전화번호
  	public $buyer_tel="";
  	// 주문자 주소
  	public $buyer_addr="";
  	// 주문자 우편번호
  	public $buyer_postcode="";
    // 25 - INSERT

  	// 결제상태. 
  	// ready:미결제, 
  	// paid:결제완료, 
  	// cancelled:결제취소, 
  	// failed:결제실패
  	public $status="";
  	// 결제완료시점 UNIX timestamp. 결제완료가 아닐 경우 0
  	public $paid_at=0;
  	// 결제완료시점 YYYY-MM-DD HH:mm:ss
  	public $my_date_paid_at="";
  	// 결제실패시점 UNIX timestamp. 결제실패가 아닐 경우 0
  	public $failed_at=0;
  	// 결제실패시점 YYYY-MM-DD HH:mm:ss
  	public $my_date_failed_at="";
    // 30 - INSERT

  	// 결제취소시점 UNIX timestamp. 결제취소가 아닐 경우 0
  	public $cancelled_at=0;
  	// 결제취소시점 YYYY-MM-DD HH:mm:ss
  	public $my_date_cancelled_at="";
  	// 결제실패 사유
  	public $fail_reason="";
  	// 결제취소 사유
  	public $cancel_reason="";
  	// 신용카드 매출전표 확인 URL
  	public $receipt_url="";
    // 35 - INSERT

    // 취소/부분취소 시 생성되는 취소 매출전표 확인 URL. 부분취소 횟수만큼 매출전표가 별도로 생성됨. 여기서는 마지막 등록된 결재 취소 영수증만 등록
    public $cancel_receipt_url="";
    // 36 - INSERT

  	// 취소/부분취소 시 생성되는 취소 매출전표 확인 URL 배열. 부분취소 횟수만큼 매출전표가 별도로 생성됨. 여기서는 마지막 등록된 결재 취소 영수증만 등록
  	public $cancel_receipt_urls=[];

    // User 객체
    public $user;

    // Klass 객체
    public $klass;

    // Teacher 객체
    public $teacher;

  	public function setJSON($json=null) 
  	{
  		if(is_null($json))
  		{
  			return;
  		} // end if

      foreach ($json as $key => $value) 
      {
        if(is_null($value))
        {
          // 공백 문자열 처리해야할 항목 모음.

          if( "pay_method" === $key || 
              "pg_provider" === $key || 
              "pg_tid" === $key || 
              "apply_num" === $key || 
              "card_name" === $key || 
              "vbank_name" === $key || 
              "vbank_num" === $key || 
              "vbank_holder" === $key || 
              "currency" === $key || 
              "buyer_tel" === $key || 
              "buyer_addr" === $key || 
              "buyer_postcode" === $key || 
              "buyer_postcode" === $key || 
              "fail_reason" === $key || 
              "cancel_reason" === $key || 
              "receipt_url" === $key  )
          {
            $this->{$key} = "";
          } // end if
        }
        else
        {

          // 숫자값에 대한 처리
          if( "id" === $key || 
              "pi_id" === $key || 
              "klass_id" === $key || 
              "user_id" === $key || 
              "card_quota" === $key || 
              "vbank_date" === $key || 
              "amount" === $key || 
              "cancel_amount" === $key || 
              "paid_at" === $key || 
              "failed_at" === $key || 
              "cancelled_at" === $key )
          {
            $this->{$key} = intval($value);
          } 
          else if( "escrow" === $key)
          {
            if(0 == intval($value)) {
              $this->{$key} = false;
            } else {
              $this->{$key} = true;
            } // end if
          }
          else 
          {
            $this->{$key} = $value;
          } // end if

        } // end if
      	
      } // end foreach

      if(!empty($this->cancel_receipt_urls))
      {
        $this->cancel_receipt_url = $this->cancel_receipt_urls[0];
      } // end if

  	} // end method

} // end class