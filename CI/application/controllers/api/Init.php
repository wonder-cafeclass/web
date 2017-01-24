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

require_once APPPATH . '/libraries/MY_REST_Controller.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : 첫 랜딩페이지 로딩시 가져와야 할 정보를 한꺼번에 전달하는 용도.
*/

class Init extends MY_REST_Controller {

    private $api_post_access = "https://api.iamport.kr/users/getToken";
    private $api_get_payment = "https://api.iamport.kr/payments/{imp_uid}";
    private $api_post_cancel_payment = "https://api.iamport.kr/payments/cancel";



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
        $this->load->library('MY_Tracker');
        $this->load->library('MY_Pagination');
        */

        // Additional Library
        $this->load->library('MY_Auth');
        $this->load->library('MY_Cookie');
        $this->load->library('MY_Calendar');
        $this->load->library('MY_KlassCalendar', ['my_calendar'=>$this->my_calendar]);
        $this->load->library('MY_Decorator');
    }

    // @ Desc : 첫 화면에 필요한 모든 정보를 가져옵니다.
    public function fetchInit_post()
    {
        $output = [];
        $this->my_tracker->add_init(__CLASS__,__FUNCTION__,__LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__CLASS__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        // 1. auth
        $output["is_admin"] = $this->my_auth->is_admin();

        // 2. checker
        $output["checker_map"] = $this->my_paramchecker->get_checker_map();
        $output["const_map"] = $this->my_paramchecker->get_const_map();
        // $output["dirty_word_list"] = $this->my_paramchecker->get_dirty_word_list();
        $output["dirty_word_list"] = []; // 필요한가? - api call로 검사하는 것을 고려.
        $output["api_key"] = $this->my_paramchecker->get_api_key();

        // 3. user cookie
        $output["cookie_user_login_value"] = $this->my_cookie->get_user_login_cookie();

        $cookie_user_login = $this->my_cookie->get_user_login();
        $output["cookie_user_login"] = $cookie_user_login;

        $user_id = -1;
        $output["user"] = null;
        if(isset($cookie_user_login) && isset($cookie_user_login->user_id)) 
        {
            $user_id = intval($cookie_user_login->user_id);
        }
        if(0 < $user_id) 
        {
            $user = $this->my_sql->select_user_by_id($user_id);
            $output["user"] = $user;
        }

        // 유저가 로그인을 했다면, 그리고 선생님이라면 가져오는 리스트가 달라짐.
        // 4. klass list - klass.php->fetchklasslist_post
        /*
        $output = $this->fetchklasslist(
            // $login_user_id=-1, 
            $user_id,
            // $page_num=-1, 
            -1,
            // $page_row_cnt=-1, 
            -1,
            // $output=null
            $output
        );
        */    

        $this->respond_200_v2(__CLASS__,__FUNCTION__,__LINE__,$output);

    } // end method

    private function fetchklasslist($login_user_id=-1, $page_num=-1, $page_row_cnt=-1, $output=null) {

        if(is_null($output)) {
            $output = [];
        }

        // Pagination
        $page_num = 
        $this->my_paramchecker->post(
            // $key=""
            "page_num",
            // $key_filter=""
            "page_num",
            // $is_no_record=false
            true
        );
        if(empty($page_num)) {
            $page_num = 1;
        }

        $page_row_cnt = 
        $this->my_paramchecker->post(
            // $key=""
            "page_row_cnt",
            // $key_filter=""
            "page_row_cnt",
            // $is_no_record=false
            true
        );
        if(empty($page_row_cnt)) {
            $page_row_cnt = 10;
        } // end if 

        $limit = 
        $this->my_pagination->get_limit(
            // $page_num=-1, 
            $page_num,
            // $page_row_cnt=-1
            $page_row_cnt
        );
        $offset = 
        $this->my_pagination->get_offset(
            // $page_num=-1, 
            $page_num,
            // $page_row_cnt=-1
            $page_row_cnt
        ); 

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset
        ]; 

        $klass_status = "E";

        $klass_cnt = 
        $this->my_sql->select_klass_cnt_on_admin(
            // $search_query="", 
            "",
            // $klass_status="", 
            $klass_status,
            // $level="", 
            "",
            // $klass_subway_line="", 
            "",
            // $klass_subway_station="", 
            "",
            // $day="", 
            "",
            // $time=""
            ""
        );
        $output["klass_cnt"] = $klass_cnt;
        $pagination = 
        $this->my_pagination->get(
            // $total_row_cnt=-1, 
            $klass_cnt,
            // $cursor_page_num=-1, 
            $page_num,
            // $row_cnt_per_page=-1
            $page_row_cnt
        );
        $output["pagination"] = $pagination;

        // 검색어로 유저를 찾습니다.
        $klass_list =
        $this->my_sql->select_klass_on_admin(
            // $limit=-1, 
            $limit,
            // $offset=-1, 
            $offset,
            // $search_query="", 
            "",
            // $klass_status="", 
            $klass_status,
            // $level="", 
            "",
            // $klass_subway_line="", 
            "",
            // $klass_subway_station="", 
            "",
            // $day="", 
            "",
            // $time=""
            ""
        );


        $klass_list = $this->my_decorator->deco_klass_list($klass_list);
        // 비어있는 수업이라면 '수업 없음' 탭을 가져옵니다.
        if (empty($klass_list))
        {
            $this->my_tracker->add(__CLASS__, __FUNCTION__, __LINE__, "조회한 결과가 없는 경우, \"수업없음\" 클래스 정보를 내려준다.");
            $no_klass = 
            $this->my_decorator->get_klass_course_no_class();
            $klass_list = array();
            array_unshift($klass_list,$no_klass);
        } // end if

        // 해당 $login_user_id로 선생님 정보를 가져옵니다.
        $teacher = null;
        if(0 < $login_user_id) 
        {
            $teacher = $this->my_sql->select_teacher_by_user_id($login_user_id);
        } // end if
        if((1 === $page_num) && isset($teacher))
        {
            // 첫번째 페이지이면서 선생님일 경우, 새로운 클래스 만들기 탭을 가져옵니다.
            $new_klass = 
            $this->my_decorator->get_klass_course_new_class();
            // 새로운 클래스를 수업 리스트 가장 앞에 추가합니다.
            array_unshift($klass_list,$new_klass);
        } // end if
        
        $output["klass_list"] = $klass_list;

        return $output;
    }

}