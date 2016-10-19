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

    public function __construct($CI=null)
    {
        // Do something...
    }

    public function getResBodySuccess($query="", $data=null, $check_list=null, $extra=null) {
        return $this->getResBody(true, "Done", $query, $data, $check_list, $extra);        
    }

    public function getResBodyFail($message="", $query="", $data=null, $check_list=null, $extra=null) {
        return $this->getResBody(false, $message, $query, $data, $check_list, $extra);        
    }

    public function getResBody($success=false, $message="", $query="", $data=null, $check_list=null, $extra=null) 
    {
        $response_body = [
            'success' => $success,
            'message' => $message,
            'query' => $query,
            'data' => $data,
            'check_list' => $check_list,
            'extra' => $extra
        ];

        return $response_body;
    }

}