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
	private $http_host="";
	private $req_uri="";

    private $path_download="assets/images/download";
    private $path_thumbnail_user="assets/images/user";
    private $path_thumbnail_class_banner="assets/images/class/banner";
    private $path_thumbnail_class_poster="assets/images/class/poster";
    private $path_user_validation="login/signup/validation";

    public function __construct($params=null)
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

        $target_path = $this->get_path_download(__FILE__);
        if(!is_writable($target_path))
        {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_DIR_PATH_IS_NOT_WRITABLE,
                // $message=""
                $target_path, 
                // $extra=null
                null
            );
            return;
        }

        $target_path = $this->get_path_user_thumb(__FILE__);
        if(!is_writable($target_path))
        {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_DIR_PATH_IS_NOT_WRITABLE,
                // $message=""
                $target_path, 
                // $extra=null
                null
            );
            return;
        }        

    	$abs_path = $_SERVER['DOCUMENT_ROOT'];
        $path_info = $_SERVER['PATH_INFO'];
        $this->http_host = $_SERVER['HTTP_HOST'];
        $this->req_uri = $req_uri = $_SERVER['REQUEST_URI'];

        // remove query string
        $result = explode("?",$req_uri);
        if(empty($result)) 
        {
        	return;
        }
        $req_uri = $result[0];

        $this->web_root_path = str_replace("/CI/index.php$path_info","",$req_uri);
	}	

	// Get the full URL of the current page
	// ex) http://devcafeclass.co.uk/cafeclass/CI/index.php/api/kakao/auth
	public function current_page_url(){
	    $page_url   = 'http';
	    if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on'){
	        $page_url .= 's';
	    }
	    return $page_url.'://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
	}	

	// ex) http://devcafeclass.co.uk
	private function current_http_referer(){
	    $page_url   = 'http';
	    if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on'){
	        $page_url .= 's';
	    }
	    return $page_url.'://'.$_SERVER['SERVER_NAME'];
	}	


	public function get_path_web_root() 
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

    public function get_path_user_validation()
    {
        return $this->get_path_full("/#/" . $this->path_user_validation);
    }

	public function get_path_full($target_path="")
	{
		if(empty($target_path)) 
		{
			return "";
		}

		return $this->current_http_referer() . $this->get($target_path);
	}

    public function get_path_download($cur_class_path="") 
    {
    	if(empty($cur_class_path))
    	{
    		return "";
    	}

        $string = $cur_class_path;
        $pattern = '/(.+\/)CI\/.+/i';
        $replacement = '${1}' . $this->path_download;
        $thumb_dir_path = preg_replace($pattern, $replacement, $string);

        return $thumb_dir_path;
    }

    public function get_path_img_dir($cur_class_path="", $dest_dir="") 
    {
        if(empty($cur_class_path))
        {
            return "";
        }
        if(empty($dest_dir))
        {
            return "";
        }

        $string = $cur_class_path;
        $pattern = '/(.+\/)CI\/.+/i';
        $replacement = '${1}' . $dest_dir;
        $thumb_dir_path = preg_replace($pattern, $replacement, $string);

        return $thumb_dir_path;

    }

    public function get_loadable_url_class_poster($poster="") 
    {
        if(empty($poster))
        {
            return "";
        }

        return $this->path_thumbnail_class_poster . "/" . $poster;
    }     

    public function get_path_class_poster($cur_class_path="") 
    {
        if(empty($cur_class_path))
        {
            return "";
        }

        $string = $cur_class_path;
        $pattern = '/(.+\/)CI\/.+/i';
        $replacement = '${1}' . $this->path_thumbnail_class_poster;
        $thumb_dir_path = preg_replace($pattern, $replacement, $string);

        return $thumb_dir_path;
    }    

    public function get_path_class_banner($cur_class_path="") 
    {
        if(empty($cur_class_path))
        {
            return "";
        }

        $string = $cur_class_path;
        $pattern = '/(.+\/)CI\/.+/i';
        $replacement = '${1}' . $this->path_thumbnail_class_banner;
        $thumb_dir_path = preg_replace($pattern, $replacement, $string);

        return $thumb_dir_path;
    }    

    public function get_path_user_thumb($cur_class_path="") 
    {
    	if(empty($cur_class_path))
    	{
    		return "";
    	}

        $string = $cur_class_path;
        $pattern = '/(.+\/)CI\/.+/i';
        $replacement = '${1}' . $this->path_thumbnail_user;
        $thumb_dir_path = preg_replace($pattern, $replacement, $string);

        return $thumb_dir_path;
    }

    public function get_path_user_thumb_loadable($thumbnail="") 
    {
        if(empty($thumbnail))
        {
            return "";
        }
        return $this->path_thumbnail_user . "/" . $thumbnail;
    }
}
