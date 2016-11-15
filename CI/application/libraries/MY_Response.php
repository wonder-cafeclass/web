<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Format class
 * Return API Response object
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Response 
{
    public static $EVENT_UNKNOWN_ERROR_OCCURED = "Unknown error has occured!";

    private $CI=null;

    public function __construct()
    {
        // Do something...
        $this->CI =& get_instance();
        if(!isset($this->CI)) {
            return;
        }

        if(!isset($this->CI->my_error)) {
            return;
        }

    }

    /*
    *   @ Desc : 원격 통신뒤의 데이터($output)만 전달하는 경우.
    */
    public function getResBodySuccessData($data=null) 
    {
        $response_body = 
        $this->getResBodySuccess(
            // $query="" 
            "", 
            // $data=null 
            $data, 
            // $error=null 
            $this->CI->my_error->get(),
            // $extra=null
            null
        );

        return $response_body;        
    }

    public function getResBodySuccess($query=null, $data=null, $error=null, $extra=null) 
    {
        return $this->getResBody(true, "Done", $query, $data, $error, $extra);        
    }

    public function getResBodyFail($message="", $query=null, $data=null, $error=null, $extra=null) 
    {
        return $this->getResBody(false, $message, $query, $data, $error, $extra);        
    }

    /*
    *   @ Desc : 응답 코드에 메시지만 전달하는 경우.
    */
    public function getResBodyFailMsg($message="") 
    {
        if(empty($message)) 
        {
            return null;
        }

        $response_body = 
        $this->getResBodyFail(
            // $message=""
            $message,
            // $query="" 
            "", 
            // $data=null 
            null, 
            // $error=null 
            $this->CI->my_error->get(),
            // $extra=null
            null
        );

        return $response_body;
    }

    public function getResBody($success=false, $message="", $query=null, $data=null, $error=null, $extra=null) 
    {
        $response_body = [
            'success' => $success,
            'message' => $message,
            'query' => $query,
            'data' => $data,
            'error' => $error,
            'extra' => $extra
        ];

        return $response_body;
    }

}