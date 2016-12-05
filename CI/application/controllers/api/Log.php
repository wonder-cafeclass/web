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
*   @ Desc : 카페클래스 유저 정보를 조회,추가,삭제,변경하는 API 클래스.
*/

class Log extends MY_REST_Controller {

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
        */

        // Please add library you need here!
        $this->load->library('email');
    }


    /*
    *   @ Desc : 유저가 특정 페이지로 진입한 것을 기록합니다.
    */
    public function page_post() 
    {
        if($this->is_not_ok())
        {
            return;
        }

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->respond_500_detail(
                // $msg=""
                "API Key is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;            
        }

        $error_type = $this->my_paramchecker->get('page_type','logger_page_type');
        if(empty($error_type)) 
        {
            $this->respond_500_detail(
                // $msg=""
                "page_type is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }

        $this->my_logger->add_action(
            // $user_id=-1
            -1,
            // $action_type=""
            $this->my_logger->ACTION_PAGE_ENTER,
            // $action_key=""
            $page_key
        );

        // @ Required - 응답객체는 반드시 json 형태여야 합니다.
        $output = [];
        $output["success"] = true;
        $this->respond_200($output);
    } 

    /*
    *   @ Desc : View에서 에러가 발생한 것을 기록합니다.
    */
    public function error_post() 
    {
        if($this->is_not_ok())
        {
            return;
        }

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->respond_500_detail(
                // $msg=""
                "API Key is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;            
        }

        // 콜백 응답에서 facebook_code 파라미터의 값을 가져옴
        $user_id = $this->my_paramchecker->get('user_id','user_id');
        if(empty($user_id)) 
        {
            $user_id = -1;
        }
        else 
        {
            $user_id = intval($user_id);
        }

        $error_type = $this->my_paramchecker->get('error_type','logger_error_type');
        if(empty($error_type)) 
        {
            $this->respond_500_detail(
                // $msg=""
                "error_type is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }

        $error_msg = $this->my_paramchecker->get('error_msg','logger_error_msg');
        if(empty($error_msg))
        {
            $this->respond_500_detail(
                // $msg=""
                "error_msg is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__
            );
            return;
        }

        $this->my_logger->add_error(
            // $user_id=-1
            $user_id,
            // $error_type=""
            $error_type,
            // $error_msg=""
            $error_msg
        );

        // @ Required - 응답객체는 반드시 json 형태여야 합니다.
        $output = [];
        $output["success"] = true;
        $this->respond_200($output);

    }       
}
