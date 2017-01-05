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
        */

        // init Admin
        $this->load->library('MY_Auth');
        $this->load->library('MY_Pagination');
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

        $this->respond_200_v2($output);

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

        $this->respond_200_v2($output);
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

        $page_size = 
        $this->my_paramchecker->post(
            // $key=""
            "page_size",
            // $key_filter=""
            "page_size",
            // $is_no_record=false
            true
        );
        if(empty($page_size)) {
            $page_size = 10;
        } // end if 

        $limit = 
        $this->my_pagination->get_limit(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );
        $offset = 
        $this->my_pagination->get_offset(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
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
            "page_size"=>$page_size,
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
            $page_size
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
        $this->respond_200_v2($output);        
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
        $this->respond_200_v2($output);

    } // end method    

    // @ Desc : 선생님의 전체 갯수를 가져옵니다. pagination 정보도 함께 줍니다.
    public function teacherpagination_post()
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

        $teacher_cnt = $this->my_sql->get_teacher_cnt();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "$teacher_cnt");

        $pagination = $this->my_pagination->get($teacher_cnt);
        $output["pagination"] = $pagination;

        $this->respond_200_v2($output);
    } // end method  

    // @ Desc : 선생님 리스트를 가져옵니다.
    public function teacherlist_post() 
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

        $page_size = 
        $this->my_paramchecker->post(
            // $key=""
            "page_size",
            // $key_filter=""
            "page_size",
            // $is_no_record=false
            true
        );
        if(empty($page_size)) {
            $page_size = 10;
        } // end if

        $limit = 
        $this->my_pagination->get_limit(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );
        $offset = 
        $this->my_pagination->get_offset(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );        

        $output = array();
        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_size"=>$page_size,
            "limit"=>$limit,
            "offset"=>$offset
        ];

        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;

        $teacher_list = 
        $this->my_sql->get_teacher_list(
            // $limit=-1, 
            $limit,
            // $offset=-1
            $offset
        );

        $output["teacher_list"] = $teacher_list;
        $this->respond_200_v2($output);

    } // end method      




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
        $user = $this->my_sql->get_user_by_id($user_id);
        $output["user"] = $user;
        $this->respond_200_v2($output);

    } // end method






    // REMOVE ME
    /*


    // @ Desc : 운영자 유저의 전체 갯수를 가져옵니다. pagination 정보도 함께 줍니다.
    public function userlistpagination_post()
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

        $user_cnt = $this->my_sql->get_user_cnt();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "$user_cnt");

        $pagination = $this->my_pagination->get($user_cnt);
        $output["pagination"] = $pagination;

        $this->respond_200_v2($output);
    } // end method

    // @ Desc : 일반 유저(학생) 리스트를 가져옵니다. pagination 정보도 함께 줍니다.
    public function userlist_post() 
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

        $page_size = 
        $this->my_paramchecker->post(
            // $key=""
            "page_size",
            // $key_filter=""
            "page_size",
            // $is_no_record=false
            true
        );
        if(empty($page_size)) {
            $page_size = 10;
        } // end if

        $limit = 
        $this->my_pagination->get_limit(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );
        $offset = 
        $this->my_pagination->get_offset(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );        

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_size"=>$page_size,
            "limit"=>$limit,
            "offset"=>$offset
        ];

        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;

        $user_list = 
        $this->my_sql->get_user_student_list(
            // $limit=-1, 
            $limit,
            // $offset=-1
            $offset
        );

        $output["user_list"] = $user_list;
        $this->respond_200_v2($output);

    } // end method    


    // @ Desc : 운영자 유저를 검색합니다.
    public function searchuser_post() 
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

        $search_query = 
        $this->my_paramchecker->post(
            // $key=""
            "search_query",
            // $key_filter=""
            "search_query",
            // $is_no_record=false
            true
        );

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

        $page_size = 
        $this->my_paramchecker->post(
            // $key=""
            "page_size",
            // $key_filter=""
            "page_size",
            // $is_no_record=false
            true
        );
        if(empty($page_size)) {
            $page_size = 10;
        } // end if 

        $limit = 
        $this->my_pagination->get_limit(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );
        $offset = 
        $this->my_pagination->get_offset(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        ); 

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_size"=>$page_size,
            "limit"=>$limit,
            "offset"=>$offset
        ];
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "param checked");        

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"searchuser_post is failed!");
            return;
        } // end if

        // 검색어에 해당하는 전체 결과수를 가져옵니다.
        // 이 데이터로 pagination을 새로 만듭니다.
        $user_student_cnt = 
        $this->my_sql->search_user_student_cnt($search_query);
        $output["user_student_cnt"] = $user_student_cnt;
        $pagination = 
        $this->my_pagination->get(
            // $total_row_cnt=-1, 
            $user_student_cnt,
            // $cursor_page_num=-1, 
            $page_num,
            // $row_cnt_per_page=-1
            $page_size
        );
        $output["pagination"] = $pagination;

        // 검색어로 유저를 찾습니다.
        $user_list =
        $this->my_sql->search_user_student_list(
            // $search_query="", 
            $search_query,
            // $limit=-1, 
            $limit,
            // $offset=-1
            $offset
        );
        $output["user_list"] = $user_list;
        $this->respond_200_v2($output);        
    }    

    // @ Desc : 운영자 유저의 전체 갯수를 가져옵니다. pagination 정보도 함께 줍니다.
    public function usersadminpagination_post()
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

        $admin_user_cnt = $this->my_sql->get_admin_user_cnt();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "$admin_user_cnt");

        $pagination = $this->my_pagination->get($admin_user_cnt);
        $output["pagination"] = $pagination;

        $this->respond_200_v2($output);
    } // end method
    // @ Desc : 운영자 유저 리스트를 가져옵니다. pagination 정보도 함께 줍니다.
    public function usersadmin_post() 
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

        $page_size = 
        $this->my_paramchecker->post(
            // $key=""
            "page_size",
            // $key_filter=""
            "page_size",
            // $is_no_record=false
            true
        );
        if(empty($page_size)) {
            $page_size = 10;
        } // end if

        $limit = 
        $this->my_pagination->get_limit(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );
        $offset = 
        $this->my_pagination->get_offset(
            // $page_num=-1, 
            $page_num,
            // $page_size=-1
            $page_size
        );        

        $output = array();
        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_size"=>$page_size,
            "limit"=>$limit,
            "offset"=>$offset
        ];

        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;

        $admin_user_list = 
        $this->my_sql->get_admin_user_list(
            // $limit=-1, 
            $limit,
            // $offset=-1
            $offset
        );

        $output["admin_user_list"] = $admin_user_list;
        $this->respond_200_v2($output);

    } // end method    

    // @ Desc : 운영자 유저를 검색합니다.
    public function searchusersadmin_post() 
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

        $search_query = 
        $this->my_paramchecker->post(
            // $key=""
            "search_query",
            // $key_filter=""
            "search_query",
            // $is_no_record=false
            true
        );

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }

        if($is_ok) {

            // TODO - 입력된 검색어로 운영자를 찾습니다.


            $output["removed_klass_question"] = $removed_klass_question;
            $this->respond_200_v2($output);
        } else {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"searchadminusers_post is failed!");
        } // end if
    }    
    */

}
