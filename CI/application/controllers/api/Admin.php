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
*   @ Desc : 카페클래스 운영자가 사용하는 API 클래스.
*/

class Admin extends MY_REST_Controller {

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

        // init Admin
        $this->load->library('MY_Auth');
        
        $this->load->library('MY_Decorator');
    }

    public function auth_get() 
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__,__FUNCTION__,__LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        }

        $output["is_admin"] = $this->my_auth->is_admin();

        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    } 

    public function checker_get() 
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        }
        
        $output = array();
        $output["checker_map"] = $this->my_paramchecker->get_checker_map();
        $output["const_map"] = $this->my_paramchecker->get_const_map();
        $output["dirty_word_list"] = $this->my_paramchecker->get_dirty_word_list();
        $output["api_key"] = $this->my_paramchecker->get_api_key();

        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);
    } // end method

    // @ Desc : 운영툴에서 수업 정보를 업데이트합니다.
    
    public function updateklass_post() 
    {
        
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        }

        
        $user_id_admin = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id_admin",
            // $key_filter=""
            "user_id"
        );
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_status = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_status",
            // $key_filter=""
            "klass_status"
        );

        $params = array(
            "user_id_admin"=>$user_id_admin,
            "klass_id"=>$klass_id,
            "klass_status"=>$klass_status
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"updateuser_post Failed!");
            return;
        } // end if       

        $is_ok = 
        $this->my_sql->update_klass_on_admin(
            // $user_id_admin=-1, 
            $user_id_admin,
            // $klass_id=-1, 
            $klass_id,
            // $klass_status="",
            $klass_status
        );
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "update_user_on_admin");
        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"updateuser_post Failed!");
            return;
        } // end if       

        // 변경된 수업 정보를 가져옵니다.
        $klass = $this->my_sql->select_klass($klass_id);
        $output["klass"] = $klass;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    } // end method  
 
    // @ Desc : 수업 리스트를 가져옵니다. 검색어, 권한, 상태등의 조회 조건을 줄수 있습니다.
    public function fetchklasslist_post() 
    {

        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {  
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
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

        // Where condition
        $search_query = 
        $this->my_paramchecker->post(
            // $key=""
            "search_query",
            // $key_filter=""
            "search_query",
            // $is_no_record=false
            true
        );

        $klass_status = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_status",
            // $key_filter=""
            "klass_status",
            // $is_no_record=false
            true
        );        

        $klass_level = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_level",
            // $key_filter=""
            "klass_level",
            // $is_no_record=false
            true
        );        

        $klass_subway_line = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_subway_line",
            // $key_filter=""
            "klass_subway_line",
            // $is_no_record=false
            true
        );       

        $klass_subway_station = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_subway_station",
            // $key_filter=""
            "klass_subway_station",
            // $is_no_record=false
            true
        );

        $klass_days = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_days",
            // $key_filter=""
            "klass_days_for_search",
            // $is_no_record=false
            true
        );        

        $klass_time = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_time",
            // $key_filter=""
            "klass_time",
            // $is_no_record=false
            true
        );        

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset,
            "search_query"=>$search_query,
            "klass_status"=>$klass_status,
            "klass_level"=>$klass_level,
            "klass_subway_line"=>$klass_subway_line,
            "klass_subway_station"=>$klass_subway_station,
            "klass_days"=>$klass_days,
            "klass_time"=>$klass_time
        ];
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "param checked");        

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchklasslist_post is failed!");
            return;
        } // end if

        // 검색어에 해당하는 전체 결과수를 가져옵니다.
        // 이 데이터로 pagination을 새로 만듭니다.
        $klass_cnt = 
        $this->my_sql->select_klass_cnt_on_admin(
            // $search_query="", 
            $search_query,
            // $klass_status="", 
            $klass_status,
            // $level="", 
            $klass_level,
            // $klass_subway_line="", 
            $klass_subway_line,
            // $klass_subway_station="", 
            $klass_subway_station,
            // $day="", 
            $klass_days,
            // $time=""
            $klass_time
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
            $search_query,
            // $klass_status="", 
            $klass_status,
            // $level="", 
            $klass_level,
            // $klass_subway_line="", 
            $klass_subway_line,
            // $klass_subway_station="", 
            $klass_subway_station,
            // $day="", 
            $klass_days,
            // $time=""
            $klass_time
        );

        $klass_list = $this->my_decorator->deco_klass_list($klass_list);
        
        $output["klass_list"] = $klass_list;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output); 
    }      

    // @ Desc : 운영툴에서 유저 정보를 업데이트합니다.
    public function updateteacher_post() 
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        }

        $user_id_admin = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id_admin",
            // $key_filter=""
            "user_id"
        );
        $teacher_id = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_id",
            // $key_filter=""
            "teacher_id"
        );
        $teacher_status = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_status",
            // $key_filter=""
            "teacher_status"
        );

        $params = array(
            "user_id_admin"=>$user_id_admin,
            "teacher_id"=>$teacher_id,
            "teacher_status"=>$teacher_status
        );
        $output["params"] = $params;
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "param checked");

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if($is_ok) {

            $is_ok = 
            $this->my_sql->update_teacher_on_admin(
                // $user_id_admin=-1, 
                $user_id_admin,
                // $teacher_id=-1, 
                $teacher_id,
                // $teacher_status="",
                $teacher_status
            );
            $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "update_user_on_admin");
        }
        else 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"updateuser_post Failed!");
            return;
        } // end if       

        // 변경된 유저 정보를 가져옵니다.
        $teacher = $this->my_sql->select_teacher($teacher_id);
        $output["teacher"] = $teacher;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    } // end method 

    // @ Desc : 유저 리스트를 가져옵니다. 검색어, 권한, 상태등의 조회 조건을 줄수 있습니다.
    public function fetchteacherlist_post() 
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {  
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
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

        // Where condition
        $search_query = 
        $this->my_paramchecker->post(
            // $key=""
            "search_query",
            // $key_filter=""
            "search_query",
            // $is_no_record=false
            true
        );

        $teacher_status = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_status",
            // $key_filter=""
            "teacher_status",
            // $is_no_record=false
            true
        );        

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset,
            "search_query"=>$search_query,
            "teacher_status"=>$user_status
        ];
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "param checked");        

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchteacherlist_post is failed!");
            return;
        } // end if

        // 검색어에 해당하는 전체 결과수를 가져옵니다.
        // 이 데이터로 pagination을 새로 만듭니다.
        $teacher_cnt = 
        $this->my_sql->select_teacher_cnt_on_admin(
            // $search_query="", 
            $search_query,
            // $teacher_status="", 
            $teacher_status
        );
        $output["teacher_cnt"] = $teacher_cnt;
        $pagination = 
        $this->my_pagination->get(
            // $total_row_cnt=-1, 
            $teacher_cnt,
            // $cursor_page_num=-1, 
            $page_num,
            // $row_cnt_per_page=-1
            $page_row_cnt
        );
        $output["pagination"] = $pagination;

        // 검색어로 유저를 찾습니다.
        $teacher_list =
        $this->my_sql->select_teacher_on_admin(
            // $search_query="", 
            $search_query,
            // $teacher_status="", 
            $teacher_status,
            // $limit=-1, 
            $limit,
            // $offset=-1
            $offset
        );
        $output["teacher_list"] = $teacher_list;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);        
    }      

    // @ Desc : 운영툴에서 유저 정보를 업데이트합니다.
    public function updateuser_post() 
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        }

        $user_id_admin = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id_admin",
            // $key_filter=""
            "user_id"
        );
        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        $user_status = 
        $this->my_paramchecker->post(
            // $key=""
            "user_status",
            // $key_filter=""
            "user_status"
        );
        $user_permission = 
        $this->my_paramchecker->post(
            // $key=""
            "user_permission",
            // $key_filter=""
            "user_permission"
        );

        $params = array(
            "user_id"=>$user_id,
            "user_status"=>$user_status,
            "user_permission"=>$user_permission
        );
        $output["params"] = $params;
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "param checked");

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if($is_ok) {

            $is_ok = 
            $this->my_sql->update_user_on_admin(
                // $user_id_admin=-1, 
                $user_id_admin,
                // $user_id=-1, 
                $user_id,
                // $status="",
                $user_status,
                // $permission=""
                $user_permission
            );
            $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "update_user_on_admin");
        }
        else 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"updateuser_post Failed!");
            return;
        } // end if       

        // 변경된 유저 정보를 가져옵니다.
        $user = $this->my_sql->select_user_by_id($user_id);
        $output["user"] = $user;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    } // end method

    // @ Desc : 유저 리스트를 가져옵니다. 검색어, 권한, 상태등의 조회 조건을 줄수 있습니다.
    public function fetchuserlist_post() 
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {  
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
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

        // Where condition
        $search_query = 
        $this->my_paramchecker->post(
            // $key=""
            "search_query",
            // $key_filter=""
            "search_query",
            // $is_no_record=false
            true
        );

        $user_status = 
        $this->my_paramchecker->post(
            // $key=""
            "user_status",
            // $key_filter=""
            "user_status",
            // $is_no_record=false
            true
        );        

        $user_permission = 
        $this->my_paramchecker->post(
            // $key=""
            "user_permission",
            // $key_filter=""
            "user_permission",
            // $is_no_record=false
            true
        );

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset,
            "search_query"=>$search_query,
            "user_status"=>$user_status,
            "user_permission"=>$user_permission
        ];
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "param checked");        

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchuserlist_post is failed!");
            return;
        } // end if

        // 검색어에 해당하는 전체 결과수를 가져옵니다.
        // 이 데이터로 pagination을 새로 만듭니다.
        $user_student_cnt = 
        $this->my_sql->select_user_cnt_on_admin(
            // $search_query="", 
            $search_query,
            // $user_status="", 
            $user_status,
            // $user_permission=""
            $user_permission
        );
        $output["user_student_cnt"] = $user_student_cnt;
        $pagination = 
        $this->my_pagination->get(
            // $total_row_cnt=-1, 
            $user_student_cnt,
            // $cursor_page_num=-1, 
            $page_num,
            // $row_cnt_per_page=-1
            $page_row_cnt
        );
        $output["pagination"] = $pagination;

        // 검색어로 유저를 찾습니다.
        $user_list =
        $this->my_sql->select_user_on_admin(
            // $search_query="", 
            $search_query,
            // $user_status="", 
            $user_status,
            // $user_permission="", 
            $user_permission,
            // $limit=-1, 
            $limit,
            // $offset=-1
            $offset
        );
        $output["user_list"] = $user_list;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);        
    }

    // @ Desc : Import의 Payment 리스트를 가져옵니다.
    public function fetchbuyklass_post()
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {  
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        } // end if

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

        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id",
            // $is_no_record=false
            true
        );        

        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id",
            // $is_no_record=false
            true
        );

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset,
            "user_id"=>$user_id,
            "klass_id"=>$klass_id
        ];
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "param checked");        

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"paymentipmlist_post is failed!");
            return;
        } // end if

        // 검색어에 해당하는 전체 결과수를 가져옵니다.
        // 이 데이터로 pagination을 새로 만듭니다.
        $total_cnt = 
        $this->my_sql->select_payment_import_cnt(
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1
            $user_id
        );
        $output["total_cnt"] = $total_cnt;
        $pagination = 
        $this->my_pagination->get(
            // $total_row_cnt=-1, 
            $total_cnt,
            // $cursor_page_num=-1, 
            $page_num,
            // $row_cnt_per_page=-1
            $page_row_cnt
        );
        $output["pagination"] = $pagination;

        // klass_id(@Optional)와 user_id(@Optional)로 등록한 수업 정보를 가져옵니다.
        $payment_list =
        $this->my_sql->select_payment_import_list(
            // $limit=-1, 
            $limit,
            // $offset=-1, 
            $offset,
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1
            $user_id
        );

        $payment_list_next = 
        $this->my_decorator->deco_payment_import_list($payment_list);

        $output["payment_list"] = $payment_list_next;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);
    }    

}
