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

        // init error logger
        $this->load->library('MY_Error');

        // init path util
        $this->load->library('MY_Path');
        
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
        $output["is_admin"] = $this->my_auth->is_admin();
        $this->respond_200($output);

        // REMOVE ME
        /*
        $is_ok = true;
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
        */
    } 

    public function checker_get() {
        if($this->is_not_ok()) {
            return;
        }
        
        $output = array();
        $output["checker_map"] = $this->my_paramchecker->get_checker_map();
        $output["const_map"] = $this->my_paramchecker->get_const_map();
        $output["dirty_word_list"] = $this->my_paramchecker->get_dirty_word_list();
        $output["api_key"] = $this->my_paramchecker->get_api_key();

        $this->respond_200($output);
    } 


    /*
    *   @ Desc : 서버 내부 에러 응답 객체를 만드는 helper method
    */
    public function respond_500($msg="")
    {
        if(empty($msg)) 
        {
            return;
        }

        if(method_exists($this, 'set_response') && isset($this->my_response))
        {
            $this->set_response(
                // $response_body
                $this->my_response->getResBodyFailMsg($msg),
                // status code
                REST_Controller::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    } 

    /*
    *   @ Desc : 서버 내부 200 정상 응답 객체를 만드는 helper method
    */
    public function respond_200($data=null)
    {
        if(is_null($data)) 
        {
            return;
        }

        if(method_exists($this, 'set_response') && isset($this->my_response))
        {
            $response_body = $this->my_response->getResBodySuccessData($data);
            $this->set_response($response_body, REST_Controller::HTTP_OK);
        }
    } 

}
