<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 서비스에 사용하는 쿠키들을 관리해주는 클래스.
 * Wrapping class for php curl
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Cookie
{
	public $KEY_USER_LOGIN="KEY_USER_LOGIN";

	private $CI=null;
	private $isOK=true;
	private $reason="";

    public function __construct($params=null)
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) 
        {
        	$this->isOK = false;
        	$this->reason = "!isset(\$this->CI)";
            return;
        }
        if(!isset($this->CI->my_error)) 
        {
        	$this->isOK = false;
        	$this->reason = "!isset(\$this->CI->my_error)";
            return;
        }
        if(!isset($this->CI->my_sql)) 
        {
        	$this->isOK = false;
        	$this->reason = "!isset(\$this->CI->my_sql)";
            return;
        }

        if(!isset($this->CI->my_time)) 
        {
        	$this->isOK = false;
        	$this->reason = "!isset(\$this->CI->my_time)";
            return;
        }
    }

    public function get_reason() 
    {
    	return $this->reason;
    }

    public function set_user_login($user_id=-1)
    {
    	if(!$this->isOK) 
    	{
    		return null;
    	}
    	if(!(0 < $user_id)) 
    	{
    		return null;
    	}

    	$key_hashed = $this->getHash($user_id);

		// 쿠키 만들기 
		$expire_sec = 3 * 60 * 60; // 3 hours
		$path = '/';
		$domain = $_SERVER['SERVER_NAME'];
		setcookie($this->KEY_USER_LOGIN, $key_hashed, time()+$expire_sec, $path, $domain);

		// 해당 해시값을 DB에 저장.
		$this->CI->my_sql->insert_user_cookie(
			// $user_id=-1
			$user_id,
			// $key=""
			$key_hashed,
			// $expire_sec
			$expire_sec
		);

    	return $key_hashed;

    } // end method

    public function delete_user_login()
    {
        if(!$this->isOK) 
        {
            return null;
        }

        // 해당 브라우저의 쿠키(로그인 유저) 지우기
        $path = '/';
        $domain = $_SERVER['SERVER_NAME'];
        setcookie($this->KEY_USER_LOGIN, null, -1, $path, $domain);

    } // end method

    public function get_user_login_cookie()
    {
        $cookie = "";
        if(isset($_COOKIE[$this->KEY_USER_LOGIN])) 
        {
            $cookie = $_COOKIE[$this->KEY_USER_LOGIN];
        }
        
        return $cookie;
    }

    public function get_user_login()
    {
    	if(!$this->isOK) 
    	{
    		return null;
    	}

        $cookie = "";
        if(isset($_COOKIE[$this->KEY_USER_LOGIN])) 
        {
            $cookie = $_COOKIE[$this->KEY_USER_LOGIN];
        }
    	if(empty($cookie)) 
    	{
    		return null;
    	}

    	$user_login = 
		$this->CI->my_sql->select_user_cookie_by_key(
			// $key=""
			$cookie
		);

		return $user_login;
    }

    private function getHash($value="")
    {
        if(empty($value)) {
            return "";
        }

        if(is_null($this->CI->my_time)) {
        	return "";
        }

		$time_now = $this->CI->my_time->get_now_YYYYMMDDHHMMSSU();
		$value = $value . "" . $time_now;
        return password_hash($value, PASSWORD_DEFAULT);
    }

}