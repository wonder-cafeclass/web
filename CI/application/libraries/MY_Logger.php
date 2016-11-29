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

    public $ERROR_INTERNAL_SERVER_500="INTERNAL_SERVER_500";
    public $ERROR_NOT_ALLOWED_ACCESS_404="NOT_ALLOWED_ACCESS_404";

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
            return;
        }

        if(empty($error_type))
        {
            return;
        }

        if(empty($action_key))
        {
            return;
        }

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
    }    

    public function add_action($user_id=-1, $action_type="", $action_key="")
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
            $action_key
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
        if(is_null($key)) 
        {
            return true;
        }
        if(is_null($value)) 
        {
            return true;
        }
        if(!isset($this->CI->my_paramchecker)) 
        {
            return true;
        }

        if($this->CI->my_paramchecker->is_not_ok($key, $value))
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
    *   @ Referer : https://www.codeigniter.com/user_guide/libraries/input.html#CI_Input::ip_address
    */
    private function get_client_ip()
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
    private function get_client_agent()
    {
        if($this->is_not_ready())
        {
            return "";
        }

        return $this->CI->agent->agent_string();
    } 

    private function get_agent_type()
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