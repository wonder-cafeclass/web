<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';
require APPPATH . '/models/CClass.php';
require APPPATH . '/models/KlassKeyword.php';

/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Classes extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['list_get']['limit'] = 500; // 500 requests per hour per user/key

        // init database
        $this->load->database();

        // init param checker
        $this->load->library('paramChecker');
            
        // Set time zone as Seoul
        date_default_timezone_set('Asia/Seoul');
    }

    public function list_get()
    {
        // TEST - PHPUnit test로 검증해야 함! wonder.jung
        // $check_result = $this->paramchecker->is_ok("user_id", 0);

        // Classes from a data store e.g. database
        $query = $this->db->query('SELECT `id`,`title`,`desc`,`date_begin`,`time_begin`,`time_duration_minutes`,`time_end`,`level`,`week_min`,`week_max`,`days`,`class_per_week`,`venue`,`venue_subway_station`,`venue_cafe`,`venue_map_link`,`status`,`tags`,`price`,`class_img_url`,`date_created`,`date_updated` FROM cclass');
        $classes = $query->result();

        $rows = $query->custom_result_object('CClass');

        $output = array();
        foreach ($rows as $row)
        {
            // 추가할 정보들을 넣는다.
            $row->time_begin_img_url($this->paramchecker->get_const_map());
            $row->level_img_url($this->paramchecker->get_const_map());
            $row->days_img_url($this->paramchecker->get_const_map());
            $row->venue_subway_station_img_url($this->paramchecker->get_const_map());
            $row->venue_cafe_logo_img_url($this->paramchecker->get_const_map());
            $row->price_with_format();
            $row->weeks_to_months();
            
            array_push($output, $row);
        }        

        if (!empty($classes))
        {
            // TODO response body 만들어주는 custom helper 만들기. - wonder.jung
            $response_body = [
                'status' => TRUE,
                'message' => 'Success',
                'data' => $output
            ];

            // OK (200) being the HTTP response code
            $this->set_response($response_body, REST_Controller::HTTP_OK); 
        }
        else
        {
            // TODO response body 만들어주는 custom helper 만들기. - wonder.jung
            $response_body = [
                'status' => FALSE,
                'message' => 'Class could not be found',
                'data' => $classes
            ];

            // NOT_FOUND (404) being the HTTP response code
            $this->set_response($response_body, REST_Controller::HTTP_NOT_FOUND); 
        }
    }

    public function search_get() {
        
        $q = $this->get('q');

        $keyword_obj = new KlassKeyword(1, $q, $q);

        $response_body = [
            'status' => TRUE,
            'message' => 'Success',
            'data' => array($keyword_obj,$keyword_obj)
        ];

        // OK (200) being the HTTP response code
        $this->set_response($response_body, REST_Controller::HTTP_OK);
        
    }

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
}