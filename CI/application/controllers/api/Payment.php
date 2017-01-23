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

require_once APPPATH . '/libraries/MY_REST_Controller.php';
require_once APPPATH . '/models/PaymentImport.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : 결재 관련 Callback 및 정산 처리
*/

class Payment extends MY_REST_Controller {

    private $api_post_access = "https://api.iamport.kr/users/getToken";
    private $api_get_payment = "https://api.iamport.kr/payments/{imp_uid}";
    private $api_post_cancel_payment = "https://api.iamport.kr/payments/cancel";



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

        // Additional Library
        $this->load->library('MY_Auth');
        $this->load->library('MY_Calendar');
        $this->load->library('MY_KlassCalendar', ['my_calendar'=>$this->my_calendar]);
        $this->load->library('MY_Decorator');
        $this->load->library('MY_CC_Email');
    }

    // @ Desc : Import의 특정 결재 내역 리스트를 가져옵니다.
    public function fetchimporthistory_post()
    {
        $output = [];
        $this->my_tracker->add_init(__CLASS__,__FUNCTION__,__LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        } 

        // @ Required - pagination
        $page_num = 
        $this->my_paramchecker->post(
            // $key=""
            "page_num",
            // $key_filter=""
            "page_num",
            // $is_no_record=false
            true
        );
        if(empty($page_num)) {
            $page_num = 1;
        }
        // @ Required - pagination
        $page_row_cnt = 
        $this->my_paramchecker->post(
            // $key=""
            "page_row_cnt",
            // $key_filter=""
            "page_row_cnt",
            // $is_no_record=false
            true
        );
        if(empty($page_row_cnt)) {
            $page_row_cnt = 10;
        } // end if
        $limit = 
        $this->my_pagination->get_limit(
            // $page_num=-1, 
            $page_num,
            // $page_row_cnt=-1
            $page_row_cnt
        );
        $offset = 
        $this->my_pagination->get_offset(
            // $page_num=-1, 
            $page_num,
            // $page_row_cnt=-1
            $page_row_cnt
        );         

        $payment_imp_uid = 
        $this->my_paramchecker->post(
            // $key=""
            "payment_imp_uid",
            // $key_filter=""
            "payment_imp_uid",
            // $is_no_record=false
            true
        );
        if(empty($payment_imp_uid)) 
        {
            $payment_imp_uid = "";
        }

        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id",
            // $is_no_record=false
            true
        );
        if(empty($klass_id)) 
        {
            $klass_id = -1;
        }

        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );

        $login_user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "login_user_id",
            // $key_filter=""
            "user_id"
        );

        $params = array(
            "payment_imp_uid"=>$payment_imp_uid,
            "klass_id"=>$klass_id,
            "user_id"=>$user_id,
            "login_user_id"=>$login_user_id,
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset
        );
        $output["params"] = $params; 

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"fetchimporthistory_post Failed!");
            return;
        } // end if

        $total_cnt = 
        $this->my_sql->select_payment_import_cnt(
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1
            $user_id
        );
        $output["total_cnt"] = $total_cnt;
        $pagination = 
        $this->my_pagination->get(
            // $total_row_cnt=-1, 
            $total_cnt,
            // $cursor_page_num=-1, 
            $page_num,
            // $row_cnt_per_page=-1
            $page_row_cnt
        );
        $output["pagination"] = $pagination;

        $pi_list = 
        $this->my_sql->select_payment_import_list(
            // $limit=-1,
            $limit,
            // $offset=-1,
            $offset,
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1
            $user_id
        );

        $pi_list = 
        $this->my_decorator->deco_payment_import_list($pi_list);
        $output["list"] = $pi_list;

        $this->respond_200_v2(__CLASS__,__FUNCTION__,__LINE__,$output);

    } // end method

    private function add_import_history($payment_imp_uid="", $klass_id=-1, $user_id=-1, $login_user_id=-1, $output=null)
    {
        if(empty($payment_imp_uid)) 
        {
            return $output;
        }
        if(!(0 < $klass_id)) 
        {
            return $output;
        }
        if(!(0 < $user_id)) 
        {
            return $output;
        }
        if(!(0 < $login_user_id)) 
        {
            return $output;
        }
        if(is_null($output))
        {
            $output = [];   
        }

        $access_token = "";
        $is_ok = true;
        // 1. Access Token 가져오기
        $access_token = $this->getAccessToken();
        if(empty($access_token)) 
        {
            $is_ok = false;
        }
        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"add_import_history Failed!");
            return;
        } // end if

        // $access_token
        $jsonPaymentImp = $this->getPayment($access_token, $payment_imp_uid);
        if(empty($jsonPaymentImp)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$jsonPaymentImp is not valid!");
            return;
        } // end if

        $paymentImp = new PaymentImport();
        $paymentImp->setJSON($jsonPaymentImp);
        $paymentImp->klass_id = $klass_id;
        $paymentImp->user_id = $user_id;

        // 결제 데이터를 DB에 저장. 
        $this->my_sql->add_payment_import(
            // $login_user_id=-1, 
            $login_user_id,
            // $payment_imp=null
            $paymentImp
        );

        // 저장한 데이터를 가져옴 
        $paymentImpFromDB = 
        $this->my_sql->select_payment_import($payment_imp_uid);

        // REMOVE ME
        // $paymentImpNext = new PaymentImport();
        // $paymentImpNext->setJSON($paymentImpFromDB);

        $paymentImpNext = 
        $this->my_decorator->deco_payment_import($paymentImpFromDB);

        $output["paymentImpNext"] = $paymentImpNext;

        return $output;

    }

    // @ TEST
    // http://http://devcafeclass.com/CI/index.php/api/payment/test
    public function test_get()
    {
        $output = [];

        $date_attend = 
        $this->my_time->get_day_with_day_name(
            // $day_name="", 
            "mon",                    
            // $interval_weeks=0
            0
        );

        $output["date_attend"] = $date_attend;

        $this->respond_200_v2(__CLASS__,__FUNCTION__,__LINE__,$output);

    }

    private function add_klass_attendance($login_user_id=-1, $klass=null, $user_id=-1)
    {
        if(is_null($klass))
        {
            $this->my_tracker->add_stopped(__CLASS__,__FUNCTION__,__LINE__,"is_null(\$klass)");
            return false;
        } // end if
        if(!(0 < $login_user_id))
        {
            $this->my_tracker->add_stopped(__CLASS__,__FUNCTION__,__LINE__,"\$login_user_id is not valid!");
            return false;
        } // end if
        if(!(0 < $user_id))
        {
            $this->my_tracker->add_stopped(__CLASS__,__FUNCTION__,__LINE__,"\$user_id is not valid!");
            return false;
        } // end if


        // 1. 수업 시작일
        $date_begin = $klass->date_begin;
        if(empty($date_begin))
        {
            $this->my_tracker->add_stopped(__CLASS__,__FUNCTION__,__LINE__,"\$date_begin is not valid!");
            return false;
        }
        // 2. 수업 요일
        $days_list = $klass->days_list;
        if(empty($days_list))
        {
            $this->my_tracker->add_stopped(__CLASS__,__FUNCTION__,__LINE__,"\$days_list is not valid!");
            return false;
        }

        // 3. 수업 주수
        $week = $klass->week;
        if(!(0 < $week))
        {
            $this->my_tracker->add_stopped(__CLASS__,__FUNCTION__,__LINE__,"\$week is not valid!");
            return false;
        }

        // 수업 시작일이 지금부터 몇주 뒤인지 알아야 합니다.
        $klass_week_interval = $this->my_time->get_week_interval($date_begin);
        $this->my_tracker->add(__CLASS__,__FUNCTION__,__LINE__,"\$klass_week_interval : $klass_week_interval");

        for ($i=0; $i < $week; $i++) { 
            $klass_week_interval_next = $klass_week_interval + $i;
            foreach ($days_list as $day) {

                $date_attend = 
                $this->my_time->get_day_with_day_name(
                    // $day_name="", 
                    $day,                    
                    // $interval_weeks=0
                    $klass_week_interval_next
                );

                $date_attend_yyyymmdd_hhmmss = 
                $date_attend . " " . $klass->time_begin . ":00";

                $this->my_sql->insert_attendance(
                    // $login_user_id=-1, 
                    $login_user_id,
                    // $klass_id=-1, 
                    $klass->id,
                    // $user_id=-1, 
                    $user_id,
                    // $date_attend=""
                    $date_attend_yyyymmdd_hhmmss
                );

            } // end foreach
        } // end for

        return true;
    } // end method

    // @ Desc : 결제가 완료된 수업에 대한 처리를 합니다. 1. 결제 정보 등록, 2. 이메일 발송 
    public function afterbuyklass_post()
    {
        $output = [];
        $this->my_tracker->add_init(__CLASS__,__FUNCTION__,__LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        } 

        $payment_imp_uid = 
        $this->my_paramchecker->post(
            // $key=""
            "payment_imp_uid",
            // $key_filter=""
            "payment_imp_uid"
        ); 

        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );

        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );

        $login_user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "login_user_id",
            // $key_filter=""
            "user_id"
        );

        $params = array(
            "payment_imp_uid"=>$payment_imp_uid,
            "klass_id"=>$klass_id,
            "user_id"=>$user_id,
            "login_user_id"=>$login_user_id
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"afterbuyklass_post Failed!");
            return;
        } // end if   

        // 결제 내역 등록
        $output = 
        $this->add_import_history(
            // $payment_imp_uid="", 
            $payment_imp_uid,
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1, 
            $user_id,
            // $login_user_id=-1, 
            $login_user_id,
            // $output=null
            $output
        );

        // 결제 정보 확인
        $paymentImpNext = $output["paymentImpNext"];
        if(is_null($paymentImpNext))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"is_null(\$paymentImpNext)");
            return;
        } // end if

        // 결제 영수증 링크 가져오기
        $receipt_url = $paymentImpNext->receipt_url;
        if(empty($receipt_url))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"empty(\$receipt_url)");
            return;
        } // end if

        // 수업 결제가 완료되었습니다.
        // 액션 로그를 남깁니다.
        $this->my_logger->add_action(
            // $user_id=-1, 
            $login_user_id,
            // $action_type="",
            $this->my_logger->ACTION_TYPE_PAYMENT,
            // $action_key=""
            $this->my_logger->ACTION_KEY_PAYMENT_BUY_KLASS
        );

        // 결제된 수업 정보에 따라 유저의 출석부를 만들어 줍니다.
        // wonder.jung
        // 수업 정보를 가져온다.
        $klass = $this->my_sql->select_klass($klass_id);
        if(is_null($klass)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$klass is not valid!");
            return;
        } // end if   

        $klass = $this->my_decorator->deco_klass($klass);
        $output["klass"] = $klass;
        $is_ok = 
        $this->add_klass_attendance(
            // $login_user_id=-1
            $login_user_id,
            // $klass=null, 
            $klass,
            // $user_id=-1
            $user_id
        );
        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"afterbuyklass_post Failed!");
            return;
        } // end if

        // 수업일수만큼 반복해서 입력.
        // 로그남기기 - 출석부 만들기 
        $this->my_logger->add_action(
            // $user_id=-1, 
            $login_user_id,
            // $action_type="",
            $this->my_logger->ACTION_TYPE_PAYMENT,
            // $action_key=""
            $this->my_logger->ACTION_KEY_PAYMENT_SET_ATTENDANCE
        );

        // 이메일 발송
        // 결재가 완료되었음을 이메일로 유저, 선생님, 운영자에게 알린다.
        // 1. 유저 정보를 가져온다.
        $user = $this->my_sql->select_user_by_id($user_id);
        $user_nickname = $user->nickname;
        $output["user"] = $user;
        // 2-1. 수업 이름
        $klass_title = $klass->title;
        // 3. 선생님 정보를 가져온다. 
        $teacher = $this->my_sql->select_teacher(intval($klass->teacher_id));
        $output["teacher"] = $teacher;

        // 1. 유저에게 이메일 보내기
        $this->my_cc_email->send_mail_to_user(
            // $user_id=-1, 
            $login_user_id,
            // $receiver_email="", 
            $user->email,
            // $subject="", 
            '[카페클래스]안녕하세요, 카페클래스입니다. 수업 - \''.$klass_title.'\'에 참여해주셔서 감사합니다.',
            // $message=""
            $receipt_url
        );
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, 'Email has been sent to \''.$user_nickname.'\' for joining \''.$klass_title.'\'');
        // 2. 선생님에게 이메일 보내기
        $this->my_cc_email->send_mail_to_user(
            // $user_id=-1, 
            $login_user_id,
            // $receiver_email="",
            $teacher->email,
            // $subject="", 
            '[카페클래스]안녕하세요, 카페클래스입니다. 축하합니다! 선생님의 수업 - \''.$klass_title.'\'에 새로운 학생 - \''.$user_nickname.'\'이 참여했습니다.',
            // $message=""
            '[카페클래스]안녕하세요, 카페클래스입니다. 축하합니다! 선생님의 수업 - \''.$klass_title.'\'에 새로운 학생 - \''.$user_nickname.'\'이 참여했습니다.'
        );
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, 'Email has been sent to teacher for \''.$user_nickname.'\' is joining \''.$klass_title.'\'');

        $this->respond_200_v2(__CLASS__,__FUNCTION__,__LINE__,$output);

    } // end method

    // @ Desc : Import의 특정 결재 내역을 업데이트합니다. 결재 이후에 호출됩니다.
    public function addimporthistory_post()
    {
        $output = [];
        $this->my_tracker->add_init(__CLASS__,__FUNCTION__,__LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        } 

        $payment_imp_uid = 
        $this->my_paramchecker->post(
            // $key=""
            "payment_imp_uid",
            // $key_filter=""
            "payment_imp_uid"
        );

        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );

        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );

        $login_user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "login_user_id",
            // $key_filter=""
            "user_id"
        );

        $params = array(
            "payment_imp_uid"=>$payment_imp_uid,
            "klass_id"=>$klass_id,
            "user_id"=>$user_id,
            "login_user_id"=>$login_user_id
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"addimporthistory_post Failed!");
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
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"addimporthistory_post Failed!");
            return;
        } // end if

        // $access_token
        $jsonPaymentImp = $this->getPayment($access_token, $payment_imp_uid);
        if(empty($jsonPaymentImp)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$jsonPaymentImp is not valid!");
            return;
        } // end if

        $paymentImp = new PaymentImport();
        $paymentImp->setJSON($jsonPaymentImp);
        $paymentImp->klass_id = $klass_id;
        $paymentImp->user_id = $user_id;
        // $output["paymentImp"] = $paymentImp;

        // 결제 데이터를 DB에 저장. 
        $this->my_sql->add_payment_import(
            // $login_user_id=-1, 
            $login_user_id,
            // $payment_imp=null
            $paymentImp
        );

        // 저장한 데이터를 가져옴 
        $paymentImpFromDB = 
        $this->my_sql->select_payment_import($payment_imp_uid);
        $paymentImpNext = new PaymentImport();
        $paymentImpNext->setJSON($paymentImpFromDB);
        $output["paymentImpNext"] = $paymentImpNext;

        $this->respond_200_v2(__CLASS__,__FUNCTION__,__LINE__,$output);
    }


    // @ Desc : Import의 특정 결재 내역을 취소합니다.
    public function cancelpaymentimport_post()
    {
        $output = [];
        $this->my_tracker->add_init(__CLASS__,__FUNCTION__,__LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        } 

        $login_user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "login_user_id",
            // $key_filter=""
            "user_id"
        );        

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

        $params = array(
            "login_user_id"=>$login_user_id,
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "login_user_id"=>$login_user_id
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"addimporthistory_post Failed!");
            return;
        } // end if

        // wonder.jung
        // 결제 취소를 위해 필요한 데이터를 가져옵니다.
        // 수업 결재 상태가 "A"여야 합니다.
        $klass_student = 
        $this->my_sql->select_klass_student(
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1, 
            $user_id,
            // $status=""
            "A"
        );

        $payment_import_id = intval($klass_student->payment_import_id);
        if(!(0 < $payment_import_id))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$payment_import_id is not valid!");
            return;
        } // end if

        // 결재 정보를 가져옵니다.
        $payment_import = 
        $this->my_sql->select_payment_import_by_id($payment_import_id);
        if(is_null($payment_import))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$payment_import is not valid!");
            return;
        }
        $payment_import = 
        $this->my_decorator->deco_payment_import($payment_import);

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
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"addimporthistory_post Failed!");
            return;
        } // end if

        $jsonPaymentImp = 
        $this->cancelPayment(
            // $user_id=-1,
            $login_user_id,
            // $access_token="", 
            $access_token, 
            // $imp_uid="", 
            $payment_import->imp_uid,
            // $merchant_uid="", 
            $payment_import->merchant_uid,
            // $cancel_amount=-1, 
            $payment_import->amount,
            // $reason=""
            "고객 요청에 의한 환불"
        );
        if(empty($jsonPaymentImp)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$jsonPaymentImp is not valid!");
            return;
        } // end if
        $output["jsonPaymentImp"] = $jsonPaymentImp;

        $paymentImp = new PaymentImport();
        $paymentImp->setJSON($jsonPaymentImp);
        $paymentImp->klass_id = $klass_id;
        $paymentImp->user_id = $user_id;
        
        $payment_imp_uid = $paymentImp->imp_uid;
        if(empty($payment_imp_uid)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$payment_imp_uid is not valid!");
            return;
        } // end if


        // 결제 취소 데이터를 DB에 저장. 
        $this->my_sql->add_payment_import(
            // $login_user_id=-1, 
            $login_user_id,
            // $payment_imp=null
            $paymentImp
        );

        // 저장한 데이터를 가져옴 
        // imp_uid
        $paymentImpFromDB = 
        $this->my_sql->select_payment_import_canceled($payment_imp_uid);
        $paymentImpNext = 
        $this->my_decorator->deco_payment_import($paymentImpFromDB);
        if(is_null($paymentImpNext)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$payment_imp_uid is not valid!");
            return;
        } // end if
        $output["paymentImpNext"] = $paymentImpNext;

        // 결제 취소 영수증 가져오기
        $cancel_receipt_url = "";
        if(!empty($paymentImpNext->cancel_receipt_url))
        {
            $cancel_receipt_url = $paymentImpNext->cancel_receipt_url;
        }
        if(empty($cancel_receipt_url)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$cancel_receipt_url is not valid!");
            return;
        } // end if

        // 결제 취소가 되었습니다. 
        // 수업을 등록한 학생 정보 상태도 "N"상태로 변경해줍니다.
        $this->my_sql->update_klass_student(
            // $login_user_id=-1, 
            $login_user_id,
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1, 
            $user_id,
            // $klass_n_student_status=""
            "N"
        );

        // 메일 내용은 기존 카페 클래스에서 확인해볼것!
        // 특정 조건에 의한 부분 취소등에 의해 원금과 차액이 발생할 경우의 안내 내용은 어떻게?

        // # 이메일 - 취소 - 운영진 확인뒤 진행
        // a. # 고객 메일 - 인사말과 영수증('영수증 출력하기 - 버튼')이 같이 나간다.
        // c. # 운영자 메일 - 취소 고객. / info@cafeclass.kr
        // d. # 강사님에게도 노티 취소 메일.

        // wonder.jung
        // 결재가 완료되었음을 유저, 선생님, 운영자에게 알린다.
        // 1. 유저 정보를 가져온다.
        $user = $this->my_sql->select_user_by_id($user_id);
        if(is_null($user)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$user is not valid!");
            return;
        } // end if

        $user_nickname = $user->nickname;
        // $output["user"] = $user;
        // 2. 수업 정보를 가져온다.
        $klass = $this->my_sql->select_klass($klass_id);
        if(is_null($klass)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$klass is not valid!");
            return;
        } // end if

        $klass = $this->my_decorator->deco_klass($klass);
        // $output["klass"] = $klass;
        // 2-1. 수업 이름
        $klass_title = $klass->title;
        // 3. 선생님 정보를 가져온다. 
        $teacher = $this->my_sql->select_teacher(intval($klass->teacher_id));
        if(is_null($teacher)) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$teacher is not valid!");
            return;
        } // end if
        // $output["teacher"] = $teacher;

        // 1. 유저에게 이메일 보내기
        $this->my_cc_email->send_mail_to_user(
            // $user_id=-1, 
            $login_user_id,
            // $receiver_email="", 
            $user->email,
            // $subject="", 
            '[카페클래스]안녕하세요, 카페클래스입니다. 수업 - \''.$klass_title.'\'의 결제가 취소되었습니다.',
            // $message=""
            $cancel_receipt_url
        );
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, 'Email has been sent to \''.$user_nickname.'\' for \''.$klass_title.'\' canceled');
        // 2. 선생님에게 이메일 보내기
        $this->my_cc_email->send_mail_to_user(
            // $user_id=-1, 
            $login_user_id,
            // $receiver_email="",
            $teacher->email,
            // $subject="", 
            '[카페클래스]안녕하세요, 카페클래스입니다. 선생님의 수업 - \''.$klass_title.'\'을(를) 학생 - \''.$user_nickname.'\'님께서 취소했습니다.',
            // $message=""
            '[카페클래스]안녕하세요, 카페클래스입니다. 선생님의 수업 - \''.$klass_title.'\'을(를) 학생 - \''.$user_nickname.'\'님께서 취소했습니다.'
        );
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, 'Email has been sent to teacher for \''.$user_nickname.'\' has canceled \''.$klass_title.'\'');

        $this->respond_200_v2(__CLASS__,__FUNCTION__,__LINE__,$output);
    }    

    // @ Desc : Import의 결재내역을 취소합니다.
    // @ Referer : https://api.iamport.kr/#!/authenticate/getToken
    private function cancelPayment($user_id=-1, $access_token="", $imp_uid="", $merchant_uid="", $cancel_amount=-1, $reason="")
    {
        $output = [];
        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        if(!(0 < $user_id))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"!(0 < \$user_id)");
            return;
        } // end if

        if(empty($access_token))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"empty(\$access_token)");
            return;
        } // end if

        if(empty($imp_uid))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"empty(\$imp_uid)");
            return;
        } // end if

        if(empty($merchant_uid))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"empty(\$merchant_uid)");
            return;
        } // end if

        if(!(0 < $cancel_amount))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"!(0 < \$cancel_amount)");
            return;
        } // end if

        if(empty($reason))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"empty(\$reason)");
            return;
        } // end if


        $url = $this->api_post_cancel_payment;
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "\$url : $url");
        // 수업 구매 취소에 대한 로그를 남깁니다.
        $this->my_logger->add_action(
            // $user_id=-1, 
            $user_id,
            // $action_type="",
            $this->my_logger->ACTION_TYPE_PAYMENT,
            // $action_key=""
            $this->my_logger->ACTION_KEY_PAYMENT_CANCEL
        );

        $result =
        $this->my_curl->post_json(
            // $url=""
            $url,
            // $header_arr=null
            [
                "Authorization"=>"$access_token"
            ],
            // $attr_arr=null
            [],
            // $post_params
            [
                "imp_uid"=>"$imp_uid",
                "merchant_uid"=>"$merchant_uid",
                "amount"=>"$cancel_amount",
                "reason"=>"$reason"
            ]
        ); 

        if(empty($result)) {
            $this->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "empty(\$result)");
            // 실패한 경우는 로그를 남깁니다.
            $this->my_logger->add_error(
                // $user_id=-1, 
                $user_id,
                // $error_type="", 
                $this->my_logger->ERROR_PAYMENT_CANCEL_FAILED,
                // $error_msg=""
                "empty(\$result)"
            );
            return null;
        } // end if

        if($result->code < 0) {
            $this->my_tracker->add_stopped(__CLASS__, __FUNCTION__, __LINE__, "\$result->code");
            // 실패한 경우는 로그를 남깁니다.
            $this->my_logger->add_error(
                // $user_id=-1, 
                $user_id,
                // $error_type="", 
                $this->my_logger->ERROR_PAYMENT_CANCEL_FAILED,
                // $error_msg=""
                "\$result->code : " . $result->code
            );

            return null;
        } // end if

        return $result->response;
    }    

    // @ Desc : Import의 Payment를 가져옵니다.
    // @ Referer : https://api.iamport.kr/#!/authenticate/getToken
    private function getPayment($access_token="", $imp_uid="")
    {
        $output = [];
        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        if(empty($access_token))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"empty(\$access_token)");
            return;
        } // end if

        if(empty($imp_uid))
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"empty(\$imp_uid)");
            return;
        } // end if

        $url = str_replace("{imp_uid}",$imp_uid,$this->api_get_payment);
        $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "\$url : $url");

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
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
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
 
}