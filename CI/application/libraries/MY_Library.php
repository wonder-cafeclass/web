<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * php library 타입에서 기본적으로 사용하게 되는 메서드들을 모아 놓은 클래스. library 클래스가 이것을 상속받아 사용한다.
 * Wrapping class for php curl
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Library
{
	public $CI=null;

    function __construct()
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) 
        {
            return;
        }
    }

    // @ Desc : 이 클래스를 실행하기 전에 준비해야 하는 사전 정보들에 대한 검사.
    public function is_not_ready()
    {
        return !$this->is_ready();
    } // end method
    public function is_ready()
    {
        if(is_null($this->CI->my_tracker)) 
        {
            return false;
        }
        else if(is_null($this->CI->my_paramchecker)) 
        {
            return false;
        }
        else if($this->CI->my_paramchecker->is_not_ok_const()) 
        {
            return false;
        }
        else if(is_null($this->CI->my_error)) 
        {
            return false;
        }

        return true;
    } // end method

    // @ Desc : php 내부에서 로직 흐름을 트랙킹을 도와주는 메서드들. My_Tranker.php를 사용합니다.
    public function add_track($class_name="", $method_name="", $line_num=-1, $msg="")
    {
        if(is_null($this->CI->my_tracker)) {
            return;
        }

        $this->CI->my_tracker->add($class_name, $method_name, $line_num, $msg);
    } // end method

    public function add_track_init($class_name="", $method_name="", $line_num=-1)
    {
        if(is_null($this->CI->my_tracker)) {
            return;
        }

        $this->CI->my_tracker->add_init($class_name, $method_name, $line_num);
    } // end method

    public function add_track_stopped($class_name="", $method_name="", $line_num=-1, $msg)
    {
        if(is_null($this->CI->my_tracker)) {
            return;
        }

        $this->CI->my_tracker->add_stopped($class_name, $method_name, $line_num, $msg);
    } // end method   

    // @ Desc : 파라미터 값들이 정상인지 검사하는 함수들. My_Paramchecker를 사용합니다.
    public function is_not_ok($key=null, $value=null) 
    {   
        return !$this->is_ok($key, $value);
    }

    public function is_ok($key=null, $value=null) 
    {
        if(is_null($this->CI->my_paramchecker)) 
        {
            return false;
        }
        else if($this->CI->my_paramchecker->is_not_ok_const()) 
        {
            return false;
        }
        else if(is_null($key)) 
        {
            return false;
        }
        else if(is_null($value)) 
        {
            return false;
        } // end if

        $result = $this->CI->my_paramchecker->is_ok($key, $value);
        if(isset($result) && ($result["success"] === true)) 
        {
            return true;
        }
        return false;
    }     

    // @ Desc : my_paramchecker가 가지고 있는 상수값 리스트를 키 이름에 맞게 줍니다.
    public function get_const($key="") 
    {
    	if($this->is_not_ready()) 
    	{
    		return null;
    	}

        return $this->CI->my_paramchecker->get_const($key);
    }

    // @ Desc : Error Logger
    public function add_error($class_name="", $method_name="", $event="", $message="", $extra=null)
    {
    	if($this->is_not_ready()) 
    	{
    		return;
    	}

        $this->CI->my_error->add($class_name, $method_name, $event, $message, $extra);
    } // end method

} // end class