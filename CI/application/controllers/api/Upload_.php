<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/*
    !Caution/주의!

    require APPPATH . '${your-class-path}';
    ...
    $this->load->library(${your-class-path});

    // 위의 경우처럼 2번 동일한 클래스를 호출하게 되면 $this->${your-class-path} 의 경우, null을 돌려주게 됩니다.

*/ 
require APPPATH . '/libraries/REST_Controller.php';
require APPPATH . '/libraries/MY_Class.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : View에서 업로드하는 파일을 받는 클래스.
*/
class Upload_ extends REST_Controller implements MY_Class{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        // $this->methods['list_get']['limit'] = 500; // 500 requests per hour per user/key

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

        // init MyTime
        $this->load->library('MY_Time');

        // init MyCurl
        $this->load->library('MY_Curl');

        // init MyAPIKey
        $this->load->library('MY_ApiKey');

        // init MySql
        $this->load->library('MY_Sql');

        // init UserAgent
        $this->load->library('user_agent');

        // init MyLogger
        $this->load->library('MY_Logger');

        // init MyThumbnail
        $this->load->library('MY_Thumbnail');

        // only for Upload api!
        $this->load->helper(array('form', 'url'));
    }

    // @ Required : MyClass interface
    public function is_not_ok() {
        return !$this->is_ok();
    }

    // @ Required : MyClass interface
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

    /*
    *   @ Desc : 주소를 직접 호출했을 때 보여주는 에러 페이지.
    */
    public function index()
    {
        $this->load->view('upload_form', array('error' => ' ' ));
    }

    /*
    *   @ Desc : 사용자의 프로필 이미지를 업로드할 때 사용합니다.
    */
    public function userprofile_post()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        $config['upload_path']          = $this->my_path->get_path_download(__FILE__);
        $config['allowed_types']        = 'gif|jpg|png';
        $config['max_size']             = 100; // kb?

        $config['min_width']            = 150; // 최소 150px 이상이어야 합니다.
        $config['min_height']           = 150;  

        $config['max_width']            = 1024;
        $config['max_height']           = 768;
        
        $this->load->library('upload', $config);

        $uploaded_img_uri = "";
        $data = null;
        if ( ! $this->upload->do_upload('userfile'))
        {
            $error = array('error' => $this->upload->display_errors());
            $this->respond_500("Upload Failed! - 1", $error);
            // $this->load->view('upload_form', $error);
        }
        else
        {
            $data = array('upload_data' => $this->upload->data());
            $uploaded_img_uri = $this->upload->data('full_path');

            // TEST
            $output = ["uploaded_img_uri"=>$uploaded_img_uri];
            $this->respond_200($output);

        } // end if

        $thumbnail = "";
        if(!empty($uploaded_img_uri))
        {
            // 업로드가 완료되면, 섬네일로 바꾸는 작업을 진행합니다.
            $thumbnail = $this->my_thumbnail->resize_user_thumbnail($uploaded_img_uri);

            // 섬네일 저장 주소를 덧붙입니다.
            // 이 주소를 view에서 사용할 경우, 바로 이미지가 로딩될 수 있는 주소입니다.
            $thumbnail = $this->my_path->get_path_user_thumb_loadable($thumbnail);

            /*
            $file_name = $this->my_thumbnail->get_file_name_from_uri($uploaded_img_uri);
            $file_path = $this->my_path->get_path_user_thumb(__FILE__) . "/" . $file_name;

            $output = 
            $this->my_thumbnail->resize(
                // $src="", 
                $uploaded_img_uri,
                // $dest="", 
                $file_path,
                // $crop_size=-1
                150
            );
            if(isset($output) && isset($output->success) && $output->success) 
            {
                $thumbnail = $file_name;
            }
            */
        }
        else 
        {
            $this->respond_500("Upload Failed! - 2");
        } // end if
        if(!empty($thumbnail))
        {
            // 섬네일 주소를 돌려줍니다.
            $output = ["thumbnail"=>$thumbnail];
            $this->respond_200($output);
        }
        else 
        {
            $this->respond_500("Upload Failed! - 3");   
        } // end if

    }

    /*
    *   @ Desc : 서버 내부 에러 응답 객체를 만드는 helper method
    */
    public function respond_500($msg="", $data=null)
    {
        if(empty($msg)) 
        {
            return;
        }

        if(method_exists($this, 'set_response') && isset($this->my_response))
        {
            $response_body = null;
            if(isset($data))
            {
                $response_body = $this->my_response->getResBodyFailMsgData($msg, $data);
            }
            else 
            {
                $response_body = $this->my_response->getResBodyFailMsg($msg);
            }

            $this->set_response(
                // $response_body
                $response_body,
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