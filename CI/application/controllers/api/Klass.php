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
require APPPATH . '/models/SelectTile.php';
require APPPATH . '/models/KlassCourse.php';
require APPPATH . '/models/KlassKeyword.php';
require APPPATH . '/models/KlassLevel.php';
require APPPATH . '/models/KlassStation.php';
require APPPATH . '/models/KlassDay.php';
require APPPATH . '/models/KlassTime.php';
require APPPATH . '/models/KlassCalendar.php';
require APPPATH . '/models/KlassReview.php';
require APPPATH . '/models/KlassQuestion.php';

/*
*   @ Author : Wonder Jung
*   @ Desc : 카페클래스 유저 정보를 조회,추가,삭제,변경하는 API 클래스.
*/

class Klass extends MY_REST_Controller {

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

        // Please add library you need here!
        $this->load->library('MY_Calendar');
        $this->load->library('MY_KlassCalendar', ['my_calendar'=>$this->my_calendar]);
        $this->load->library('MY_Thumbnail');
        $this->load->library('MY_Decorator');
    }

    public function selectile_get() {

        if($this->is_not_ok()) {
            return;
        }

        $output = array();
        $is_ok = true;

        $output['levels'] = 
        $this->my_decorator->get_levels();
        if( is_null($output['levels']) || 
            empty($output['levels'])) {
            $is_ok = false;
        }
        $output['subway_line'] = 
        $this->my_decorator->get_subway_lines();
        if( is_null($output['subway_line']) || 
            empty($output['subway_line'])) {
            $is_ok = false;
        }
        $output['subway_station'] = 
        $this->my_decorator->get_subway_stations();
        if( is_null($output['subway_station']) || 
            empty($output['subway_station'])) {
            $is_ok = false;
        }
        $output['days'] = 
        $this->my_decorator->get_days();
        if( is_null($output['days']) || 
            empty($output['days'])) {
            $is_ok = false;
        }
        $output['times'] = 
        $this->my_decorator->get_times();
        if( is_null($output['times']) || 
            empty($output['times'])) {
            $is_ok = false;
        }

        $response_body = array();
        if ($is_ok)
        {
            $this->respond_200($output);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                'Selectile is not valid!', 
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
    }

    public function coursenew_get()
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        // @ Required
        $teacher_id = 
        $this->my_paramchecker->get(
            // $key=""
            "teacher_id",
            // $key_filter=""
            "teacher_id"
        );

        $output["param"] = array(
            "teacher_id"=>$teacher_id
        );        

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

            // 새로 입력하는 수업 관련 기본 정보를 돌려줍니다.
            // 수업 - 새로운 klass 정보를 가져옵니다.
            $new_klass = 
            $this->my_decorator->get_klass_course_new_class();

            // 수업의 선생님 - klass_teacher 정보를 가져옵니다.
            $teacher = $this->my_sql->select_teacher($teacher_id);
            $new_klass->teacher = $teacher;

            // 수업의 리뷰를 가져옵니다.
            $new_klass->review_list = [];

            // 수업의 문의를 가져옵니다.
            $new_klass->question_list = [];

            $output["klass"] = $new_klass;
            $this->respond_200($output);
        }
        else 
        {
            $this->respond_200_Failed(
                // $msg=""
                "New course failed!",
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

    public function updateattendance_post()
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

        // @ Required
        $login_user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "login_user_id",
            // $key_filter=""
            "user_id"
        );
        $klass_attendance_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_attendance_id",
            // $key_filter=""
            "klass_attendance_id"
        );
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        $klass_attendance_status = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_attendance_status",
            // $key_filter=""
            "klass_attendance_status"
        );        

        $params = array(
            "login_user_id"=>$login_user_id,
            "klass_id"=>$klass_id,
            "user_id"=>$user_id,
            "klass_attendance_status"=>$klass_attendance_status
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"updateattendance_post Failed!");
            return;
        } // end if

        // wonder.jung
        // 출석상태를 업데이트합니다.
        $this->my_sql->update_attendance(
            // $login_user_id=-1, 
            $login_user_id,
            // $attendance_id=-1,
            $klass_attendance_id,
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1, 
            $user_id,
            // $klass_attendance_status=""
            $klass_attendance_status            
        );

        // 업데이트 결과를 돌려줍니다.
        $attendance = 
        $this->my_sql->get_attendance(
            // $attendance_id=-1, 
            $klass_attendance_id,
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1
            $user_id
        );

        $output["row"] = $attendance;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);
    }    

    public function fetchklassnstudentlist_post()
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

        // @ Required
        $user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "user_id",
            // $key_filter=""
            "user_id"
        );
        // @ Required - pagination
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
        // @ Required - pagination
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

        $params = array(
            "user_id"=>$user_id,
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchklassnstudentlist_post Failed!");
            return;
        } // end if 

        // 해당 유저가 등록한 수업의 전체 갯수를 가져옵니다.
        $total_cnt = 
        $this->my_sql->select_klass_n_student_cnt(
            // $user_id=-1,
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

        // 해당 유저가 등록한 수업을 가져옵니다.
        $klass_n_student_list = 
        $this->my_sql->select_klass_n_student_list(
            // $limit=-1, 
            $limit,
            // $offset=-1
            $offset,
            // $user_id=-1, 
            $user_id
        );

        $klass_n_student_list_next = [];
        foreach ($klass_n_student_list as $key => $klass_n_student) {

            $klass_n_student =
            $this->my_decorator->deco_klass_n_student($klass_n_student);

            $klass_n_student->attendance_total_cnt =
            $this->my_sql->get_attendance_cnt(
                // $klass_id=-1, 
                $klass_n_student->klass_id,
                // $user_id=-1, 
                $klass_n_student->user_id,
                // $date_attend="", 
                "",
                // $attendance_status=""
                ""
            );

            $klass_n_student->attendance_presence_cnt = 
            $this->my_sql->get_attendance_cnt(
                // $klass_id=-1, 
                $klass_n_student->klass_id,
                // $user_id=-1, 
                $klass_n_student->user_id,
                // $date_attend="", 
                "",
                // $attendance_status=""
                "P"
            );
            $klass_n_student->attendance_ready_cnt = 
            $this->my_sql->get_attendance_cnt(
                // $klass_id=-1, 
                $klass_n_student->klass_id,
                // $user_id=-1, 
                $klass_n_student->user_id,
                // $date_attend="", 
                "",
                // $attendance_status=""
                "R"
            );
            
            $klass_n_student->attendance_absence_cnt = 
            $klass_n_student->attendance_total_cnt
            - $klass_n_student->attendance_ready_cnt
            - $klass_n_student->attendance_presence_cnt
            ;

            $klass_n_student->payment_import_cnt = 
            $this->my_sql->select_payment_import_cnt(
                // $klass_id=-1, 
                $klass_n_student->klass_id,
                // $user_id=-1, 
                $klass_n_student->user_id
            );

            // 해당 수업 결제 영수증 링크 가져오기

            $payment_status = "paid";
            if("N" == $klass_n_student->status) {
                $payment_status = "cancelled";
            }
            
            $klass_n_student->receipt_url = 
            $this->my_sql->select_payment_import_receipt(
                // $klass_id=-1, 
                $klass_n_student->klass_id,
                // $user_id=-1, 
                $klass_n_student->user_id,
                // $payment_imp_status=""  
                $payment_status
            );

            array_push($klass_n_student_list_next, $klass_n_student);
        }
        // $output["list_src"] = $klass_n_student_list;
        $output["list"] = $klass_n_student_list_next;

        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    }

    public function fetchactiveklasslistbyteacher_post()
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

        // @ Required
        $teacher_id = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_id",
            // $key_filter=""
            "teacher_id"
        );
        // @ Required - pagination
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
        // @ Required - pagination
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

        $params = array(
            "teacher_id"=>$teacher_id,
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchklassnstudentlist_post Failed!");
            return;
        } // end if 

        // 0. 개강한 수업 갯수를 가져옴.
        $total_cnt = 
        $this->my_sql->select_active_klass_cnt_by_teacher(
            // $teacher_id=-1,
            $teacher_id,
            // $klass_status="O"
            $klass_status
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

        // 1. 수업 데이터를 먼저 가져옴
        $list = 
        $this->my_sql->select_active_klass_list_by_teacher(
            // $offset=-1,
            $offset,
            // $limit=-1,
            $limit,
            // $teacher_id=-1,
            $teacher_id,
            // $klass_status="O"
            ""
        );

        $list = 
        $this->my_decorator->deco_klass_list($list);

        // 2. 수업 참여한 회원리스트를 가져옵니다.
        foreach ($list as $klass) {

            $klass_n_student_stat_list = 
            $this->my_sql->select_klass_n_student_stat_list($klass->id);

            $klass_n_student_stat_list = 
            $this->my_decorator->deco_klass_n_student_stat_list($klass_n_student_stat_list);


            /*
            // 2-1. 수업에 참여한 학생들의 출석부를 가져옵니다.
            foreach ($klass_n_student_stat_list as $klass_n_student) {

                $klass_n_student->attendance_list = 
                $this->my_sql->get_attendance_list(
                    // $limit=-1, 
                    100,
                    // $offset=-1,
                    0,
                    // $klass_id=-1, 
                    $klass_n_student->klass_id,
                    // $user_id=-1
                    $klass_n_student->user_id
                );

                $klass_n_student->attendance_list = 
                $this->my_decorator->deco_attendance_list(
                    $klass_n_student->attendance_list
                );

            } // end foreach
            */

            // 2. 수업 학생 리스트 가져오기
            $klass_n_student_stat_list = 
            $this->my_sql->select_klass_n_student_stat_list($klass->id);

            $klass_n_student_stat_list = 
            $this->my_decorator->deco_klass_n_student_stat_list($klass_n_student_stat_list);

            $klass->klass_n_student_list = 
            $klass_n_student_stat_list;

            // 2-1. 수업에 참여한 학생들의 출석부를 가져옵니다.
            // 해당 수업에 날짜순서로 정렬된 2차배열 - 테이블 형태의 데이터를 받습니다.
            $attendance_list = 
            $this->my_sql->get_attendance_table(
                // $klass_id=-1, 
                $klass->id
            );
            $attendance_table = 
            $this->my_decorator->deco_attendance_table_by_attend_date(
                $attendance_list
            );

            $klass->klass_attendance_table = 
            $attendance_table;
            
        } // end foreach

        // Deco klass
        $output["list"] = $list;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    }     

    public function fetchallklassnlistbyteacher_post()
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

        // @ Required
        $teacher_id = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_id",
            // $key_filter=""
            "teacher_id"
        );
        // @ Optional
        $klass_status = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_status",
            // $key_filter=""
            "klass_status",
            // $is_no_record=false
            true
        );
        if(empty($klass_status)) 
        {
            $klass_status = "";
        }
        // @ Required - pagination
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
        // @ Required - pagination
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

        $params = array(
            "teacher_id"=>$teacher_id,
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchklassnstudentlist_post Failed!");
            return;
        } // end if 

        // 0. 개강한 수업 갯수를 가져옴.
        $total_cnt = 
        $this->my_sql->select_klass_cnt_by_teacher(
            // $teacher_id=-1,
            $teacher_id,
            // $klass_status="O"
            $klass_status
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

        // 1. 수업 데이터를 먼저 가져옴
        $list = 
        $this->my_sql->select_klass_list_by_teacher(
            // $offset=-1,
            $offset,
            // $limit=-1,
            $limit,
            // $teacher_id=-1,
            $teacher_id,
            // $klass_status="O"
            ""
        );

        $list = 
        $this->my_decorator->deco_klass_list($list);

        // 2. 수업 참여한 회원리스트를 가져옵니다.
        foreach ($list as $klass) {

            // 2. 수업 학생 리스트 가져오기
            $klass_n_student_stat_list = 
            $this->my_sql->select_klass_n_student_stat_list($klass->id);

            $klass_n_student_stat_list = 
            $this->my_decorator->deco_klass_n_student_stat_list($klass_n_student_stat_list);

            $klass->klass_n_student_list = 
            $klass_n_student_stat_list;

            // 2-1. 수업에 참여한 학생들의 출석부를 가져옵니다.
            // 해당 수업에 날짜순서로 정렬된 2차배열 - 테이블 형태의 데이터를 받습니다.
            $attendance_list = 
            $this->my_sql->get_attendance_table(
                // $klass_id=-1, 
                $klass->id
            );
            $attendance_table = 
            $this->my_decorator->deco_attendance_table_by_attend_date(
                $attendance_list
            );

            $klass->klass_attendance_table = 
            $attendance_table;
            
        } // end foreach

        // Deco klass
        $output["list"] = $list;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    }    

    public function fetchklass_post()
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

        // @ Required
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        // @ Optional
        $login_user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "login_user_id",
            // $key_filter=""
            "user_id",
            // $is_no_record=false
            true
        );

        $params = array(
            "user_id"=>$login_user_id,
            "klass_id"=>$klass_id
        );
        $output["params"] = $params;

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchklass_post Failed!");
            return;
        } // end if 
        
        // 수업 - klass 정보를 가져옵니다.
        $klass = $this->get_klass($klass_id);

        // 수업의 리뷰를 가져옵니다.
        if(0 < intval($klass->id))
        {
            $klass->review_list = 
            $this->my_sql->select_klass_review_list(intval($klass->id));
        }
        if(empty($klass->review_list))
        {
            $klass->review_list = [];   
        }

        // 수업의 문의를 가져옵니다.
        if(0 < intval($klass->id))
        {
            $klass->question_list = 
            $this->my_sql->select_klass_question_list(intval($klass->id));
        }
        if(empty($klass->question_list))
        {
            $klass->question_list = [];   
        }

        // 해당 유저가 수업 등록을 했는지 여부를 가져옵니다.
        $klass_student = 
        $this->my_sql->select_klass_student(
            // $klass_id=-1, 
            $klass->id,
            // $user_id=-1,
            $login_user_id, 
            // $status=""
            "A"
        );
        $klass_student =
        $this->my_decorator->deco_klass_n_student($klass_student);
        $output["klass_student"] = $klass_student;

        // 조회 결과를 가져옵니다.
        if (!empty($klass))
        {
            $output["klass"] = $klass;
            $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);
        }
        else
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,'Klass could not be found');
            return;
        }
    }     

    public function course_get()
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok()");
            $output["track"] = $this->my_tracker->flush();
            $this->respond_200_Failed(
                // $msg=""
                "\$this->is_not_ok()",
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

        $param = array();
        $param['id'] = $id = $this->my_paramchecker->get('id','klass_id');
        $output['check_list'] = $check_list = $this->my_paramchecker->get_check_list();
        $output['param'] = $param;

        $query_arr = array();
        
        // 수업 - klass 정보를 가져옵니다.
        $klass = $this->get_klass($id);

        // 수업의 리뷰를 가져옵니다.
        // $review_list = null;
        if(0 < intval($klass->id))
        {
            $klass->review_list = $this->my_sql->select_klass_review_list(intval($klass->id));
        }
        if(empty($klass->review_list))
        {
            $klass->review_list = [];   
        }

        // 수업의 문의를 가져옵니다.
        // $question_list = null;
        if(0 < intval($klass->id))
        {
            $klass->question_list = $this->my_sql->select_klass_question_list(intval($klass->id));
        }
        if(empty($klass->question_list))
        {
            $klass->question_list = [];   
        }

        // 조회 결과를 가져옵니다.
        if (!empty($klass))
        {
            $output["klass"] = $klass;
            $output["track"] = $this->my_tracker->flush();
            $this->respond_200($output);
        }
        else
        {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$klass)");
            $output["track"] = $this->my_tracker->flush();
            $this->respond_200_Failed(
                // $msg=""
                'Klass could not be found',
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
    }   

    public function list_get()
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        } // end if

        $offset = 
        $this->my_paramchecker->post(
            // $key=""
            "offset",
            // $key_filter=""
            "offset"
        );
        $limit = 
        $this->my_paramchecker->post(
            // $key=""
            "limit",
            // $key_filter=""
            "limit"
        );
        $output["param"] = array(
            "offset"=>$offset,
            "limit"=>$limit
        );

        $klass_list = $this->my_sql->select_klass_list($offset, $limit);
        $output["klass_list_src"] = $klass_list;

        $klass_list = $this->my_decorator->deco_klass_list($klass_list);
        $output["klass_list"] = $klass_list;

        $new_klass = 
        $this->my_decorator->get_klass_course_new_class();
        $output["new_klass"] = [$new_klass];

        if (empty($klass_list))
        {
            // 조회한 결과가 없는 경우, "수업없음" 클래스 정보를 내려준다.
            $no_klass = 
            $this->my_decorator->get_klass_course_no_class();
            $output["klass_list"] = [$no_klass];
        } // end if

        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    } // end method

    // @ 새로운 빈 수업을 추가합니다.
    public function addklassempty_post()
    {
        if($this->is_not_ok()) {
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
        $teacher_id = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_id",
            // $key_filter=""
            "teacher_id"
        );
        $teacher_resume = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_resume",
            // $key_filter=""
            "teacher_resume"
        );
        $teacher_greeting = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_greeting",
            // $key_filter=""
            "teacher_greeting"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "teacher_id"=>$teacher_id,
            "teacher_resume"=>$teacher_resume,
            "teacher_greeting"=>$teacher_greeting
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }

        // TODO - 선생님이 수업을 연속으로 등록하는 것을 막기 위해서 가장 마지막으로 등록한 수업으로부터 3분이 지났는지 확인합니다.
        // TODO - 건네받은 userid가 선생님이 맞는지 확인합니다.

        if($is_ok) 
        {
            $this->my_sql->add_klass(
                // $user_id=-1, 
                $user_id,
                // $teacher_id=-1, 
                $teacher_id,
                // $teacher_resume="", 
                $teacher_resume,
                // $teacher_greeting=""
                $teacher_greeting
            );

            $klass = $this->my_sql->select_klass_by_teacher($teacher_id);
            $klass = $this->my_decorator->deco_klass($klass);
            $output["klass"] = $klass;

            // 선생님이 수업을 추가한 것을 로그로 기록합니다.
            $this->respond_200($output);
        }
        else
        {
            $this->respond_200_Failed(
                // $msg=""
                "addklassempty_post is failed!",
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
    }

    // @ 수업을 업데이트합니다.
    public function update_post()
    {
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ok()");
            $output["track"] = $this->my_tracker->flush();
            $this->respond_200_Failed(
                // $msg=""
                "\$this->is_not_ok()",
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

        $output = array();
        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {   
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "\$is_not_allowed_api_call");
            $output["track"] = $this->my_tracker->flush();
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
        $teacher_id = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_id",
            // $key_filter=""
            "teacher_id"
        );
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $teacher_id = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_id",
            // $key_filter=""
            "teacher_id"
        );
        $teacher_resume = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_resume",
            // $key_filter=""
            "teacher_resume"
        );
        $teacher_greeting = 
        $this->my_paramchecker->post(
            // $key=""
            "teacher_greeting",
            // $key_filter=""
            "teacher_greeting"
        ); 
        $klass_title = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_title",
            // $key_filter=""
            "klass_title"
        ); 
        $klass_type =
        $this->my_paramchecker->post(
            // $key=""
            "klass_type",
            // $key_filter=""
            "klass_type"
        );         
        $klass_feature = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_feature",
            // $key_filter=""
            "klass_feature"
        ); 
        $klass_target = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_target",
            // $key_filter=""
            "klass_target"
        );
        $klass_schedule = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_schedule",
            // $key_filter=""
            "klass_schedule"
        );
        $klass_date_begin = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_date_begin",
            // $key_filter=""
            "klass_date_begin"
        );
        $klass_time_begin = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_time_begin",
            // $key_filter=""
            "klass_time_hhmm"
        );
        $klass_time_end = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_time_end",
            // $key_filter=""
            "klass_time_hhmm"
        );
        $klass_time_duration_minutes = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_time_duration_minutes",
            // $key_filter=""
            "klass_time_duration_minutes"
        );
        $klass_level = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_level",
            // $key_filter=""
            "klass_level"
        );
        $klass_week = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_week",
            // $key_filter=""
            "klass_week"
        );
        $klass_days = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_days",
            // $key_filter=""
            "klass_days"
        );
        $klass_venue_title = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_title",
            // $key_filter=""
            "klass_venue_title"
        );
        $klass_venue_telephone = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_telephone",
            // $key_filter=""
            "klass_venue_telephone",
            // $is_no_record=false
            true
        );
        $klass_venue_address = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_address",
            // $key_filter=""
            "klass_venue_address"
        );
        $klass_venue_road_address = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_road_address",
            // $key_filter=""
            "klass_venue_road_address"
        );
        $klass_venue_latitude = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_latitude",
            // $key_filter=""
            "klass_venue_latitude"
        );
        $klass_venue_longitude = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_venue_longitude",
            // $key_filter=""
            "klass_venue_longitude"
        );
        $klass_subway_line = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_subway_line",
            // $key_filter=""
            "klass_subway_line"
        );
        $klass_subway_station = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_subway_station",
            // $key_filter=""
            "klass_subway_station"
        );
        $klass_price = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_price",
            // $key_filter=""
            "klass_price"
        );        
        $klass_student_cnt = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_student_cnt",
            // $key_filter=""
            "klass_student_cnt"
        );
        $klass_banner_url = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_banner_url",
            // $key_filter=""
            "klass_banner_url"
        );      
        // @ Optional  
        $klass_poster_url = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_poster_url",
            // $key_filter=""
            "klass_poster_url",
            // $is_no_record=false
            true
        );

        
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "teacher_id"=>$teacher_id,
            "klass_id"=>$klass_id,
            "teacher_id"=>$teacher_id,
            "teacher_resume"=>$teacher_resume,
            "teacher_greeting"=>$teacher_greeting,
            "klass_title"=>$klass_title,
            "klass_type"=>$klass_type,
            "klass_feature"=>$klass_feature,
            "klass_target"=>$klass_target,
            "klass_schedule"=>$klass_schedule,
            "klass_date_begin"=>$klass_date_begin,
            "klass_time_begin"=>$klass_time_begin,
            "klass_time_end"=>$klass_time_end,
            "klass_time_duration_minutes"=>$klass_time_duration_minutes,
            "klass_level"=>$klass_level,
            "klass_week"=>$klass_week,
            "klass_days"=>$klass_days,
            "klass_venue_title"=>$klass_venue_title,
            "klass_venue_telephone"=>$klass_venue_telephone,
            "klass_venue_address"=>$klass_venue_address,
            "klass_venue_road_address"=>$klass_venue_road_address,
            "klass_venue_latitude"=>$klass_venue_latitude,
            "klass_venue_longitude"=>$klass_venue_longitude,
            "klass_subway_line"=>$klass_subway_line,
            "klass_subway_station"=>$klass_subway_station,
            "klass_price"=>$klass_price,
            "klass_student_cnt"=>$klass_student_cnt,
            "klass_banner_url"=>$klass_banner_url,
            "klass_poster_url"=>$klass_poster_url
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok");

        if($is_ok) 
        {
            $this->my_sql->update_klass(
                // $klass_id=-1,
                $klass_id,
                // $user_id=-1,
                $user_id,
                // $teacher_id=-1
                $teacher_id,
                // $teacher_resume=""
                $teacher_resume,
                // $teacher_greeting=""
                $teacher_greeting,
                // $title=""
                $klass_title,
                // $type=""
                $klass_type,
                // $feature=""
                $klass_feature,
                // $target=""
                $klass_target,
                // $schedule=""
                $klass_schedule,
                // $date_begin=""
                $klass_date_begin,
                // $time_begin=""
                $klass_time_begin,
                // $time_end=""
                $klass_time_end,
                // $time_duration_minutes=-1
                $klass_time_duration_minutes,
                // $level=""
                $klass_level,
                // $week=-1
                $klass_week,
                // $days=""
                $klass_days,
                // $venue_title=""
                $klass_venue_title,
                // $venue_telephone=""
                $klass_venue_telephone,
                // $venue_address=""
                $klass_venue_address,
                // $venue_road_address=""
                $klass_venue_road_address,
                // $venue_latitude=""
                $klass_venue_latitude,
                // $venue_longitude=""
                $klass_venue_longitude,
                // $subway_line=""
                $klass_subway_line,
                // $subway_station=""
                $klass_subway_station,
                // $banner_url=""
                $klass_banner_url,
                // $poster_url=""
                $klass_poster_url,
                // $price=-1
                $klass_price,
                // $student_cnt
                $klass_student_cnt
            );
            $output["track"] = $this->my_tracker->flush();

            // 쿼리 가져오기
            $queries = array();
            array_push($queries, $this->my_sql->get_last_query());
            $output["queries"] = $queries;

            $klass = $this->get_klass($klass_id);
            $output["klass"] = $klass;
            
            $this->respond_200($output);
        }
        else
        {
            $output["track"] = $this->my_tracker->flush();
            $this->respond_200_Failed(
                // $msg=""
                "update_post is failed!",
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
    }    

    public function updatetitle_post() 
    {
        if($this->is_not_ok()) {
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_title = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_title",
            // $key_filter=""
            "klass_title"
        );

        $output = array();
        $output["params"] = 
        [
            "klass_id"=>$klass_id,
            "klass_title"=>$klass_title
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) 
        {
            $this->my_sql->update_klass_title(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_title_to_update=""
                $klass_title
            );

            $klass = $this->get_klass($klass_id);
            $klass_title = "";
            if(isset($klass) && isset($klass->title)) 
            {
                $klass_title = $klass->title;
            }
            $output["klass_title"] = $klass_title;
            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addposter_post is failed!",
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

    // @ Desc : 수업 리뷰를 삭제합니다. 물리적인 삭제가 아닌 리뷰 상태를 비활성(N)으로 바꿉니다.
    public function removereview_post() 
    {
        if($this->is_not_ok()) {
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_review_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review_id",
            // $key_filter=""
            "klass_review_id"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_review_id"=>$klass_review_id
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->remove_klass_review(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_review_id=-1
                $klass_review_id
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $removed_klass_review = 
            $this->my_sql->select_klass_review_by_id(
                // $klass_review_id=-1, 
                $klass_review_id
            );
            $output["removed_klass_review"] = $removed_klass_review;

            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addquestion_post is failed!",
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
    public function addreview_post() 
    {
        if($this->is_not_ok()) {
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_review = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review",
            // $key_filter=""
            "klass_review"
        );
        $klass_review_star = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review_star",
            // $key_filter=""
            "klass_review_star"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_review"=>$klass_review,
            "klass_review_star"=>$klass_review_star
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->add_klass_review(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_review=""
                $klass_review,
                // $klass_review_star=-1
                $klass_review_star
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $new_klass_review = 
            $this->my_sql->select_klass_review_last(
                // $klass_id=-1, 
                $klass_id,
                // $user_id=-1
                $user_id
            );

            $output["klass_review"] = $new_klass_review;
            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addquestion_post is failed!",
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
    public function addreviewreply_post() 
    {
        if($this->is_not_ok()) {
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_review = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review",
            // $key_filter=""
            "klass_review"
        );
        $klass_review_parent_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_review_parent_id",
            // $key_filter=""
            "klass_review_parent_id"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_review"=>$klass_review,
            "klass_review_parent_id"=>$klass_review_parent_id
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->add_klass_review_reply(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_review_parent_id=-1
                $klass_review_parent_id,
                // $klass_reply=""
                $klass_review
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $new_klass_review = 
            $this->my_sql->select_klass_review_last(
                // $klass_id=-1, 
                $klass_id,
                // $user_id=-1
                $user_id
            );

            $output["klass_review"] = $new_klass_review;
            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addreviewreply_post is failed!",
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



    // @ Desc : 수업 문의를 삭제합니다. 물리적인 삭제가 아닌 문의 상태를 비활성(N)으로 바꿉니다.
    public function removequestion_post() 
    {
        if($this->is_not_ok()) {
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_question_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_question_id",
            // $key_filter=""
            "klass_question_id"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_question_id"=>$klass_question_id
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->remove_klass_question(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_question_id=-1
                $klass_question_id
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $removed_klass_question = 
            $this->my_sql->select_klass_question_by_id(
                // $klass_question_id=-1, 
                $klass_question_id
            );
            $output["removed_klass_question"] = $removed_klass_question;

            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "removequestion_post is failed!",
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
    public function addquestion_post() 
    {
        if($this->is_not_ok()) {
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_question = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_question",
            // $key_filter=""
            "klass_question"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_question"=>$klass_question
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->add_klass_question(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_question=""
                $klass_question
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $klass_question = 
            $this->my_sql->select_klass_question_last($klass_id, $user_id);

            $output["klass_question"] = $klass_question;
            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addquestion_post is failed!",
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
    // @ Desc : 수업 문의의 답글을 등록합니다.
    public function addquestionreply_post() 
    {
        if($this->is_not_ok()) {
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_question = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_question",
            // $key_filter=""
            "klass_question"
        );
        $klass_question_parent_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_question_parent_id",
            // $key_filter=""
            "klass_question_parent_id"
        );

        $output = array();
        $output["params"] = 
        [
            "user_id"=>$user_id,
            "klass_id"=>$klass_id,
            "klass_question"=>$klass_question,
            "klass_question_parent_id"=>$klass_question_parent_id
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            $queries = array();

            // 새로운 수업 질문을 추가합니다.
            $this->my_sql->add_klass_question_reply(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_question_parent_id=-1, 
                $klass_question_parent_id,
                // $klass_question=""
                $klass_question
            );

            // 쿼리 가져오기
            array_push($queries, $this->my_sql->get_last_query());

            // 수업의 질문 리스트를 가져옵니다.
            $klass_question = 
            $this->my_sql->select_klass_question_last($klass_id, $user_id);

            $output["klass_question"] = $klass_question;
            $output["queries"] = $queries;

            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addquestionreply_post is failed!",
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

    public function addposter_post() 
    {
        if($this->is_not_ok()) {
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_poster_url = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_poster_url",
            // $key_filter=""
            "klass_poster_url"
        );

        $output = array();
        $output["params"] = 
        [
            "klass_id"=>$klass_id,
            "klass_poster_url"=>$klass_poster_url
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            // 이전 포스터 주소를 가져옵니다.
            $klass_poster_prev = $this->my_sql->get_klass_poster($klass_id);
            // 있다면 해당 포스터를 삭제합니다.
            if(!empty($klass_poster_prev)) 
            {
                $output["klass_poster_deleted"] = $klass_poster_prev;
                $output["klass_poster_path_deleted"]
                = $this->my_thumbnail->get_path_thumbnail_klass_poster($klass_poster_prev);
                $output["has_deleted"]
                = $this->my_thumbnail->delete_thumbnail_klass_poster($klass_poster_prev);
            }

            $this->my_sql->add_klass_poster(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_poster_url_to_add=""
                $klass_poster_url
            );
            $output["klass_poster"] = $this->my_sql->get_klass_poster($klass_id);
            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "addposter_post is failed!",
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

    public function updatebanner_post()   
    {
        if($this->is_not_ok()) {
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );
        $klass_banner_url = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_banner_url",
            // $key_filter=""
            "klass_banner_url"
        );

        $output = array();
        $output["params"] = 
        [
            "klass_id"=>$klass_id,
            "klass_banner_url"=>$klass_banner_url
        ];

        $is_ok = true;
        $check_list = 
        $this->my_paramchecker->get_check_list();
        $output["check_list"] = $check_list;
        if($this->my_paramchecker->has_check_list_failed())
        {
            $is_ok = false;
        }
        
        if($is_ok) {

            $this->my_sql->update_klass_banner(
                // $user_id=-1, 
                $user_id,
                // $klass_id=-1, 
                $klass_id,
                // $klass_banner_url_to_add=""
                $klass_banner_url
            );
            $output["klass_banner_list"] = $this->my_sql->get_klass_banner_list($klass_id);
            $this->respond_200($output);

        } else {
            $this->respond_200_Failed(
                // $msg=""
                "updatebanner_post is failed!",
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

    // @ Desc : 낱개의 수업을 가져옵니다.
    private function get_klass($klass_id=-1)
    {
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if(!(0 < $klass_id)) {
            $this->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "\$klass_id is not valid!");
            return;
        } // end if

        $klass_list = $this->my_sql->select_klass($klass_id);
        $klass_list = $this->my_decorator->deco_klass_list($klass_list);

        $klass = null;
        if(!empty($klass_list)) 
        {
            $klass = $klass_list[0];
            $klass->calendar_table_monthly = $this->my_klasscalendar->getMonthly($klass);
        }

        return $klass;
    }    

    // @ Desc : 수업 리스트를 가져옵니다. 검색어, 권한, 상태등의 조회 조건을 줄수 있습니다.
    public function fetchklasslist_post() 
    {
        $output = [];
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

        // login user id - 로그인한 유저의 아이디. 선생님 여부를 판별하는데 사용합니다. 선생님이라면, 수업 추가 탭이 제일 앞에 들어갑니다.
        $login_user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "login_user_id",
            // $key_filter=""
            "user_id",
            // $is_no_record=false
            true
        );

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
            "login_user_id"=>$login_user_id,
            "search_query"=>$search_query,
            "klass_status"=>$klass_status,
            "klass_level"=>$klass_level,
            "klass_subway_line"=>$klass_subway_line,
            "klass_subway_station"=>$klass_subway_station,
            "klass_days"=>$klass_days,
            "klass_time"=>$klass_time
        ];

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
        // 비어있는 수업이라면 '수업 없음' 탭을 가져옵니다.
        if (empty($klass_list))
        {
            $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "조회한 결과가 없는 경우, \"수업없음\" 클래스 정보를 내려준다.");
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
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output); 
    }    

    public function addstudent_post() 
    {
        $output = [];
        $this->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if($this->is_not_ok()) {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$this->is_not_ok()");
            return;
        }

        $is_not_allowed_api_call = $this->my_paramchecker->is_not_allowed_api_call();
        if($is_not_allowed_api_call) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"\$is_not_allowed_api_call");
            return;
        }

        $login_user_id = 
        $this->my_paramchecker->post(
            // $key=""
            "login_user_id",
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id"
        );

        $output = array();
        $output["params"] = 
        [
            "login_user_id"=>$login_user_id,
            "user_id"=>$user_id,
            "klass_id"=>$klass_id
        ];

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();
        if(!$is_ok)
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"updateuser_post Failed!");
            return;
        } // end if 

        $this->my_sql->add_klass_student(
            // $login_user_id=-1, 
            $login_user_id,
            // $klass_id=-1            
            $klass_id, 
            // $user_id=-1,
            $user_id
        );

        $klass_student = 
        $this->my_sql->select_klass_student(
            // $klass_id=-1            
            $klass_id, 
            // $user_id=-1,
            $user_id
        );

        $output["klass_student"] = $klass_student;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output);

    }






    // @ Desc : 수업 출석 리스트를 가져옵니다.
    public function fetchklassattendlist_post() 
    {
        $output = [];
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
        $klass_id = 
        $this->my_paramchecker->post(
            // $key=""
            "klass_id",
            // $key_filter=""
            "klass_id",
            // $is_no_record=false
            true
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

        $date_attend =        
        $this->my_paramchecker->post(
            // $key=""
            "date_attend",
            // $key_filter=""
            "date_yyyymmddhhmmss",
            // $is_no_record=false
            true
        );        

        $attendance_status = 
        $this->my_paramchecker->post(
            // $key=""
            "attendance_status",
            // $key_filter=""
            "klass_attendance_status",
            // $is_no_record=false
            true
        );        

        $output["params"] = 
        [
            "page_num"=>$page_num,
            "page_row_cnt"=>$page_row_cnt,
            "limit"=>$limit,
            "offset"=>$offset,
            "klass_id"=>$klass_id,
            "user_id"=>$user_id,
            "attendance_status"=>$attendance_status
        ];

        // CHECK LIST
        $is_ok = $this->has_check_list_success();
        $this->my_tracker->add(__FILE__, __FUNCTION__, __LINE__, "\$is_ok : $is_ok");
        $output["check_list"] = $this->get_check_list();

        if(!$is_ok) 
        {
            $this->respond_200_Failed_v2(__FILE__,__FUNCTION__,__LINE__,$output,"fetchklassattendlist_post is failed!");
            return;
        } // end if

        // 검색어에 해당하는 전체 결과수를 가져옵니다.
        // 이 데이터로 pagination을 새로 만듭니다.
        $total_cnt = 
        $this->my_sql->get_attendance_cnt(
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1, 
            $user_id,
            // $date_attend=""
            $date_attend,
            // $attendance_status=""
            $attendance_status
        );
        $output["total_cnt"] = $total_cnt;
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

        $list =
        $this->my_sql->get_attendance_list(
            // $limit=-1, 
            $limit,
            // $offset=-1, 
            $offset,
            // $klass_id=-1, 
            $klass_id,
            // $user_id=-1, 
            $user_id,
            // $date_attend="", 
            $date_attend,
            // $attendance_status=""
            $attendance_status
        );
        $output["list_src"] = $list;

        $list = $this->my_decorator->deco_attendance_list($list);
        $output["list"] = $list;
        $this->respond_200_v2(__FILE__,__FUNCTION__,__LINE__,$output); 
    }     

}
