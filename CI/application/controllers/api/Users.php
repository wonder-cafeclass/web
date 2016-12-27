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

class Users extends MY_REST_Controller {

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

    public function mobile_post()
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

        $mobile = "$mobile_head-$mobile_body-$mobile_tail";

        $output = [];
        $user = $this->my_sql->get_user_by_mobile($mobile);

        $output["user"] = $user;
        $output["mobile"] = $mobile;
        $this->respond_200($output);
    }    

    public function facebook_get()
    {
        if($this->is_not_ok())
        {
            return;
        }

        $facebook_id = $this->my_paramchecker->get('q','facebook_id');

        $output = [];
        $user = null;
        if(!empty($facebook_id)) 
        {
            $user = $this->my_sql->get_user_facebook($facebook_id);
        }

        $output["user"] = $user;
        $output["facebook_id"] = $facebook_id;
        $this->respond_200($output);
    }

    public function naver_get()
    {
        if($this->is_not_ok())
        {
            return;
        }

        $naver_id = $this->my_paramchecker->get('q','naver_id');
        $naver_id_num = intval($naver_id);

        $output = [];
        $user = null;
        if(!empty($naver_id) && (0 < $naver_id_num)) 
        {
            $user = $this->my_sql->get_user_naver($naver_id);
        }

        $output["user"] = $user;
        $output["naver_id"] = $naver_id;
        $this->respond_200($output);
    }

    public function kakao_get()
    {
        if($this->is_not_ok())
        {
            return;
        }

        $kakao_id = $this->my_paramchecker->get('q','kakao_id');
        $kakao_id_num = intval($kakao_id);

        $output = [];
        $user = null;
        if(!empty($kakao_id) && (0 < $kakao_id_num)) 
        {
            $user = $this->my_sql->get_user_kakao($kakao_id_num);
        }

        $output["user"] = $user;
        $output["kakao_id"] = $kakao_id;
        $this->respond_200($output);
    }    

    public function list_get()
    {
        if($this->is_not_ok())
        {
            return;
        }

        // TEST - PHPUnit test로 검증해야 함!
        $check_result = $this->my_paramchecker->is_ok("user_id", 0);

        // Users from a data store e.g. database
        $query = $this->db->query('SELECT id, name FROM z_test_user');
        $users = $query->result();

        if (!empty($users))
        {
            // TODO response body 만들어주는 custom helper 만들기.
            $response_body = [
                'status' => TRUE,
                'message' => 'Success',
                'check_result' => $check_result,
                'data' => $users
            ];

            // OK (200) being the HTTP response code
            $this->set_response($response_body, REST_Controller::HTTP_OK); 
        }
        else
        {
            // TODO response body 만들어주는 custom helper 만들기.
            $response_body = [
                'status' => FALSE,
                'message' => 'User could not be found',
                'check_result' => $check_result,
                'data' => $users
            ];

            // NOT_FOUND (404) being the HTTP response code
            $this->set_response($response_body, REST_Controller::HTTP_NOT_FOUND); 
        }
    }

    // @ Desc : 비밀 번호를 해싱해서 돌려줍니다.
    public function hash_get()
    {
        if($this->is_not_ok())
        {
            return;
        }

        $password = 
        $this->my_paramchecker->post(
            // $key=""
            "password",
            // $key_filter=""
            "user_password"
        );

        $output = array();

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        $$password_hashed = "";
        if($is_ok) {
            // INSERT
            // $password_hashed = $this->getHash($password);
            $password_hashed = $this->my_auth->getHash($password);
        }

        $output["password_hashed"] = $$password_hashed;

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
        // Email
        $email = 
        $this->my_paramchecker->post(
            // $key=""
            "email",
            // $key_filter=""
            "user_email_insert"
        );
        // @ Required
        // Password
        $password = 
        $this->my_paramchecker->post(
            // $key=""
            "password",
            // $key_filter=""
            "user_password"
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

            // 1. 플랫폼(카카오, 페이스북, 네이버)으로 로그인, 추가 정보를 등록하는 경우.

            // 2. 최초 등록일 경우.

            // 유저 정보를 추가합니다.
            // 회원 정보는 메일 인증이 필요하므로, 유저 상태를 C로 등록합니다.
            $this->my_sql->insert_user(
                // $password_hashed=""
                // $this->getHash($password),
                $this->my_auth->getHash($password),
                // $email=""
                $email,
                // $name=""
                $name,
                // $nickname=""
                $nickname,
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

            // 등록한 유저 정보를 가져옵니다.
            $user = $this->my_sql->get_user_by_email($email);
            $output["user"] = $user;
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

    public function updatemutables_post()
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

        $email = 
        $this->my_paramchecker->post(
            // $key=""
            "email",
            // $key_filter=""
            "user_email"
        );
        $name = 
        $this->my_paramchecker->post(
            // $key=""
            "name",
            // $key_filter=""
            "user_name"
        );
        $nickname = 
        $this->my_paramchecker->post(
            // $key=""
            "nickname",
            // $key_filter=""
            "user_nickname"
        );
        $gender = 
        $this->my_paramchecker->post(
            // $key=""
            "gender",
            // $key_filter=""
            "user_gender"
        );
        $birth_year = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_year",
            // $key_filter=""
            "user_birth_year"
        );
        $birth_month = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_month",
            // $key_filter=""
            "user_birth_month"
        );
        $birth_day = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_day",
            // $key_filter=""
            "user_birth_day"
        );
        $thumbnail = 
        $this->my_paramchecker->post(
            // $key=""
            "thumbnail",
            // $key_filter=""
            "user_thumbnail"
        );
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

        $params = array(
            "email"=>$email,
            "name"=>$name,
            "nickname"=>$nickname,
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
            $this->my_sql->update_user_mutables_by_email(
                // $email=""
                $email,
                // $name=""
                $name,
                // $nickname=""
                $nickname,
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

            // 등록한 유저 정보를 가져옵니다.
            $user = $this->my_sql->get_user_by_email($email);
            $output["user"] = $user;
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

        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        $email = 
        $this->my_paramchecker->post(
            // $key=""
            "email",
            // $key_filter=""
            "user_email"
        );
        $password = 
        $this->my_paramchecker->post(
            // $key=""
            "password",
            // $key_filter=""
            "user_password"
        );
        $name = 
        $this->my_paramchecker->post(
            // $key=""
            "name",
            // $key_filter=""
            "user_name"
        );
        $nickname = 
        $this->my_paramchecker->post(
            // $key=""
            "nickname",
            // $key_filter=""
            "user_nickname"
        );
        $gender = 
        $this->my_paramchecker->post(
            // $key=""
            "gender",
            // $key_filter=""
            "user_gender"
        );
        $birth_year = 
        $this->my_paramchecker->post(
            // $key=""
            "birth_year",
            // $key_filter=""
            "user_birth_year",
            // $is_no_record=false
            true
        );
        if(empty($birth_year)) 
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
        if(empty($birth_month)) 
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
        if(empty($birth_day)) 
        {
            $birth_day = "";
        }
        $thumbnail = 
        $this->my_paramchecker->post(
            // $key=""
            "thumbnail",
            // $key_filter=""
            "user_thumbnail"
        );
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

        $params = array(
            "user_id"=>$user_id,
            "email"=>$email,
            "password"=>$password,
            "name"=>$name,
            "nickname"=>$nickname,
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

            // 1. 플랫폼(카카오, 페이스북, 네이버)으로 로그인, 추가 정보를 등록하는 경우.

            // 2. 최초 등록일 경우.

            // 유저 정보를 추가합니다.
            // 회원 정보는 메일 인증이 필요하므로, 유저 상태를 C로 등록합니다.
            $this->my_sql->update_user(
                // $user_id=-1
                $user_id,
                // $password_hashed=""
                // $this->getHash($password),
                $this->my_auth->getHash($password),
                // $email=""
                $email,
                // $name=""
                $name,
                // $nickname=""
                $nickname,
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

            // 등록한 유저 정보를 가져옵니다.
            $user = $this->my_sql->get_user_by_email($email);
            $output["success"] = true;
            $output["user"] = $user;
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

    /*
    *   @ Desc : 비밀번호를 업데이트합니다.
    *
    */
    public function updatepw_post()
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

        $email = 
        $this->my_paramchecker->post(
            // $key=""
            "email",
            // $key_filter=""
            "user_email"
        );
        $password = 
        $this->my_paramchecker->post(
            // $key=""
            "password",
            // $key_filter=""
            "user_password"
        );

        $params = array(
            "email"=>$email,
            "password"=>$password
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

            // 유저 비밀번호를 변경합니다.
            // 회원 정보는 메일 인증이 필요하므로, 유저 상태를 C로 등록합니다.
            $password_hashed = $this->my_auth->getHash($password);
            $this->my_sql->update_user_pw(
                // $email=""
                $email,
                // $password_hashed=""
                $password_hashed
            ); // end insert

            // 새로 등록한 비밀번호를 검증합니다.
            // 사용자가 입력한 패스워드와 해싱되어 저장된 패스워드를 비교합니다.
            $password_hashed_from_db = $this->my_sql->get_user_password_by_email($email);
            $is_valid_password = false;
            if(!empty($password_hashed)) 
            {
                $is_valid_password = password_verify($password, $password_hashed_from_db);
            } // end if

            if($is_valid_password) {

                $user = $this->my_sql->get_user_by_email($email);
                $output["is_valid_password"] = $is_valid_password;
                $output["user"] = $user;

                // 비밀번호 변경에 성공했습니다. 로거에 기록합니다.
                $this->my_logger->add_action(
                    // $user_id=-1
                    intval($user->id),
                    // $action_type=""
                    $this->my_logger->ACTION_TYPE_MY_SETTING,
                    // $action_key=""
                    $this->my_logger->ACTION_KEY_UPDATE_PASSWORD
                );

                $this->respond_200($output);
                return;

            } else {
                $is_ok = false;
            } // end inner if
        } // end outer if

        if(!$is_ok)
        {
            // 실패!
            $this->respond_200_Failed(
                // $msg=""
                "User password update failed!",
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

    /*
    *   @ Desc : 유저가 회원인증링크를 클릭했을 때, 호출합니다. 회원 인증을 완료합니다.
    */
    public function confirmvalidation_post()
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

        $key = 
        $this->my_paramchecker->post(
            // $key=""
            "key",
            // $key_filter=""
            "user_validation_key"
        );

        $user_validation = $this->my_sql->select_user_validation_key_by_key($key);
        // DEBUG
        $output["user_validation"] = $user_validation;

        $key_from_db = "";
        if(isset($user_validation) && isset($user_validation->key)) 
        {
            $key_from_db = $user_validation->key;
        } 
        else 
        {
            // 1. 검사해야할 유저 인증 정보가 없는 경우, 하지만 검사를 마친 유저 인증 정보는 있음.
            $user_validation = $this->my_sql->select_user_validation_key_by_key($key, "C");
            if(isset($user_validation) && isset($user_validation->key)) 
            {
                // 1-1. 이미 인증 프로세스를 마친 경우.

                // 변경된 회원 정보를 가져옵니다.
                $user = $this->my_sql->get_user_by_id($user_validation->user_id);
                $output["user"] = $user;

                $output["user_validation"] = $user_validation;
                $output["is_confirmed"] = true;
                $output["is_attack"] = false;
                $this->respond_200($output);
                return;
            } 
            else 
            {
                // 1-2. 인증 정보가 이전에 등록되어 있지 않은 경우. 공격을 의심. 로거에 등록.
                $output["user_validation"] = $user_validation;
                $output["is_confirmed"] = false;
                $output["is_attack"] = true;

                $this->respond_200_Failed(
                    // $msg=""
                    "Detected not allowed access to validation check : $key",
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
        $is_confirmed = false;
        if(!empty($key_from_db) && $key === $key_from_db) 
        {
            $is_confirmed = true;
        }
        if($is_confirmed) 
        {
            // 회원 인증이 완료되었습니다.
            // 1. 회원 인증 상태 변경 / 2. 회원 상태 변경
            $this->my_sql->update_user_validation_confirmed($user_validation->user_id, $key);

            // DEBUG
            // 변경된 회원 인증 정보를 가져옵니다.
            $user_validation = $this->my_sql->select_user_validation_key_by_key($key, "C");
            $output["user_validation"] = $user_validation;

            // 변경된 회원 정보를 가져옵니다.
            $user = $this->my_sql->get_user_by_id($user_validation->user_id);
            $output["user"] = $user;

            // 로그인 쿠키를 만듭니다.
            $key_user_login = $this->my_cookie->set_user_login($user_validation->user_id);
            $cookie_user_login = $this->my_cookie->get_user_login();
            $output["cookie_user_login"] = $cookie_user_login;
            $output["cookie_reason"] = $this->my_cookie->get_reason();
        }
        // DEBUG
        $output["is_confirmed"] = $is_confirmed;
        $output["is_attack"] = false;

        $this->respond_200($output);
    }

    /*
    *   @ Desc : 유저가 카카오로 로그인을 정상적으로 마친 뒤, 해당 kakaoid로 등록된 유저가 있는지 확인합니다. 
    *   등록된 유저가 있다면, 로그인 쿠키를 만듭니다.
    */
    public function confirmkakao_post() 
    {
        if($this->is_not_ok())
        {
            return;
        }

        // REFACTOR ME
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

        $kakao_id = 
        $this->my_paramchecker->post(
            // $key=""
            "kakao_id",
            // $key_filter=""
            "kakao_id"
        );
        if(empty($kakao_id)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "kakao_id is not valid!",
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
        
        $user = $this->my_sql->get_user_kakao(intval($kakao_id)); 
        if(isset($user)) 
        {
            $output["success"] = true;

            // 인증에 성공했습니다. 로거에 기록합니다.
            $this->my_logger->add_action(
                // $user_id=-1
                intval($user->id),
                // $action_type=""
                $this->my_logger->ACTION_TYPE_LOGIN_PASSED,
                // $action_key=""
                $this->my_logger->ACTION_KEY_LOGIN_KAKAO
            );

            // 로그인 쿠키를 만듭니다.
            $this->my_cookie->set_user_login($user->id);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                "User is not valid!",
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
        $output["kakao_id"] = $kakao_id;

        $this->respond_200($output);

    } 

    /*
    *   @ Desc : 유저가 facebook으로 로그인을 정상적으로 마친 뒤, 해당 facebook id로 등록된 유저가 있는지 확인합니다. 
    *   등록된 유저가 있다면, 로그인 쿠키를 만듭니다.
    */
    public function confirmfacebook_post() 
    {
        if($this->is_not_ok())
        {
            return;
        }

        // REFACTOR ME
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

        $facebook_id = 
        $this->my_paramchecker->post(
            // $key=""
            "facebook_id",
            // $key_filter=""
            "facebook_id"
        );
        if(empty($facebook_id)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "Facebook_id is not valid!",
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
        
        $user = $this->my_sql->get_user_facebook(intval($facebook_id)); 
        if(isset($user)) 
        {
            $output["success"] = true;

            // 인증에 성공했습니다. 로거에 기록합니다.
            $this->my_logger->add_action(
                // $user_id=-1
                intval($user->id),
                // $action_type=""
                $this->my_logger->ACTION_TYPE_LOGIN_PASSED,
                // $action_key=""
                $this->my_logger->ACTION_KEY_LOGIN_FACEBOOK
            );

            // 로그인 쿠키를 만듭니다.
            $this->my_cookie->set_user_login($user->id);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                "User is not valid!",
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
        $output["facebook_id"] = $facebook_id;

        $this->respond_200($output);

    }

    /*
    *   @ Desc : 유저가 naver으로 로그인을 정상적으로 마친 뒤, 해당 naver id로 등록된 유저가 있는지 확인합니다. 
    *   등록된 유저가 있다면, 로그인 쿠키를 만듭니다.
    */
    public function confirmnaver_post() 
    {
        if($this->is_not_ok())
        {
            return;
        }

        // REFACTOR ME
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

        $naver_id = 
        $this->my_paramchecker->post(
            // $key=""
            "naver_id",
            // $key_filter=""
            "naver_id"
        );
        if(empty($naver_id)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "Naver_id is not valid!",
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
        
        $user = $this->my_sql->get_user_naver(intval($naver_id)); 
        if(isset($user)) 
        {
            $output["success"] = true;

            // 인증에 성공했습니다. 로거에 기록합니다.
            $this->my_logger->add_action(
                // $user_id=-1
                intval($user->id),
                // $action_type=""
                $this->my_logger->ACTION_TYPE_LOGIN_PASSED,
                // $action_key=""
                $this->my_logger->ACTION_KEY_LOGIN_NAVER
            );

            // 로그인 쿠키를 만듭니다.
            $this->my_cookie->set_user_login($user->id);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                "User is not valid!",
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
        $output["naver_id"] = $naver_id;

        $this->respond_200($output);

    }            

    /*
    *   @ Desc : 유저가 로그인 화면에서 이메일과 비밀번호 입력뒤, '로그인'을 클릭했을 때, 호출합니다. 회원 확인이 되면, 쿠키를 만듭니다.
    */
    public function confirm_post() 
    {
        if($this->is_not_ok())
        {
            return;
        }

        // REFACTOR ME
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

        $email = 
        $this->my_paramchecker->post(
            // $key=""
            "email",
            // $key_filter=""
            "user_email"
        );
        if(empty($email)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "Email is not valid!",
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

        // email로 password를 가져옵니다.
        $password_hashed = $this->my_sql->get_user_password_by_email($email);
        if(empty($password_hashed)) {
            $this->respond_200_Failed(
                // $msg=""
                "User is not valid!",
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

        $password = 
        $this->my_paramchecker->post(
            // $key=""
            "password",
            // $key_filter=""
            "user_password"
        );
        if(empty($password)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "Password is not valid!",
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

        // 사용자가 입력한 패스워드와 해싱되어 저장된 패스워드를 비교합니다.
        $is_valid_password = false;
        if(!empty($password_hashed)) 
        {
            $is_valid_password = password_verify($password, $password_hashed);
        }
        if(!$is_valid_password)
        {
            $this->respond_200_Failed(
                // $msg=""
                "Password verify failed!",
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

        // 이메일과 해싱한 패스워드로 유저 정보를 조회합니다.
        $user = $this->my_sql->get_user_by_email($email);
        if(isset($user)) 
        {
            $output["success"] = true;

            // 인증에 성공했습니다. 로거에 기록합니다.
            $this->my_logger->add_action(
                // $user_id=-1
                intval($user->id),
                // $action_type=""
                $this->my_logger->ACTION_TYPE_LOGIN_PASSED,
                // $action_key=""
                $this->my_logger->ACTION_KEY_LOGIN
            );

            // 로그인 쿠키를 만듭니다.
            $this->my_cookie->set_user_login($user->id);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                "User is not valid!",
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
        $output["email"] = $email;
        $output["password"] = $password;
        $output["user"] = $user;

        $this->respond_200($output);
    }

    /*
    *   @ Desc : 유저가 로그인시 등록한 쿠키를 가져옵니다.
    */
    public function cookie_post()
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

        $output["cookie_user_login_value"] = $this->my_cookie->get_user_login_cookie();

        $cookie_user_login = $this->my_cookie->get_user_login();
        $output["cookie_user_login"] = $cookie_user_login;

        $output["last_query"] = $this->my_sql->get_last_query();

        $user_id = -1;
        if(isset($cookie_user_login) && isset($cookie_user_login->user_id)) 
        {
            $user_id = intval($cookie_user_login->user_id);
        }
        if(0 < $user_id) 
        {
            $user = $this->my_sql->get_user_by_id($user_id);
            $output["user"] = $user;
        }

        $this->respond_200($output);
    }

    /*
    *   @ Desc : 등록한 유저에게 인증 메일을 발송합니다.
    */
    public function validation_post()
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

        $email = 
        $this->my_paramchecker->post(
            // $key=""
            "email",
            // $key_filter=""
            "user_email"
        );
        $output["email"] = $email;

        $user = $this->my_sql->get_user_by_email($email);
        if(is_null($user)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "user is not valid!",
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

        $password_hashed = $this->my_sql->get_user_password_by_email($email);
        if(is_null($password_hashed)) 
        {
            $this->respond_200_Failed(
                // $msg=""
                "password_hashed is not valid!",
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

        // 인증키 만들기 - DB에 저장.
        $time_now = $this->my_time->get_now_YYYYMMDDHHMMSSU();
        $key_hashed = $this->my_auth->getHashQueryStringSafe($password_hashed . $time_now);

        $output["key_hashed"] = $key_hashed;

        $this->my_sql->insert_user_validation_key(
            // $user_id=-1
            $user->id,
            // $key=""
            $key_hashed
        );
        $user_validation_key = 
        $this->my_sql->select_user_validation_key_by_user_id(
            // $user_id=-1
            $user->id
        );
        $output["user_validation_key"] = $user_validation_key;

        // 인증키가 포함된 링크주소 만들기.
        // 인증키를 확인할 페이지 만들기.
        $path_user_validation = $this->my_path->get_path_user_validation();
        $path_user_validation = $path_user_validation . "?key=" . $user_validation_key->key;
        $output["path_user_validation"] = $path_user_validation;

        $this->email->from('info@cafeclass.kr', '카페클래스');
        $this->email->to($email);
        // $this->email->cc('another@another-example.com');
        // $this->email->bcc('them@their-example.com');

        $this->email->subject('Email Test');
        $this->email->message($path_user_validation);

        $this->email->send();

        // 메일 발송을 기록합니다. 로거에 기록합니다.
        $this->my_logger->add_action(
            // $user_id=-1
            intval($user->id),
            // $action_type=""
            $this->my_logger->ACTION_TYPE_SIGN_UP,
            // $action_key=""
            $this->my_logger->ACTION_KEY_SEND_AUTH_MAIL
        );

        $this->respond_200($output);
    }

    public function logout_get()
    {
        if($this->is_not_ok())
        {
            return;
        }

        // cookie에 등록된 유저 정보를 가져옵니다.
        $cookie_user_login = $this->my_cookie->get_user_login();
        $cookie_user_id = -1;
        if(isset($cookie_user_login) && isset($cookie_user_login->user_id)) 
        {
            $cookie_user_id = intval($cookie_user_login->user_id);
        }

        // 브라우저 cookie에 등록된 정보를 삭제합니다.
        $this->my_cookie->delete_user_login();
        // DB에 등록된 유저의 모든 cookie 정보를 삭제합니다.
        if(0 < $cookie_user_id) {
            $this->my_sql->delete_user_cookie($cookie_user_id);
        }

        $output["success"] = true;
        $this->respond_200($output);
    }
}
