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

    public function has($_target=null, $_key=null) 
    {
        if(empty($_key))
        {
            return false;
        }

        foreach ($_target as $key => $value) {
            if(is_numeric($key))
            {
                continue;
            }
            if( $_key === $key )
            {
                return true;
            }
        }

        return false;
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

    public function dig($_target=null, $key_arr=null)
    {
        // search value into several key layers.
        if(is_null($_target))
        {
            return null;
        }

        if(empty($key_arr))
        {
            return null;
        }

        $_key = array_shift($key_arr);
        if(empty($_key))
        {
            return null;
        }

        $value = $this->get($_target, $_key);

        if(empty($key_arr))
        {
            return $value;
        }
        else
        {
            // still have keys to search? Let's dig into it!
            return $this->dig($value, $key_arr);
        }
    }
}