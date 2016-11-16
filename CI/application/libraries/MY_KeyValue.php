<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * php key-value array 혹은 stdClass의 key로 value를 가져오는 작업을 대신해준다.
 * 형변환도 같이...
 * Wrapping class for php curl
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_KeyValue
{
	private $CI=null;

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

    }

    public function get_number($_target=null, $_key=null)
    {
        $value = $this->get($_target, $_key);
        if(is_null($value))
        {
            return null;
        }
        if(!is_numeric($value))
        {
            return null;
        }

        return intval($value);
    }

    public function get($_target=null, $_key=null) 
    {
        if(empty($_key))
        {
            return null;
        }

        foreach ($_target as $key => $value) {
            if(is_numeric($key))
            {
                continue;
            }
            if( $_key === $key )
            {
                return $value;
            }
        }
    }
}