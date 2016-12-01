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
            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);
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
        if( isset($check_list) && 
            isset($check_list->fail) && 
            (0 < count($check_list->fail))) 
        {
            $output["check_list"] = $check_list;
            $is_ok = false;
        }
        $$password_hashed = "";
        if($is_ok) {
            // INSERT
            $password_hashed = $this->getHash($password);
        }

        $output["password_hashed"] = $$password_hashed;

        $this->respond_200($output);
    }

    /*
    *   @ Desc : GET 형식의 url에 query string 파라미터로 전달해도 문제없는 hashkey를 만듭니다. 
    *   query string의 파라미터인 경우, '.'로 끝나면 링크에 포함되지 않는 문제가 있습니다.
    *   그러므로 영문 대소문자,숫자,$기호까지만 포함합니다.
    *
    *   @ Warning : 해시값의 일부분을 강제로 수정해서 사용하므로 password_verify는 불가능합니다.
    */
    private function getHashQueryStringSafe($value) {
        if($this->is_not_ok())
        {
            return "";
        }

        if(empty($value)) 
        {
            return "";
        }

        $hashkey = $this->getHash($value);
        $matches = array();
        preg_match_all('/[a-zA-Z0-9\$]+/', $hashkey, $matches);

        $hashkeySafe = "";
        if(!empty($matches) && !empty($matches[0])) 
        {
            $hashkeySafe = join("",$matches[0]);
        }
        return $hashkeySafe;
    }

    // @ Referer : http://php.net/manual/kr/function.password-hash.php
    private function getHash($value="")
    {
        if($this->is_not_ok())
        {
            return "";
        }

        if(empty($value)) {
            return "";
        }
        return password_hash($value, PASSWORD_DEFAULT);
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
            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);
            return;
        }

        $email = 
        $this->my_paramchecker->post(
            // $key=""
            "email",
            // $key_filter=""
            "user_email_insert"
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

        // CHECK LIST
        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        if( isset($check_list) && 
            isset($check_list->fail) && 
            (0 < count($check_list->fail))) 
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
                $this->getHash($password),
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
        }

        $this->respond_200($output);
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
            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);
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
        if( isset($check_list) && 
            isset($check_list->fail) && 
            (0 < count($check_list->fail))) 
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
                $this->getHash($password),
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
        }

        $this->respond_200($output);
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
            // 1-2. apikey 있지 않은 경우. 공격을 의심. 로거에 등록.
            $api_key_from_request = $this->my_paramchecker->get_api_key_from_request();
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_ALLOWED_ACCESS_404,
                // $error_msg=""
                "Detected not allowed access to validation check : $api_key_from_request"
            );

            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);
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
                $this->my_logger->add_error(
                    // $user_id=-1
                    -1,
                    // $error_type=""
                    $this->my_logger->ERROR_NOT_ALLOWED_ACCESS_404,
                    // $error_msg=""
                    "Detected not allowed access to validation check : $key"
                );

                $output["user_validation"] = $user_validation;
                $output["is_confirmed"] = false;
                $output["is_attack"] = true;
                $this->respond_200($output);
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
            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);

            // api key가 없습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_ALLOWED_ACCESS_404,
                // $error_msg=""
                "Detected not allowed access to confirmkakao_post"
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
            $output["success"] = false;
            $output["kakao_id"] = $kakao_id;
            $output["reason"] = "kakao_id is not valid!";
            $this->respond_200($output);

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected not valid kakao_id to confirmkakao_post"
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
            $output["success"] = false;

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected unknown fail to confirmkakao_post / $kakao_id"
            );

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
            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);

            // api key가 없습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_ALLOWED_ACCESS_404,
                // $error_msg=""
                "Detected not allowed access to confirmkakao_post"
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
            $output["success"] = false;
            $output["facebook_id"] = $facebook_id;
            $output["reason"] = "facebook_id is not valid!";
            $this->respond_200($output);

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected not valid facebook_id to confirmkakao_post"
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
            $output["success"] = false;

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected unknown fail to confirmkakao_post / $facebook_id"
            );

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
            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);

            // api key가 없습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_ALLOWED_ACCESS_404,
                // $error_msg=""
                "Detected not allowed access to confirmkakao_post"
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
            $output["success"] = false;
            $output["naver_id"] = $naver_id;
            $output["reason"] = "naver_id is not valid!";
            $this->respond_200($output);

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected not valid naver_id to confirmkakao_post"
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
            $output["success"] = false;

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected unknown fail to confirmkakao_post / $naver_id"
            );
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
            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);

            // api key가 없습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_ALLOWED_ACCESS_404,
                // $error_msg=""
                "Detected not allowed access to confirm_post"
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
            $output["success"] = false;
            $output["email"] = $email;
            $output["reason"] = "email is not valid!";
            $this->respond_200($output);

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected not valid email to confirm_post"
            );

            return;
        }

        // email로 password를 가져옵니다.
        $password_hashed = $this->my_sql->get_user_password_by_email($email);
        if(empty($password_hashed)) {
            $output["success"] = false;
            $output["email"] = $email;
            $output["reason"] = "user is not valid!";
            $this->respond_200($output);

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected not valid password_hashed to confirm_post"
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
            $output["success"] = false;
            $output["email"] = $email;
            $output["password"] = $password;
            $output["reason"] = "password is not valid!";
            $this->respond_200($output);

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected not valid password to confirm_post"
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
            $output["success"] = false;
            $output["email"] = $email;
            $output["password"] = $password;
            $output["reason"] = "password is not valid!";
            $this->respond_200($output);

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected password is not matching to confirm_post / $email"
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
            $output["success"] = false;

            // 인증에 실패했습니다. 로거에 기록합니다.
            $this->my_logger->add_error(
                // $user_id=-1
                -1,
                // $error_type=""
                $this->my_logger->ERROR_NOT_VALID_USER_AUTH,
                // $error_msg=""
                "Detected unknown fail to confirm_post / $email"
            );

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
            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);
            return;
        }

        $cookie_user_login = $this->my_cookie->get_user_login();
        $output["cookie_user_login"] = $cookie_user_login;

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
            $output["is_not_allowed_api_call"] = $is_not_allowed_api_call;
            $this->respond_200($output);
            return;
        }

        $email = 
        $this->my_paramchecker->post(
            // $key=""
            "email",
            // $key_filter=""
            "user_email"
        );

        $user = $this->my_sql->get_user_by_email($email);
        if(is_null($user)) 
        {
            $output["success"] = false;
            $output["reason"] = "email is not valid!";
            $output["email"] = $email;
            $this->respond_200($output);
            return;
        }
        $output["user"] = $user;

        // 인증키 만들기 - DB에 저장.
        $password_hashed = $user->password;
        $time_now = $this->my_time->get_now_YYYYMMDDHHMMSSU();

        $key_hashed = $this->getHashQueryStringSafe($password_hashed . $time_now);

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


    // Example - Legacy
    /*
    public function insert_post() {

        // TODO 지정된 파라미터만 통과, json으로 파라미터 validation 하도록 변경. 
        $name = $this->post('name');
        $name_escaped = $this->db->escape($name);

        // TODO - 입력하는 문자열 검증 필요.
        if(empty($name_escaped)) {

            $response_body = [
                'status' => FALSE,
                'message' => '!empty(\$name_escaped)',
                'data' => null
            ];
            
        } else {

            // TODO - 쿼리 빌더 사용해보기.
            $this->db->query("INSERT INTO `z_test_user`(`name`) VALUES (" . $name_escaped . ")");

            $query = $this->db->query("SELECT id, name FROM z_test_user WHERE name=" . $name_escaped);
            $user_inserted = $query->result();

            $response_body = [
                'status' => TRUE,
                'message' => 'Success',
                'data' => $user_inserted
            ];

        }

        // OK (200) being the HTTP response code
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    public function update_get($id=0) {

        $response_body = [
            'status' => TRUE,
            'message' => 'TEST',
            'data' => null
        ];

        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    public function update_post($id=0) {

        $name = $this->post('name');
        // 문자열인 경우는 아래 절차를 반드시 거쳐야 함.
        $name_escaped = $this->db->escape($name);


        if((0 < $id) && !empty($name_escaped)) {

            // 유효한 이름값을 넘겨주었다면 업데이트를 진행합니다.
            $query = $this->db->query("SELECT id, name FROM z_test_user WHERE id=" . $id);
            $user = $query->result();

            $error = null;
            if ( is_null($error) && ! $this->db->simple_query("UPDATE z_test_user SET `name`=" . $name_escaped . " WHERE `id`=" . $id))
            {
                $error = $this->db->error(); // Has keys 'code' and 'message'
            }

            $query = $this->db->query("SELECT id, name FROM z_test_user WHERE id=" . $id);
            $user_modified = $query->result();

            // 이전 객체, 이후 객체 비교.
            $data = [
                "user" => $user,
                "user_modified" => $user_modified,
                "id" => $id,
                "name" => $name
            ];

            if(!is_null($error)) {

                $response_body = [
                    'status' => FALSE,
                    'message' => 'Success',
                    'error' => $error,
                    'data' => $data
                ];

            } else {

                $response_body = [
                    'status' => TRUE,
                    'message' => 'Success',
                    'data' => $data
                ];

            }

        } else {

            // 업데이트할 정보가 유효하지 않습니다. 실행을 중단합니다.
            $data = [
                "id" => $id,
                "name" => $name
            ];

            $response_body = [
                'status' => TRUE,
                'message' => 'param is not valid!',
                'data' => $data
            ];
            
        }

        // OK (200) being the HTTP response code
        $this->set_response($response_body, REST_Controller::HTTP_OK);

        // DB 쿼리가 잘못된 경우라면 어떻게? - simple_query
        // DB가 내려간 상태라면?
        // 그밖에는?

    }

    public function delete_post($id=0) {

        // $id = $this->post('id');
        $id = intval($id);

        if(0 < $id) {

            // TODO - 쿼리 빌더 사용해보기.
            $this->db->query("DELETE FROM `z_test_user` WHERE id=" . $id);

            $response_body = [
                'status' => TRUE,
                'message' => 'Success',
                'query' => $this->db->last_query(), // DEBUGGING 모드일때만 제공되는 파라미터
                'data' => null
            ];

            $this->set_response($response_body, REST_Controller::HTTP_OK);
            
        } else {

            $response_body = [
                'status' => FALSE,
                'message' => '\$id is not valid!',
                'query' => $this->db->last_query(), // DEBUGGING 모드일때만 제공되는 파라미터
                'data' => null
            ];

            $this->set_response($response_body, REST_Controller::HTTP_OK);

        }

    }
    */
   
}
