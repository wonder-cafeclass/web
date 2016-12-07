<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Custom Auth class
 * Check Auth in various level - Server(Production/Admin/Dev), User(Teacher/Student/Admin)
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Auth {

	private $admin_json_obj;
	private $admin_json_path="/static/admin.json";
	private $CI=null;

    public function __construct($params=null)
    {

        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) {
            return;
        }

        if(!isset($this->CI->my_error)) {
            return;
        }

    	// Fetch ParamChecker.json
    	$param_check_json_str = "";
    	$target_path = FCPATH . $this->admin_json_path;

    	if(file_exists($target_path)) 
    	{
			$param_check_json_str = file_get_contents($target_path);
    	} 

    	if(!empty($param_check_json_str)) 
    	{
    		$this->admin_json_obj = json_decode($param_check_json_str);
    	} 
    }

    public function is_admin()
    {
        return (isset($this->admin_json_obj))?true:false;
    }

    /*
    *   @ Desc : GET 형식의 url에 query string 파라미터로 전달해도 문제없는 hashkey를 만듭니다. 
    *   query string의 파라미터인 경우, '.'로 끝나면 링크에 포함되지 않는 문제가 있습니다.
    *   그러므로 영문 대소문자,숫자,$기호까지만 포함합니다.
    *
    *   @ Warning : 해시값의 일부분을 강제로 수정해서 사용하므로 password_verify는 불가능합니다.
    */
    public function getHashQueryStringSafe($value) 
    {
        if(empty($value)) 
        {
            return "";
        }

        $hashkey = $this->getHash($value);
        $matches = array();
        preg_match_all('/[a-zA-Z0-9]+/', $hashkey, $matches);

        $hashkeySafe = "";
        if(!empty($matches) && !empty($matches[0])) 
        {
            $hashkeySafe = join("",$matches[0]);
        }
        return $hashkeySafe;
    }

    // @ Referer : http://php.net/manual/kr/function.password-hash.php
    public function getHash($value="")
    {

        if(empty($value)) {
            return "";
        }
        return password_hash($value, PASSWORD_DEFAULT);
    } 

    private function generate_state() 
    {
        $mt = microtime();
        $rand = mt_rand();
        $new_state = md5($mt . $rand);

        $new_state_query_str_safe = $this->getHashQueryStringSafe($new_state);

        return $new_state_query_str_safe;
    } // end function

    private function get_new_state()
    {
        // 상태 토큰으로 사용할 랜덤 문자열을 생성
        $state = $this->generate_state();

        return $state;        
    }

    public function get_new_state_query_string_safe()
    {
        $new_state = $this->get_new_state();
        return $this->getHashQueryStringSafe($new_state);
    }


}