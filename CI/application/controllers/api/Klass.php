<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';
require APPPATH . '/models/CClass.php';
require APPPATH . '/models/KlassKeyword.php';
require APPPATH . '/models/KlassLevel.php';
require APPPATH . '/models/KlassStation.php';
require APPPATH . '/models/KlassDay.php';
require APPPATH . '/models/KlassTime.php';
require APPPATH . '/models/SelectTile.php';

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
class Klass extends REST_Controller {

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
        $this->load->library('MY_ParamChecker');

        // init MyReponse
        $this->load->library('MY_Response');
            
        // Set time zone as Seoul
        date_default_timezone_set('Asia/Seoul');
    }

    public function list_get()
    {
        // TEST - PHPUnit test로 검증해야 함! wonder.jung
        // $check_result = $this->my_paramchecker->is_ok("user_id", 0);

        // var req_url = `level=${klassLevel}&station=${subwayStation}&day=${klassDay}&time=${klassTime}`;

        $where_conditions = array();

        $level = $this->get('level');
        $level = $this->db->escape($level);
        if($level !== "NULL" && !empty($level)) 
        {
            $where_conditions['level'] = $level;
        }

        $station = $this->get('station');
        $station = $this->db->escape($station);
        if($station !== "NULL" && !empty($station)) 
        {
            $where_conditions['venue_subway_station'] = $station;
        }

        $day = $this->get('day');
        $day = $this->db->escape($day);
        if($day !== "NULL" && !empty($day)) 
        {
            $where_conditions['days'] = $day;
        }

        $time = $this->get('time');
        $time = $this->db->escape($time);
        if($time !== "NULL" && !empty($time)) 
        {
            // keyword를 이용, 검색할 수 있는 숫자값으로 변경한다.
            $where_conditions['time_begin'] = $time;
        }

        // Sample - WHERE
        if(!empty($where_conditions)) {
            $limit = 500;
            $offset = 0;
            $query = $this->db->get_where('cclass', $where_conditions, $limit, $offset);
            $query = $this->db->query($query);
        } else {
            $query = $this->db->query('SELECT * FROM cclass');            
        }

        // TODO - param 유효성 검사를 진행합니다.

        $classes = $query->result();

        $rows = $query->custom_result_object('CClass');

        $output = array();
        foreach ($rows as $row)
        {
            // 추가할 정보들을 넣는다.
            $row->time_begin_img_url($this->my_paramchecker->get_const_map());
            $row->level_img_url($this->my_paramchecker->get_const_map());
            $row->days_img_url($this->my_paramchecker->get_const_map());
            $row->venue_subway_station_img_url($this->my_paramchecker->get_const_map());
            $row->venue_cafe_logo_img_url($this->my_paramchecker->get_const_map());
            $row->price_with_format();
            $row->weeks_to_months();
            
            array_push($output, $row);
        }        

        if (!empty($classes))
        {
            // TODO response body 만들어주는 custom helper 만들기. - wonder.jung
            $response_body = $this->my_response->getResBodySuccess($query, $output);

            // OK (200) being the HTTP response code
            $this->set_response($response_body, REST_Controller::HTTP_OK); 
        }
        else
        {
            // TODO response body 만들어주는 custom helper 만들기. - wonder.jung
            $response_body = $this->my_response->getResBodyFail('Klass could not be found', $query, $output);

            // NOT_FOUND (404) being the HTTP response code
            $this->set_response($response_body, REST_Controller::HTTP_NOT_FOUND); 
        }
    }

    public function search_get() {

        $q = $this->my_paramchecker->get('q','klass_query');
        $level = $this->my_paramchecker->get('level','klass_level');
        $station = $this->my_paramchecker->get('level','klass_station');
        $day = $this->my_paramchecker->get('day','klass_day');
        $time = $this->my_paramchecker->get('time','klass_time');
        $check_list = $this->my_paramchecker->get_check_list();
        $query="";

        // TEST
        $response_body = 
        $this->my_response->getResBodySuccess(
            // $query="", 
            $query, 
            // $data=null, 
            null,
            // $check_list=null, 
            $check_list,
            // $extra=null
            null
        );

        // OK (200) being the HTTP response code
        $this->set_response($response_body, REST_Controller::HTTP_OK);
        
    }

    public function selectile_get() {

        $result = array();

        // $result["selectile_masks"] = $this->get_selectile_mask();
        $result["levels"] = $this->get_levels();
        $result["stations"] = $this->get_stations();
        $result["days"] = $this->get_days();
        $result["times"] = $this->get_times();

        $response_body = [
            'status' => TRUE,
            'message' => 'Success',
            'data' => $result
        ];
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    private function get_levels() {

        $const_map = $this->my_paramchecker->get_const_map();

        $class_level_list = $const_map->class_level_list;
        $class_level_eng_list = $const_map->class_level_eng_list;
        $class_level_kor_list = $const_map->class_level_kor_list;
        $class_level_img_url_list = $const_map->class_level_img_url_list;

        // check list is valid
        $is_valid = true;
        if(count($class_level_list) !== count($class_level_eng_list)) {
            $is_valid = false;
        } else if(count($class_level_list) !== count($class_level_kor_list)) {
            $is_valid = false;
        } else if(count($class_level_list) !== count($class_level_img_url_list)) {
            $is_valid = false;
        }
        $klass_level_list = array();
        if(!$is_valid) {
            return $klass_level_list;
        }
        
        for ($i=0; $i < count($class_level_list); $i++) { 

            $key = $class_level_list[$i];
            $name_eng = $class_level_eng_list[$i];
            $name_kor = $class_level_kor_list[$i];
            $img_url = $class_level_img_url_list[$i];

            $level_obj = new KlassLevel($key, $name_eng, $name_kor, $img_url);

            array_push($klass_level_list, $level_obj);

        }  
        
        return $klass_level_list;    
    }
    public function level_get() {

        $obj_list = $this->get_levels();

        $response_body = [
            'status' => TRUE,
            'message' => 'Success',
            'data' => $obj_list
        ];
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }

    private function get_stations() {
        $const_map = $this->my_paramchecker->get_const_map();

        $subway_station_list = 
        $const_map->class_venue_subway_station_list;
        $subway_station_eng_list = 
        $const_map->class_venue_subway_station_eng_list;
        $subway_station_kor_list = 
        $const_map->class_venue_subway_station_kor_list;
        $subway_station_img_url_list = 
        $const_map->class_venue_subway_station_img_url_list;

        // check list is valid
        $is_valid = true;
        if(count($subway_station_list) !== count($subway_station_eng_list)) 
        {
            $is_valid = false;
        }
        if(count($subway_station_list) !== count($subway_station_kor_list)) 
        {
            $is_valid = false;
        }
        if(count($subway_station_list) !== count($subway_station_img_url_list)) 
        {
            $is_valid = false;
        }

        $klass_station_list = array();
        if(!$is_valid) 
        {
            return $klass_station_list;
        }
        
        for ($i=0; $i < count($subway_station_list); $i++) 
        { 

            $key = $subway_station_list[$i];
            $name_eng = $subway_station_eng_list[$i];
            $name_kor = $subway_station_kor_list[$i];
            $img_url = $subway_station_img_url_list[$i];

            $station_obj = new KlassStation($key, $name_eng, $name_kor, $img_url);

            array_push($klass_station_list, $station_obj);

        }

        return $klass_station_list;       
    }
    public function station_get() {

        $obj_list = $this->get_stations();

        $response_body = 
        [
            'status' => TRUE,
            'message' => 'Success',
            'data' => $obj_list
        ];
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    }  

    private function get_days() {
        $const_map = $this->my_paramchecker->get_const_map();

        $class_days_list = $const_map->class_days_list;
        $class_days_eng_list = $const_map->class_days_eng_list;
        $class_days_kor_list = $const_map->class_days_kor_list;
        $class_days_img_url_list = $const_map->class_days_img_url_list;

        // check list is valid
        $is_valid = true;
        if(count($class_days_list) !== count($class_days_eng_list)) 
        {
            $is_valid = false;
        }
        else if(count($class_days_list) !== count($class_days_kor_list)) 
        {
            $is_valid = false;
        }
        else if(count($class_days_list) !== count($class_days_img_url_list)) 
        {
            $is_valid = false;
        }
        $klass_day_list = array();
        if(!$is_valid) 
        {
            return $klass_day_list;
        }
        
        for ($i=0; $i < count($class_days_list); $i++) { 

            $key = $class_days_list[$i];
            $name_eng = $class_days_eng_list[$i];
            $name_kor = $class_days_kor_list[$i];
            $img_url = $class_days_img_url_list[$i];

            $day_obj = new KlassDay($key, $name_eng, $name_kor, $img_url);

            array_push($klass_day_list, $day_obj);

        }  

        return $klass_day_list;
    }
    public function day_get() 
    {
        $obj_list = $this->get_days();

        $response_body = [
            'status' => TRUE,
            'message' => 'Success',
            'data' => $obj_list
        ];
        $this->set_response($response_body, REST_Controller::HTTP_OK);

    } 

    private function get_times() {
        $const_map = $this->my_paramchecker->get_const_map();

        $klass_times_list = $const_map->class_times_list;
        $klass_times_eng_list = $const_map->class_times_eng_list;
        $klass_times_kor_list = $const_map->class_times_kor_list;
        $klass_times_img_url_list = $const_map->class_times_img_url_list;

        // check list is valid
        $is_valid = true;
        if(count($klass_times_list) !== count($klass_times_img_url_list)) 
        {
            $is_valid = false;
        }
        $klass_time_list = array();
        if(!$is_valid) 
        {
            // 클래스 레벨의 배열이 길이가 다릅니다. 실행을 중단합니다.
            return $klass_time_list;
        }
        
        for ($i=0; $i < count($klass_times_list); $i++) 
        {
            $key = $klass_times_list[$i];
            $name_eng = $klass_times_eng_list[$i];
            $name_kor = $klass_times_kor_list[$i];
            $img_url = $klass_times_img_url_list[$i];

            $time_obj = new KlassTime($key, $name_eng, $name_kor, $img_url);

            array_push($klass_time_list, $time_obj);
        }

        return $klass_time_list;
    }
    public function time_get() 
    {

        $obj_list = $this->get_times();

        $response_body = 
        [
            'status' => TRUE,
            'message' => 'Success',
            'data' => $obj_list
        ];
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
