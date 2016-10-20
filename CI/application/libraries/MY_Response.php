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

    public function __construct($CI=null)
    {
        // Do something...
    }

    public function getResBodySuccess($query="", $data=null, $error=null, $extra=null) {
        return $this->getResBody(true, "Done", $query, $data, $error, $extra);        
    }

    public function getResBodyFail($message="", $query="", $data=null, $error=null, $extra=null) {
        return $this->getResBody(false, $message, $query, $data, $error, $extra);        
    }

    public function getResBody($success=false, $message="", $query="", $data=null, $error=null, $extra=null) 
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