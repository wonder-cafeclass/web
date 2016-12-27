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
    *   @ Desc : 이미지를 업로드할 때 사용합니다.
    */
    public function image_post()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        $min_width = 
        $this->my_paramchecker->post(
            // $key=""
            "min_width",
            // $key_filter=""
            "uploading_image_min_width"
        );
        $max_width = 
        $this->my_paramchecker->post(
            // $key=""
            "max_width",
            // $key_filter=""
            "uploading_image_max_width"
        );        
        $min_height = 
        $this->my_paramchecker->post(
            // $key=""
            "min_height",
            // $key_filter=""
            "uploading_image_min_height"
        );
        $max_height = 
        $this->my_paramchecker->post(
            // $key=""
            "max_height",
            // $key_filter=""
            "uploading_image_max_height"
        );
        $desired_width = 
        $this->my_paramchecker->post(
            // $key=""
            "desired_width",
            // $key_filter=""
            "uploading_image_desired_width"
        );
        $desired_height = 
        $this->my_paramchecker->post(
            // $key=""
            "desired_height",
            // $key_filter=""
            "uploading_image_desired_height",
            // $is_no_record=false
            true
        );
        if(empty($desired_height)) 
        {
            $desired_height = -1;
        }
        $image_file_size = 
        $this->my_paramchecker->post(
            // $key=""
            "image_file_size",
            // $key_filter=""
            "uploading_image_size"
        ); 
        $image_dir_dest = 
        $this->my_paramchecker->post(
            // $key=""
            "image_dir_dest",
            // $key_filter=""
            "uploading_image_dir_dest"
        ); 

        $image_file_size = intval($image_file_size);
        $desired_width = intval($desired_width);
        $desired_height = intval($desired_height);
        $min_width = intval($min_width);
        $max_width = intval($max_width);
        $min_height = intval($min_height);
        $max_height = intval($max_height);

        $params = array(
            "image_file_size"=>$image_file_size,
            "image_dir_dest"=>$image_dir_dest,
            "desired_width"=>$desired_width,
            "desired_height"=>$desired_height,
            "min_width"=>$min_width,
            "max_width"=>$max_width,
            "min_height"=>$min_height,
            "max_height"=>$max_height
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed()) 
        {
            $is_ok = false;
        }

        if(!$is_ok)
        {
            // 업로드 진행이 불가합니다.
            // Error Report
            // 실패!
            $this->respond_200_Failed(
                // $msg=""
                "Image Uploading failed!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );            
        } 
        else
        {
            // 업로드를 진행합니다.
            $config['upload_path']          = $this->my_path->get_path_download(__FILE__);
            $config['allowed_types']        = 'gif|jpg|png|jpeg';
            $config['max_size']             = $image_file_size; // kb?

            $config['min_width']            = $min_width;
            $config['min_height']           = $min_height;

            $config['max_width']            = $max_width;
            $config['max_height']           = $max_height;

        // $image_file_size = intval($image_file_size);
        // $desired_width = intval($desired_width);
        // $desired_height = intval($desired_height);
        // $min_width = intval($min_width);
        // $max_width = intval($max_width);
        // $min_height = intval($min_height);
        // $max_height = intval($max_height);

            
            $this->load->library('upload', $config);

            $uploaded_img_uri = "";
            $data = null;
            if ( ! $this->upload->do_upload('userfile'))
            {
                $error_data = array('error' => $this->upload->display_errors());

                $image_file_type_actual = $this->upload->data("image_type");
                $image_file_size_actual = intval($this->upload->data("file_size"));
                $image_file_width_actual = intval($this->upload->data("image_width"));
                $image_file_height_actual = intval($this->upload->data("image_height"));
                $image_file_valid_actual = $this->upload->data("is_image");

                $reason = "";
                if(!$image_file_valid_actual)
                {
                    $reason = "파일이 이미지가 아닙니다.";
                }
                else if($image_file_size_actual < 0) 
                {
                    $reason = "파일 크기가 0 kb 보다 작습니다.";
                } 
                else if($image_file_size < $image_file_size_actual)
                {
                    $reason = "파일 크기가 $image_file_size kb 보다 큽니다.";
                }
                else if($image_file_width_actual < $min_width)
                {
                    $reason = "파일 너비가 $min_width px 보다 작습니다.";
                }
                else if($max_width < $image_file_width_actual)
                {
                    $reason = "파일 너비가 $max_width px 보다 작습니다.";
                }
                else if($image_file_height_actual < $min_height)
                {
                    $reason = "파일 너비가 $min_height px 보다 작습니다.";
                }
                else if($max_height < $image_file_height_actual)
                {
                    $reason = "파일 너비가 $max_height px 보다 작습니다.";
                } // end if

                $error = [
                    "data"=>$this->upload->data(),
                    "reasone"=>$reason,
                    "file"=> [
                        "image_file_type_actual"=>$image_file_type_actual,
                        "image_file_size_actual"=>$image_file_size_actual,
                        "image_file_width_actual"=>$image_file_width_actual,
                        "image_file_height_actual"=>$image_file_height_actual,
                        "image_file_valid_actual"=>$image_file_valid_actual
                    ]
                ];

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
                    $output,
                    // $error=null
                    $reason,
                    // $extra=null
                    $error
                );
                return;            
            }
            else
            {
                $data = array('upload_data' => $this->upload->data());
                $uploaded_img_uri = $this->upload->data('full_path');

                // TEST
                $output["uploaded_img_uri"] = $uploaded_img_uri;
                $this->respond_200($output);

            } // end if

            $thumbnail = "";
            $result = null;
            if(!empty($uploaded_img_uri))
            {
                // 업로드가 완료되면, 섬네일로 바꾸는 작업을 진행합니다.
                $result = 
                $this->my_thumbnail->resize_width_height(
                    // $src="", 
                    $uploaded_img_uri,
                    // $dest="", 
                    $image_dir_dest,
                    // $desired_width=-1, 
                    $desired_width,
                    // $desired_height=-1
                    $desired_height
                );

                $thumbnail = $result->thumbnail;

                // 섬네일 저장 주소를 덧붙입니다.
                // 이 주소를 view에서 사용할 경우, 바로 이미지가 로딩될 수 있는 주소입니다.
                $thumbnail = $this->my_path->get_path_user_thumb_loadable($thumbnail);

            }
            $output["result"] = $result;

            if( isset($result["success"]) && 
                ($result["success"] === true) &&
                !empty($result["thumbnail"]) ) 
            {
                // 업로드 완료되었습니다.
                $output["thumbnail"] = $result["thumbnail"];
                $this->respond_200($output);
            }
            else 
            {
                // 업로드 실패했습니다.
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

        } // end if

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

        // $config['min_width']            = 150; // 최소 150px 이상이어야 합니다.
        // $config['min_height']           = 150;  

        $config['min_width']            = 50; // 최소 50px 이상이어야 합니다.
        $config['min_height']           = 50;

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
