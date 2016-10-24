<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Format class
 * Check parameter validation with json which contains parameters' specification
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Path {

	private $CI=null;
	private $web_root_path=null;

    public function __construct($params=null)
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) 
        {
            return;
        }

    	$abs_path = $_SERVER['DOCUMENT_ROOT'];
        $path_info = $_SERVER['PATH_INFO'];
        $http_host = $_SERVER['HTTP_HOST'];
        $req_uri = $_SERVER['REQUEST_URI'];

        // remove query string
        $result = explode("?",$req_uri);
        if(empty($result)) 
        {
        	return;
        }
        $req_uri = $result[0];

        $this->web_root_path = str_replace("/CI/index.php$path_info","",$req_uri);
	}	

	public function get_web_root_path() 
	{
		return $this->web_root_path;
	}

	public function get($target_path="")
	{

		$pattern = '/^(http|https)/';
		preg_match($pattern, $target_path, $matches);

		if(empty($matches)) 
		{	
			// 내부 경로 리소스

			// 경로 처음에 "/"를 포함한 경우
			if(strpos($target_path,"/") === 0) 
			{
				return $this->web_root_path . $target_path;
			}
			else
			{
				return $this->web_root_path . "/" . $target_path;
			}

		}
		return $target_path;

	}

}
