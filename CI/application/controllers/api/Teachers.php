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

class Teachers extends MY_REST_Controller {

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
        $this->load->library('email');

        $this->load->library('MY_Cookie');

        $this->load->library('MY_Auth');
    }

    public function email_get()
    {
        if($this->is_not_ok())
        {
            return;
        }

        $email = $this->my_paramchecker->get('q','user_email');

        $output = [];
        $user = null;
        if(!empty($email)) 
        {
            $user = $this->my_sql->get_user_by_email($email);
        }

        $output["user"] = $user;
        $output["email"] = $email;
        $this->respond_200($output);
    }

    public function add_post()
    {
        if($this->is_not_ok())
        {
            return;
        }

        $output = array();
        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->respond_200_Failed(
                // $msg=""
                "Not allowed api call",
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
        }

        // @ Required
        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        // @ Required
        $email = 
        $this->my_paramchecker->post(
            // $key=""
            "email",
            // $key_filter=""
            "user_email"
        );
        // @ Required
        // 전화번호        
        $mobile_head = 
        $this->my_paramchecker->post(
            // $key=""
            "mobile_head",
            // $key_filter=""
            "user_mobile_kor_head"
        );
        $mobile_body = 
        $this->my_paramchecker->post(
            // $key=""
            "mobile_body",
            // $key_filter=""
            "user_mobile_kor_body"
        );
        $mobile_tail = 
        $this->my_paramchecker->post(
            // $key=""
            "mobile_tail",
            // $key_filter=""
            "user_mobile_kor_tail"
        );
        // @ Required
        // gender        
        $gender = 
        $this->my_paramchecker->post(
            // $key=""
            "gender",
            // $key_filter=""
            "user_gender"
        );
        // @ Required
        // name
        $name = 
        $this->my_paramchecker->post(
            // $key=""
            "name",
            // $key_filter=""
            "user_name"
        );
        // @ Required
        // resume
        $resume = 
        $this->my_paramchecker->post(
            // $key=""
            "resume",
            // $key_filter=""
            "teacher_resume"
        );
        // greeting
        $greeting = 
        $this->my_paramchecker->post(
            // $key=""
            "greeting",
            // $key_filter=""
            "teacher_greeting"
        );


        // @ Optional
        // nickname
        $nickname = 
        $this->my_paramchecker->post(
            // $key=""
            "nickname",
            // $key_filter=""
            "user_nickname",
            // $is_no_record=false
            true
        );
        if(is_null($nickname)) 
        {
            $nickname = "";
        }
        // @ Optional
        // birthday
        $birth_year = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_year",
            // $key_filter=""
            "user_birth_year",
            // $is_no_record=false
            true
        );
        if(is_null($birth_year)) 
        {
            $birth_year = "";
        }
        $birth_month = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_month",
            // $key_filter=""
            "user_birth_month",
            // $is_no_record=false
            true
        );
        if(is_null($birth_month)) 
        {
            $birth_month = "";
        }
        $birth_day = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_day",
            // $key_filter=""
            "user_birth_day",
            // $is_no_record=false
            true            
        );
        if(is_null($birth_day)) 
        {
            $birth_day = "";
        }
        // @ Optional - 지정한 섬네일이 없다면, 기본 섬네일로 설정됨.
        // thumbnail
        $thumbnail = 
        $this->my_paramchecker->post(
            // $key=""
            "thumbnail",
            // $key_filter=""
            "user_thumbnail",
            // $is_no_record=false
            true            
        );
        if(is_null($thumbnail)) 
        {
            $thumbnail = "";
        }

        $params = array(
            "user_id"=>$user_id,
            "email"=>$email,
            "name"=>$name,
            "nickname"=>$nickname,
            "resume"=>$resume,
            "greeting"=>$greeting,
            "gender"=>$gender,
            "birth_year"=>$birth_year,
            "birth_month"=>$birth_month,
            "birth_day"=>$birth_day,
            "thumbnail"=>$thumbnail,
            "mobile_head"=>$mobile_head,
            "mobile_body"=>$mobile_body,
            "mobile_tail"=>$mobile_tail
        );
        $output["params"] = $params;        
        
        // CHECK LIST
        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $output["check_list"] = $check_list;
            $is_ok = false;
        }
        if($is_ok) {

            // 선생님 정보를 최초로 등록합니다.
            $this->my_sql->insert_teacher(
                // $user_id=-1
                $user_id,
                // $email=""
                $email,
                // $name=""
                $name,
                // $nickname=""
                $nickname,
                // $resume=""
                $resume,
                // $greeting=""
                $greeting,
                // $gender=""
                $gender,
                // $birth_year=""
                $birth_year,
                // $birth_month=""
                $birth_month,
                // $birth_day=""
                $birth_day,
                // $thumbnail=""
                $thumbnail,
                // $mobile_head=""
                $mobile_head,
                // $mobile_body=""
                $mobile_body,
                // $mobile_tail,=""
                $mobile_tail
            ); // end insert

            // 등록한 선생님 정보를 가져옵니다.
            $teacher = $this->my_sql->get_teacher_by_user_id($user_id);
            $output["teacher"] = $teacher;
            $this->respond_200($output);
        }
        else 
        {
            $this->respond_200_Failed(
                // $msg=""
                "User insertion failed!",
                // $function=""
                __FUNCTION__,
                // $file="" 
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );            
        } // end if
    }

    public function userid_post()
    {
        if($this->is_not_ok())
        {
            return;
        }

        $output = array();
        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->respond_200_Failed(
                // $msg=""
                "Not allowed api call",
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
        }

        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );        

        $params = array(
            "user_id"=>$user_id
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
        if($is_ok) {
            // 등록한 선생님 정보를 가져옵니다.
            $teacher = $this->my_sql->get_teacher_by_user_id($user_id);
            $output["teacher"] = $teacher;
            $this->respond_200($output);
        } 
        else 
        {
            // 실패!
            $this->respond_200_Failed(
                // $msg=""
                "Teacher select failed!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );
        } // end if
    }

    public function update_post()
    {
        if($this->is_not_ok())
        {
            return;
        }

        $output = array();
        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->respond_200_Failed(
                // $msg=""
                "Not allowed api call",
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
        }

        // @ Required
        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        // @ Required
        $resume = 
        $this->my_paramchecker->post(
            // $key=""
            "resume",
            // $key_filter=""
            "teacher_resume"
        );
        // @ Required
        $greeting = 
        $this->my_paramchecker->post(
            // $key=""
            "greeting",
            // $key_filter=""
            "teacher_greeting"
        );
        // @ Required
        $gender = 
        $this->my_paramchecker->post(
            // $key=""
            "gender",
            // $key_filter=""
            "user_gender"
        );
        // @ Required
        $mobile_head = 
        $this->my_paramchecker->post(
            // $key=""
            "mobile_head",
            // $key_filter=""
            "user_mobile_kor_head"
        );
        // @ Required
        $mobile_body = 
        $this->my_paramchecker->post(
            // $key=""
            "mobile_body",
            // $key_filter=""
            "user_mobile_kor_body"
        );
        // @ Required
        $mobile_tail = 
        $this->my_paramchecker->post(
            // $key=""
            "mobile_tail",
            // $key_filter=""
            "user_mobile_kor_tail"
        );



        // @ Optional
        $nickname = 
        $this->my_paramchecker->post(
            // $key=""
            "nickname",
            // $key_filter=""
            "user_nickname",
            // $is_no_record=false
            true
        );
        if(is_null($nickname)) 
        {
            $nickname = "";
        }
        // @ Optional
        $birth_year = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_year",
            // $key_filter=""
            "user_birth_year",
            // $is_no_record=false
            true
        );
        if(is_null($birth_year)) 
        {
            $birth_year = "";
        }
        // @ Optional
        $birth_month = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_month",
            // $key_filter=""
            "user_birth_month",
            // $is_no_record=false
            true
        );
        if(is_null($birth_month)) 
        {
            $birth_month = "";
        }
        // @ Optional
        $birth_day = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_day",
            // $key_filter=""
            "user_birth_day",
            // $is_no_record=false
            true            
        );
        if(is_null($birth_day)) 
        {
            $birth_day = "";
        }
        // @ Optional - 지정한 섬네일이 없다면, 기본 섬네일로 설정됨.
        $thumbnail = 
        $this->my_paramchecker->post(
            // $key=""
            "thumbnail",
            // $key_filter=""
            "user_thumbnail",
            // $is_no_record=false
            true            
        );
        if(is_null($thumbnail)) 
        {
            $thumbnail = "";
        }        

        $params = array(
            "user_id"=>$user_id,
            "nickname"=>$nickname,
            "resume"=>$resume,
            "greeting"=>$greeting,
            "gender"=>$gender,
            "birth_year"=>$birth_year,
            "birth_month"=>$birth_month,
            "birth_day"=>$birth_day,
            "thumbnail"=>$thumbnail,
            "mobile_head"=>$mobile_head,
            "mobile_body"=>$mobile_body,
            "mobile_tail"=>$mobile_tail
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
        if($is_ok) {

            // 1. 내정보 페이지에서 유저 정보를 바꿀경우.
            $this->my_sql->update_teacher(
                // $user_id=-1
                $user_id,
                // $nickname=""
                $nickname,
                // $resume=""
                $resume,
                // $greeting=""
                $greeting,
                // $gender=""
                $gender,
                // $birth_year=""
                $birth_year,
                // $birth_month=""
                $birth_month,
                // $birth_day=""
                $birth_day,
                // $thumbnail=""
                $thumbnail,
                // $mobile_head=""
                $mobile_head,
                // $mobile_body=""
                $mobile_body,
                // $mobile_tail,=""
                $mobile_tail
            ); // end insert

            // 등록한 선생님 정보를 가져옵니다.
            $teacher = $this->my_sql->get_teacher_by_user_id($user_id);
            $output["teacher"] = $teacher;
            $this->respond_200($output);

        } 
        else 
        {
            // 실패!
            $this->respond_200_Failed(
                // $msg=""
                "User update failed!",
                // $function=""
                __FUNCTION__,
                // $file=""
                __FILE__,
                // $line=""
                __LINE__,
                // $data=null
                $output
            );
        } // end if
        
    }    


}
