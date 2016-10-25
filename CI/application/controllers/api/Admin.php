<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';
require APPPATH . '/libraries/MY_Class.php';

/**
 * Admin API
 *
 * @package         controllers
 * @subpackage      api
 * @category        Controller
 * @author          Wonder Jung
 * @license         MIT
 */
class Admin extends REST_Controller implements MY_Class{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Set time zone as Seoul
        date_default_timezone_set('Asia/Seoul');

        // init database
        $this->load->database();

        // init path util
        $this->load->library('MY_Path');

        // init error logger
        $this->load->library('MY_Error');

        // init param checker
        $this->load->library('MY_ParamChecker');

        // init MyReponse
        $this->load->library('MY_Response');

        // init Admin
        $this->load->library('MY_Auth');
    }

    public function is_not_ok() {
        return !$this->is_ok();
    }
    public function is_ok() {

        $is_ok = true;
        if($this->my_error->hasError()) {
            $response_body = 
            $this->my_response->getResBodyFail(
                // $message=""
                MY_Response::$EVENT_UNKNOWN_ERROR_OCCURED, 
                // $query="" 
                "", 
                // $data=null 
                null, 
                // $error=null 
                $this->my_error->get(),
                // $extra=null
                null
            );
            $this->set_response($response_body, REST_Controller::HTTP_OK); 
            $is_ok = false;
        }

        return $is_ok;
    }

    public function auth_get() {

        if($this->is_not_ok()) {
            return;
        }

        $output = array();
        $is_ok = true;

        $output["is_admin"] = $this->my_auth->is_admin();
        $response_body = 
        $this->my_response->getResBodySuccess(
            // $query="" 
            "", 
            // $data=null 
            $output, 
            // $error=null 
            $this->my_error->get(),
            // $extra=null
            null
        );

        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }    

}
