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
        // ...
    }

    public function email_get()
    {
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

    public function list_get()
    {
        // TEST - PHPUnit test로 검증해야 함! wonder.jung
        $check_result = $this->my_paramchecker->is_ok("user_id", 0);

        // Users from a data store e.g. database
        $query = $this->db->query('SELECT id, name FROM z_test_user');
        $users = $query->result();

        if (!empty($users))
        {
            // TODO response body 만들어주는 custom helper 만들기. - wonder.jung
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
            // TODO response body 만들어주는 custom helper 만들기. - wonder.jung
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

    // @ Referer : http://php.net/manual/kr/function.password-hash.php
    private function getHash($value="")
    {
        if(empty($value)) {
            return "";
        }
        return password_hash($value, PASSWORD_DEFAULT);
    }

    public function add_post()
    {
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

        $output = array();






        // PARAM - ECHO
        /*
        $output["password"] = $password;
        $output["email"] = $email;
        $output["name"] = $name;
        $output["nickname"] = $nickname;
        $output["gender"] = $gender;
        $output["birth_year"] = $birth_year;
        $output["birth_month"] = $birth_month;
        $output["birth_day"] = $birth_day;
        $output["thumbnail"] = $thumbnail;
        $output["mobile_head"] = $mobile_head;
        $output["mobile_body"] = $mobile_body;
        $output["mobile_tail"] = $mobile_tail;
        */

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

    // Example - Legacy
    /*
    public function insert_post() {

        // TODO 지정된 파라미터만 통과, json으로 파라미터 validation 하도록 변경. 
        $name = $this->post('name');
        $name_escaped = $this->db->escape($name);

        // TODO - 입력하는 문자열 검증 필요. wonder.jung
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

        // wonder.jung

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
