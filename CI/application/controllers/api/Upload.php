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
require APPPATH . '/libraries/MY_REST_Controller.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : 카페클래스 유저 정보를 조회,추가,삭제,변경하는 API 클래스.
*/

class Upload extends MY_REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Library Loaded from parent - MY_REST_Controller
        /*
        date_default_timezone_set('Asia/Seoul');
        $this->load->database();
        $this->load->library('MY_Error');
        $this->load->library('MY_Path');
        $this->load->library('MY_KeyValue');
        $this->load->library('MY_ParamChecker');
        $this->load->library('MY_Response');
        $this->load->library('MY_Time');
        $this->load->library('MY_Curl');
        $this->load->library('MY_ApiKey');
        $this->load->library('MY_Sql');
        $this->load->library('user_agent');
        $this->load->library('MY_Logger');
        */

        // Please add library you need here!
        // init MyThumbnail
        $this->load->library('MY_Thumbnail');
        // only for Upload api!
        $this->load->helper(array('form', 'url'));
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
        $config['allowed_types']        = 'gif|jpg|png|jpeg';
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

            $this->respond_200_Failed(
                // $msg=""
                "Uploading failed!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                array(
                    "error"=>$error
                )
            );
            return;            
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

        }
        else 
        {
            $this->respond_200_Failed(
                // $msg=""
                "uploaded_img_uri is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );
            return;            
        } // end if
        if(!empty($thumbnail))
        {
            // 섬네일 주소를 돌려줍니다.
            $output = ["thumbnail"=>$thumbnail];
            $this->respond_200($output);

            // TODO - Actio Log

        }
        else 
        {
            $this->respond_200_Failed(
                // $msg=""
                "thumbnail is not valid!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );
            return; 
        } // end if

    }
}
