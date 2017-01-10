<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/*
    !Caution/주의!

    require APPPATH . '${your-class-path}';
    ...
    $this->load->library(${your-class-path});

    // 위의 경우처럼 2번 동일한 클래스를 호출하게 되면 $this->${your-class-path} 의 경우, null을 돌려주게 됩니다.

*/

require APPPATH . '/libraries/MY_REST_Controller.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : 결재 관련 Callback 및 정산 처리
*/

class Payment extends MY_REST_Controller {

    private $api_post_access = "https://api.iamport.kr/users/getToken";
    private $api_get_payment = "https://api.iamport.kr/payments/{imp_uid}";



    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Library Loaded from parent - MY_REST_Controller
        /*
        date_default_timezone_set('Asia/Seoul');
        $this->load->database();
        $this->load->library('MY_Error');
        $this->load->library('MY_Path');
        $this->load->library('MY_KeyValue');
        $this->load->library('MY_ParamChecker');
        $this->load->library('MY_Response');
        $this->load->library('MY_Time');
        $this->load->library('MY_Curl');
        $this->load->library('MY_ApiKey');
        $this->load->library('MY_Sql');
        $this->load->library('user_agent');
        $this->load->library('MY_Logger');
        $this->load->library('MY_Tracker');
        $this->load->library('MY_Pagination');
        */

        // init Admin
        $this->load->library('MY_Auth');
        $this->load->library('MY_Decorator');
    }

    // @ Desc : Import의 특정 결재 내역을 업데이트합니다. 결재 이후에 호출됩니다.
    public function addimporthistory_post()
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__,__FUNCTION__,__LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        } 

        $payment_imp_uid = 
        $this->my_paramchecker->post(
            // $key=""
            "payment_imp_uid",
            // $key_filter=""
            "payment_imp_uid"
        );

        $params = array(
            "payment_imp_uid"=>$payment_imp_uid
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"addimporthistory_post Failed!");
            return;
        } // end if


        $access_token = "";
        if($is_ok) 
        {
            // 1. Access Token 가져오기
            $access_token = $this->getAccessToken();
            if(empty($access_token)) 
            {
                $is_ok = false;
            }
        }
        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"addimporthistory_post Failed!");
            return;
        } // end if

        // $access_token
        $result = $this->getPayment($access_token, $payment_imp_uid);
        if(empty($result)) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"addimporthistory_post Failed!");
            return;
        }

        /*
            // 다음 데이터를 DB에 저장. 

            // 1. import 결재 내역 원본 저장.
            // 2. action log에 해당 유저 결재 / 결재 취소 액션 저장.
            // 3. 결재 완료인 경우, 학생 - 수업 관계 테이블에 등록.
            
            // 아임포트 정보
            amount:65000
            apply_num:"33163144"
            buyer_addr:""
            buyer_email:"wonder13662test3@gmail.com"
            buyer_name:"아놀드"
            buyer_postcode:""
            buyer_tel:"010-0000-0003"
            cancel_amount:0
            cancel_reason:null
            cancel_receipt_urls:Array[0]
            cancelled_at:0
            card_name:"신한카드"
            card_quota:0
            currency:"KRW"
            custom_data:null
            escrow:false
            fail_reason:null
            failed_at:0
            imp_uid:"imp_158869218800"
            merchant_uid:"merchant_6_4_1484053869624"
            name:"주문명:여행가서 현지인처럼 주문해보기"
            paid_at:1484054892
            pay_method:"card"
            pg_provider:"html5_inicis"
            pg_tid:"StdpayCARDINIpayTest20170110222811748230"
            receipt_url:"https://iniweb.inicis.com/DefaultWebApp/mall/cr/cm/mCmReceipt_head.jsp?noTid=StdpayCARDINIpayTest20170110222811748230&noMethod=1"
            status:"paid"
            user_agent:"sorry_not_supported_anymore"
            vbank_date:0
            vbank_holder:null
            vbank_name:null
            vbank_num:null
            
            // 카페 클래스 수업 및 학생 정보
            klass_id:-1
            user_id:-1
        */


        // $output["result"] = $result;

        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);
    }

    // @ Desc : Import의 Payment를 가져옵니다.
    // @ Referer : https://api.iamport.kr/#!/authenticate/getToken
    private function getPayment($access_token="", $imp_uid="")
    {
        $output = [];
        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        if(empty($access_token))
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"empty(\$access_token)");
            return;
        } // end if

        if(empty($imp_uid))
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"empty(\$imp_uid)");
            return;
        } // end if

        $url = str_replace("{imp_uid}",$imp_uid,$this->api_get_payment);
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$url : $url");

        $result =
        $this->my_curl->get_json(
            // $url=""
            $url,
            // $header_arr=null
            [
                "Authorization"=>"$access_token"
                // "Authorization"=>"Bearer $access_token"
            ],
            // $attr_arr=null
            [],
            // $post_params
            []
        ); 

        if(empty($result) || $result->code < 0) {
            return null;
        }

        return $result->response;
    }


    // @ Desc : Import의 Access Token을 가져옵니다.
    // @ Referer : https://api.iamport.kr/#!/authenticate/getToken
    private function getAccessToken()
    {
        $output = [];
        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        }

        $REST_API_KEY = 
        $this->my_apikey->get(
            $this->my_apikey->Payment_Import_REST_API_Key
        );

        $REST_API_SECRET_KEY = 
        $this->my_apikey->get(
            $this->my_apikey->Payment_Import_REST_API_Secret_Key
        );

        $result =
        $this->my_curl->post_json(
            // $url="", 
            $this->api_post_access,
            // $header_arr=null, 
            [],
            // $attr_arr=null, 
            [],
            // $post_params=null
            [
                "imp_key"=>$REST_API_KEY,
                "imp_secret"=>$REST_API_SECRET_KEY
            ]            
        );


        // Example
        /*
        {
          "code": 0,
          "message": "string",
          "response": {
            "access_token": "string",
            "expired_at": 0,
            "now": 0
          }
        } 
        */   

        // return $result->response->access_token;

        if(empty($result) || $result->code < 0) {

            return "";

        } else if( isset($result->response) && 
            isset($result->response->access_token) && 
            !empty($result->response->access_token)) 
        {
            return $result->response->access_token;

        }

        return "";

    } // end method

    // @ Desc : 수업 구매 기록을 추가합니다.
    
    public function addbuyklass_post() 
    {
        
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        }

        
        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_status = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_status",
            // $key_filter=""
            "klass_status"
        );

        $params = array(
            "user_id_admin"=>$user_id_admin,
            "klass_id"=>$klass_id,
            "klass_status"=>$klass_status
        );
        $output["params"] = $params;
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "param checked");

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if($is_ok) 
        {
            /*
            $is_ok = 
            $this->my_sql->update_klass_on_admin(
                // $user_id_admin=-1, 
                $user_id_admin,
                // $klass_id=-1, 
                $klass_id,
                // $klass_status="",
                $klass_status
            );
            $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "update_user_on_admin");
            */

            // Sudo code

            /*
            //post ajax request로부터 imp_uid확인
            imp_uid = extract_POST_value_from_url('imp_uid') 
    
            //imp_uid로 아임포트로부터 결제정보 조회
            payment_result = rest_api_to_find_payment(imp_uid) 

            //결제되었어야 하는 금액 조회. 가맹점에서는 merchant_uid기준으로 관리
            amount_to_be_paid = query_amount_to_be_paid(payment_result.merchant_uid) 
    

            IF payment_result.status == 'paid' AND payment_result.amount == amount_to_be_paid
                //결제까지 성공적으로 완료
                success_post_process(payment_result) 
            ELSE IF payment_result.status == 'ready' AND payment.pay_method == 'vbank'
                //가상계좌 발급성공
                vbank_number_assigned(payment_result) 
            ELSE
                //결제실패 처리
                fail_post_process(payment_result) 
            */
        }

        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"addbuyklass_post Failed!");
            return;
        } // end if       

        // 변경된 수업 정보를 가져옵니다.
        $klass = $this->my_sql->select_klass($klass_id);
        $output["klass"] = $klass;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    } // end method
 
}