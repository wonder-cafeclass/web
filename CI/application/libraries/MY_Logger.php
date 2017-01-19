<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Access, Action, Error 등의 상황의 로그를 기록하기 위한 클래스.
 * Logger for Access, Action, Error
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Logger
{
	private $CI=null;
    private $agent_type_list=null;

    public $ACTION_LOGIN="LOGIN";
    
    public $ACTION_ADD_USER="ADD_USER";
    public $ACTION_PAGE_ENTER="PAGE_ENTER";

    public $ACTION_TYPE_LOGIN_PASSED="LOGIN_PASSED";
    public $ACTION_TYPE_PAGE_ENTER="PAGE_ENTER";
    public $ACTION_TYPE_SIGN_UP="SIGN_UP";
    public $ACTION_TYPE_PAYMENT="PAYMENT"; // 결제
    public $ACTION_TYPE_MY_SETTING="MY_SETTING"; // 개인 설정

    public $ACTION_TYPE_SEND_MAIL="SEND_MAIL";                      // 유저에게 메일 발송 

    public $ACTION_KEY_LOGIN="LOGIN";
    public $ACTION_KEY_LOGIN_KAKAO="LOGIN_KAKAO";
    public $ACTION_KEY_LOGIN_FACEBOOK="LOGIN_FACEBOOK";
    public $ACTION_KEY_LOGIN_NAVER="LOGIN_NAVER";
    public $ACTION_KEY_SEND_MAIL="SEND_MAIL";                       // 유저에게 메일 발송 
    public $ACTION_KEY_SEND_AUTH_MAIL="SEND_AUTH_MAIL";
    public $ACTION_KEY_PAYMENT_BUY_KLASS="PAYMENT_BUY_KLASS";       // 구매
    public $ACTION_KEY_PAYMENT_CANCEL="PAYMENT_CANCEL";             // 환불
    public $ACTION_KEY_UPDATE_PASSWORD="UPDATE_PASSWORD";

    public $ERROR_INTERNAL_SERVER_500="INTERNAL_SERVER_500";
    public $ERROR_NOT_ALLOWED_ACCESS_404="NOT_ALLOWED_ACCESS_404";
    public $ERROR_BAD_REQUEST_400="BAD_REQUEST_400";
    public $ERROR_NOT_VALID_USER_AUTH="NOT_VALID_USER_AUTH";
    public $ERROR_PAYMENT_CANCEL_FAILED="PAYMENT_CANCEL_FAILED";

    public $QUERY_TYPE_INSERT="INSERT";
    public $QUERY_TYPE_UPDATE="UPDATE";
    public $QUERY_TYPE_DELETE="DELETE";

    public $ERROR_SLOW_QUERY="SLOW_QUERY";

    function __construct()
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) 
        {
            return;
        }

        if(!isset($this->CI->my_error)) 
        {
            return;
        }

        if(!isset($this->CI->my_paramchecker)) 
        {
            return;
        }
        $this->agent_type_list = $this->CI->my_paramchecker->get_const("agent_type");

        if(!isset($this->CI->my_db)) 
        {
            return;
        }
    }

    public function add_error($user_id=-1, $error_type="", $error_msg="")
    {
        if($this->is_not_ready())
        {
            return false;
        }

        if(empty($error_type))
        {
            return false;
        }

        if(empty($error_msg))
        {
            return false;
        }

        $is_success = 
        $this->CI->my_sql->insert_log_error(
            // $agent=""
            $this->get_client_agent(),
            // $agent_type=""
            $this->get_agent_type(),
            // $ip=""
            $this->get_client_ip(),
            // $type=""
            $error_type,
            // $user_id=-1
            $user_id,
            // $msg=""
            $error_msg
        );

        return $is_success;
    }

    public function get_error($error_type="")
    {
        if(empty($error_type))
        {
            return;
        }

        $log_error = 
        $this->CI->my_sql->select_log_error(
            // $ip=""
            $this->get_client_ip(),
            // $type=""
            $error_type
        );

        return $log_error;
    }    

    public function add_action($user_id=-1, $action_type="", $action_key="", $page_uri="")
    {
        if($this->is_not_ready())
        {
            return;
        }

        if(empty($action_type))
        {
            return;
        }

        if(empty($action_key))
        {
            return;
        }

        $this->CI->my_sql->insert_log_action(
            // $agent=""
            $this->get_client_agent(),
            // $agent_type=""
            $this->get_agent_type(),
            // $ip=""
            $this->get_client_ip(),
            // $type=""
            $action_type,
            // $user_id=-1
            $user_id,
            // $key=""
            $action_key,
            // $url=""
            $page_uri
        );
    }

    public function add_query($user_id=-1, $action_type="", $query="")
    {
        if($this->is_not_ready())
        {
            return;
        }

        if(empty($action_type))
        {
            return;
        }

        if(empty($query))
        {
            return;
        }

        $this->CI->my_sql->insert_log_query(
            // $agent=""
            $this->get_client_agent(),
            // $agent_type=""
            $this->get_agent_type(),
            // $ip=""
            $this->get_client_ip(),
            // $type=""
            $action_type,
            // $user_id=-1
            $user_id,
            // $query=""
            $query
        );
    }

    // @ Desc : Wrapper of my_db methods

    // @ Desc : Wrapper of my_paramchecker
    private function is_not_ok($key=null, $value=null) 
    {   
        return !$this->is_ok($key, $value);
    }

    private function is_ok($key=null, $value=null) 
    {
        if(is_null($key)) 
        {
            return false;
        }
        if(is_null($value)) 
        {
            return false;
        }
        if(!isset($this->CI->my_paramchecker)) 
        {
            return false;
        }

        $result = $this->CI->my_paramchecker->is_ok($key, $value);
        if(isset($result) && ($result["success"] === true)) 
        {
            return true;
        }
        return false;
    }    

    private function is_not_ready()
    {
        return !$this->is_ready();
    }
    private function is_ready()
    {
        if(is_null($this->CI->my_sql)) 
        {
            return false;
        }
        if(is_null($this->CI->agent)) 
        {
            return false;
        }
        if(is_null($this->agent_type_list))
        {
            return false;   
        }

        return true;
    }


    /*
    *   ex) http://devcafeclass.co.uk/cafeclass/CI/index.php/api/kakao/auth
    *   ex) /cafeclass/CI/index.php/api/kakao/auth --> REQUEST_URI
    */
    private function get_request_uri()
    {
        return $_SERVER['REQUEST_URI'];
    }

    /*
    *   @ Referer : https://www.codeigniter.com/user_guide/libraries/input.html#CI_Input::ip_address
    */
    public function get_client_ip()
    {
        if($this->is_not_ready())
        {
            return "";
        }

        return $this->CI->input->ip_address();
    }

    /*
    *   @ Referer : https://codeigniter.com/userguide3/libraries/user_agent.html
    */
    public function get_client_agent()
    {
        if($this->is_not_ready())
        {
            return "";
        }

        return $this->CI->agent->agent_string();
    } 

    public function get_agent_type()
    {
        if($this->is_not_ready())
        {
            return "";
        }

        // agent_type
        if($this->CI->agent->is_browser())
        {
            return $this->agent_type_list[0];
        }
        else if($this->CI->agent->is_mobile())
        {
            return $this->agent_type_list[1];
        }
        else if($this->CI->agent->is_robot())
        {
            return $this->agent_type_list[1];
        }

        return "";
    }

}