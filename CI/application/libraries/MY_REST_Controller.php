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
require APPPATH . '/libraries/REST_Controller.php';
require APPPATH . '/libraries/MY_Class.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : Controller에서 자주 사용되는 메서드들을 모아 만든 Wrapper Class
*/
class MY_REST_Controller extends REST_Controller implements MY_Class{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        // $this->methods['list_get']['limit'] = 500; // 500 requests per hour per user/key

        // Set time zone as Seoul
        date_default_timezone_set('Asia/Seoul');

        // init database
        $this->load->database();

        // init error logger
        $this->load->library('MY_Error');

        // init path util
        $this->load->library('MY_Path');

        // init My_KeyValue
        $this->load->library('MY_KeyValue');

        // init param checker
        $this->load->library('MY_ParamChecker');

        // init MyReponse
        $this->load->library('MY_Response');

        // init MyTime
        $this->load->library('MY_Time');

        // init MyCurl
        $this->load->library('MY_Curl');

        // init MyAPIKey
        $this->load->library('MY_ApiKey');

        // init MySql
        $this->load->library('MY_Sql');

        // init UserAgent
        $this->load->library('user_agent');

        // init MyLogger
        $this->load->library('MY_Logger');

        // init MyTracker
        $this->load->library('MY_Tracker');

    }

    // @ Required : MyClass interface
    public function is_not_ok() 
    {
        return !$this->is_ok();
    }

    // @ Required : MyClass interface
    public function is_ok() 
    {

        $is_ok = true;
        if($this->my_error->hasError()) {

            $data = [];
            $data["track"] = $this->my_tracker->flush();

            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                MY_Response::$EVENT_UNKNOWN_ERROR_OCCURED, 
                // $query="" 
                "", 
                // $data=null 
                $data, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
            $this->set_response($response_body, REST_Controller::HTTP_OK); 
            $is_ok = false;
        }

        return $is_ok;
    }

    public function is_not_ok_param($key=null, $value=null)
    {
        return !$this->is_ok_param($key, $value);
    }
    public function is_ok_param($key=null, $value=null)
    {
        if(is_null($key)) 
        {
            return false;
        }
        if(is_null($value)) 
        {
            return false;
        }
        if(!isset($this->my_paramchecker)) 
        {
            return false;
        }

        $result = $this->my_paramchecker->is_ok($key, $value);
        if(isset($result) && ($result["success"] === true)) 
        {
            return true;
        }
        return false;
    }

    // Add methods ...

    /*
    *   @ Desc : 서버 내부 에러 응답 객체를 만드는 helper method. 
    *   function, file, line num을 필수 인자로 받습니다.
    *   
    *   @ Usage : 
    *   $this->respond_500_detail($err_msg,__FUNCTION__,__FILE__,__LINE__);
    *   
    */
    public function respond_500_detail($msg="", $function="", $file="", $line="") {

        if(empty($msg)) 
        {
            return;
        }
        if(empty($function)) 
        {
            return;
        }
        if(empty($file)) 
        {
            return;
        }
        if(empty($line)) 
        {
            return;
        }
        $msg = "$msg / $function in $file at $line";

        $this->respond_500($msg);
    }

    /*
    *   @ Desc : 서버 내부 에러 응답 객체를 만드는 helper method
    */
    public function respond_500($msg="")
    {
        if(empty($msg)) 
        {
            return;
        }

        if(method_exists($this, 'set_response') && isset($this->my_response))
        {
            $this->set_response(
                // $response_body
                $this->my_response->getResBodyFailMsg($msg),
                // status code
                REST_Controller::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        $this->report_error(
            // $error_type=null
            $this->my_logger->ERROR_INTERNAL_SERVER_500,
            // $error_msg=""
            $msg
        );
    }

    /*
    *   @ Desc : 에러 상황을 기록하는 Logger method wrapper
    */
    public function report_error($error_type=null, $error_msg="")
    {
        if(is_null($error_type)) 
        {
            return;
        }
        if(empty($error_msg))
        {
            return;
        }
        if(is_null($this->my_logger)) 
        {
            return;
        }

        $this->my_logger->add_error(
            // $user_id=-1
            -1,
            // $error_type=""
            $error_type,
            // $error_msg=""
            $error_msg
        );
    }   

    // @ Desc : 200 응답 객체에 tracker 정보를 추가합니다.
    public function respond_200_v2($data=null) 
    {
        if(is_null($data))
        {
            $data = [];
        } 
        $this->my_tracker->add_stopped($file, $function, $line, "respond_200_Failed_v2");
        $data["track"] = $this->my_tracker->flush();

        $this->respond_200($data);
    }

    /*
    *   @ Desc : 서버 내부 200 정상 응답 객체를 만드는 helper method. 결과는 성공.
    */
    public function respond_200($data=null)
    {
        if(is_null($data)) 
        {
            return;
        }

        if(method_exists($this, 'set_response') && isset($this->my_response))
        {
            $response_body = $this->my_response->getResBodySuccessData($data);
            $this->set_response($response_body, REST_Controller::HTTP_OK);
        }
    } 

    public function respond_200_Failed_v2($file="", $function="", $line="", $data=null, $msg="", $error_msg="", $extra=null)
    {
        if(is_null($data))
        {
            $data = [];
        } 
        $this->my_tracker->add_stopped($file, $function, $line, $msg);
        $data["track"] = $this->my_tracker->flush();

        $this->respond_200_Failed(
            // $msg="", 
            $msg,
            // $function="", 
            $function,
            // $file="", 
            $file,
            // $line="", 
            $line,
            // $data=null, 
            $data,
            // $error_msg="", 
            $error_msg,
            // $extra=null
            $extra
        );
    }

    /*
    *   @ Desc : 서버 내부 200 정상 응답 객체를 만드는 helper method. 결과는 유저 파라미터에 의한 실패.
    */
    public function respond_200_Failed($msg="", $function="", $file="", $line="", $data=null, $error_msg="", $extra=null)
    {
        if(is_null($msg)) 
        {
            return;
        }
        if(is_null($function)) 
        {
            return;
        }
        if(is_null($file)) 
        {
            return;
        }
        if(is_null($line)) 
        {
            return;
        }

        $msg = "$msg / $function in $file at $line";

        // view에서 넘어오는 값이 잘못되었음. 
        // view에 오류가 있다는 것을 알려주는 지표로 사용.
        $this->report_error(
            // $error_type=null
            $this->my_logger->ERROR_BAD_REQUEST_400,
            // $error_msg=""
            $msg
        );        

        if(method_exists($this, 'set_response') && isset($this->my_response))
        {
            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                $msg,
                // $query=null
                "",
                // $data=null 
                $data,
                // $error=null
                $error_msg,
                // $extra=null
                $extra
            );
            $this->set_response($response_body, REST_Controller::HTTP_OK);
        }
    } 


    /*
    *   @ Desc : my_paramchecker가 가지고 있는 상수값 리스트를 키 이름에 맞게 줍니다.
    */
    public function get_const($key="") 
    {
        if(empty($key)) 
        {
            return null;
        }
        if(!isset($this->my_paramchecker)) 
        {
            return null;
        }

        return $this->my_paramchecker->get_const($key);
    }


}
