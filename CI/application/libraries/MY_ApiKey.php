<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * API Key class
 * 페이스북, 카카오톡, 네이버 등의 외부 API 호출시 필요한 인증 키 정보를 파일에서 읽어와 관리합니다.
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_ApiKey {

	private $json_obj;
	private $json_path="/static/api.json";
	private $CI=null;

    public $X_Naver_Client_Id="X-Naver-Client-Id";
    public $X_Naver_Client_Secret="X-Naver-Client-Secret";

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
    	$api_key_json_str = "";
    	$target_path = FCPATH . $this->json_path;

    	if(file_exists($target_path)) 
    	{
			$api_key_json_str = file_get_contents($target_path);
    	} 
        else 
        {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_FILE_NOT_EXIST,
                // $message=""
                $target_path, 
                // $extra=null
                null
            );
            return;
        }

    	if(!empty($api_key_json_str)) 
    	{
    		$this->json_obj = json_decode($api_key_json_str);
    	} 
    	else 
    	{
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_PARAM_IS_EMPTY,
                // $message=""
                "\$api_key_json_str", 
                // $extra=null
                null
            );
            return;
    	} // end if

        if(is_null($this->json_obj) || empty($this->json_obj)) {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_JSON_DECODING_IS_FAILED,
                // $message=""
                "", 
                // $extra=null
                null
            );
            return;            
        }
    }

    public function get($key="") {
        if(empty($key)) 
        {
            return null;
        }

        $json_obj = $this->json_obj;
        if(is_null($json_obj)) {
            return null;
        }

        if(isset($json_obj->{$key})) {
            return $json_obj->{$key};
        }

        return null;
    }

}