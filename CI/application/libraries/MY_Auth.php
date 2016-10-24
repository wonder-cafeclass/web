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

}