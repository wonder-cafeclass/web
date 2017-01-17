<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . '/models/KlassAttendance.php';
require_once APPPATH . '/models/KlassCourse.php';
require_once APPPATH . '/models/Teacher.php';
require_once APPPATH . '/models/User.php';
require_once APPPATH . '/models/KlassSubwayLine.php';
require_once APPPATH . '/models/KlassSubwayStation.php';
require_once APPPATH . '/models/KlassNStudent.php';
require_once APPPATH . '/models/PaymentImport.php';
require_once APPPATH . '/libraries/MY_Library.php';

class MY_Decorator extends MY_Library
{
    function __construct()
    {
        // Construct the parent class
        parent::__construct();
    } // end method

    // wonder.jung
    // @ Desc : 수업 관련 기본값 설정 로직들.
    private function get_class_img_default() 
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'no_class', 
            'klass_event_img_list', 
            'klass_event_img_url_list'
        );
    }
    private function get_class_img_new() 
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'new_class', 
            'klass_event_img_list', 
            'klass_event_img_url_list'
        );
    }
    private function get_level_default()
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'ALL', 
            'class_level_list', 
            'class_level_list'
        );
    }
    private function get_level_img_default()
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'ALL', 
            'class_level_list', 
            'class_level_img_url_list'
        );
    }
    private function get_days_default()
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'ALL', 
            'class_level_list', 
            'class_level_list'
        );
    }
    private function get_days_img_default()
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'ALL', 
            'class_level_list', 
            'class_level_img_url_list'
        );
    }
    private function get_time_begin_default()
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'always',
            'class_times_list',
            'class_times_list'
        );    
    }
    private function get_time_begin_img_default()
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'always',
            'class_times_list',
            'class_times_img_url_list'
        );    
    }
    private function get_subway_line_default()
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'line2',
            'subway_line_list',
            'subway_line_list'
        );
    }
    private function get_subway_station_default()
    {
        $subway_station_list = 
        $this->CI->my_paramchecker->get_const_from_list(
            'line2',
            'subway_line_list',
            'subway_station_list'
        );

        return $subway_station_list[0];
    } 
    private function get_subway_station_img_default()
    {
        return $this->CI->my_paramchecker->get_const_from_list(
            'everywhere',
            'class_venue_subway_station_list',
            'class_venue_subway_station_img_url_list'
        );
    }
    private function set_default_klass_course($klass_course) 
    {
        if(is_null($klass_course)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass_course)");
            return null;
        }

        $klass_course->price = $klass_course->price_with_format = "0";

        // 기본 이미지 설정.
        $klass_course->level =  
        $this->get_level_default();
        $klass_course->level_img_url =  
        $this->get_level_img_default();

        $klass_course->days = 
        $this->get_days_default();
        $klass_course->days_img_url = 
        $this->get_days_img_default();

        $klass_course->time_begin = 
        $this->get_time_begin_default();
        $klass_course->time_begin_img_url = 
        $this->get_time_begin_img_default();

        $klass_course->subway_line = 
        $this->get_subway_line_default();
        $klass_course->subway_station = 
        $this->get_subway_station_default();
        $klass_course->subway_station_img = 
        $this->get_subway_station_img_default();

        return $klass_course;

    }   

    public function get_klass_course_no_class() 
    {
        if($this->is_not_ready()) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        } // end if
        
        $klass_course = new KlassCourse();
        $klass_course->id = -1;
        $klass_course->class_poster_url_loadable = 
        $this->get_class_img_default();
        $klass_course->title="수업이 없습니다.";

        $klass_course = 
        $this->set_default_klass_course($klass_course);

        return $klass_course;
    }
    public function get_klass_course_new_class() 
    {
        if($this->is_not_ready()) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        } // end if

        $klass_course = new KlassCourse();
        $klass_course->id = -100;
        $klass_course->class_poster_url_loadable = 
        $this->get_class_img_new();
        $klass_course->title="새로운 수업을 만들어요.";

        $klass_course = 
        $this->set_default_klass_course($klass_course);

        return $klass_course;
    }
    public function get_levels() {

        if($this->is_not_ready()) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        } // end if        

        $class_level_list = $this->get_const("class_level_list");
        $class_level_eng_list = $this->get_const("class_level_eng_list");
        $class_level_kor_list = $this->get_const("class_level_kor_list");
        $class_level_img_url_list = $this->get_const("class_level_img_url_list");

        // check list is valid
        $klass_level_list = array();
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
    public function get_days() {

        if($this->is_not_ready()) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        } // end if

        $class_days_list = $this->get_const("class_days_list");
        $class_days_eng_list = $this->get_const("class_days_eng_list");
        $class_days_kor_list = $this->get_const("class_days_kor_list");
        $class_days_img_url_list = $this->get_const("class_days_img_url_list");

        // check list is valid
        $klass_day_list = array();        
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
    public function get_times() {

        if($this->is_not_ready()) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        } // end if        

        $class_times_list = $this->get_const("class_times_list");
        $class_times_eng_list = $this->get_const("class_times_eng_list");
        $class_times_kor_list = $this->get_const("class_times_kor_list");
        $class_times_hh_mm_list = $this->get_const("class_times_hh_mm_list");
        $class_times_img_url_list = $this->get_const("class_times_img_url_list");

        $klass_time_list = array();
        for ($i=0; $i < count($class_times_list); $i++) 
        {
            $key = $class_times_list[$i];
            $name_eng = $class_times_eng_list[$i];
            $name_kor = $class_times_kor_list[$i];
            $img_url = $class_times_img_url_list[$i];
            $hh_mm = $class_times_hh_mm_list[$i];

            $time_obj = 
            new KlassTime(
                $key, 
                $name_eng, 
                $name_kor, 
                $img_url, 
                $hh_mm
            );

            array_push($klass_time_list, $time_obj);
        }

        return $klass_time_list;
    } // end method
    public function get_subway_lines() {

        if($this->is_not_ready()) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        } // end if  

        $subway_line_list = 
        $this->get_const("subway_line_list");
        $subway_line_eng_list = 
        $this->get_const("subway_line_eng_list");
        $subway_line_kor_list = 
        $this->get_const("subway_line_kor_list");
        $subway_line_img_list = 
        $this->get_const("subway_line_img_list");

        $klass_subway_line_list = array();
        for ($i=0; $i < count($subway_line_list); $i++) 
        { 

            $key = $subway_line_list[$i];
            $name_eng = $subway_line_eng_list[$i];
            $name_kor = $subway_line_kor_list[$i];
            $img_url = $subway_line_img_list[$i];

            $subway_line_obj = 
            new KlassSubwayLine(
                $key, 
                $name_eng, 
                $name_kor, 
                $img_url
            );

            array_push(
                $klass_subway_line_list, 
                $subway_line_obj
            );

        } // end for

        return $klass_subway_line_list;

    }
    // @ Legacy : get_stations
    public function get_subway_stations() {

        if($this->is_not_ready()) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "\$this->is_not_ready()");
            return;
        } // end if        

        $subway_station_list = 
        $this->get_const("subway_station_list");
        $subway_station_eng_list = 
        $this->get_const("subway_station_eng_list");
        $subway_station_kor_list = 
        $this->get_const("subway_station_kor_list");
        $subway_station_img_url_list = 
        $this->get_const("subway_station_img_list");

        $klass_subway_station_list = array();
        for ($i=0; $i < count($subway_station_list); $i++) 
        { 

            $key = $subway_station_list[$i];
            $name_eng = $subway_station_eng_list[$i];
            $name_kor = $subway_station_kor_list[$i];
            $img_url = $subway_station_img_url_list[$i];

            $subway_station_obj = 
            new KlassSubwayStation(
                $key, 
                $name_eng, 
                $name_kor, 
                $img_url
            );

            array_push(
                $klass_subway_station_list, 
                $subway_station_obj
            );

        } // end for

        return $klass_subway_station_list;       
    }    




    public function deco_klass($klass=null) 
    {
        if(is_null($klass)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return null;
        } // end if

        $klassCourse = new KlassCourse();
        $klassCourse->id = intval($klass->klass_id);
        $klassCourse->title = $klass->klass_title;
        $klassCourse->type = $klass->klass_type;
        $klassCourse->feature = $klass->klass_feature;
        $klassCourse->target = $klass->klass_target;
        $klassCourse->schedule = $klass->klass_schedule;
        $klassCourse->date_begin = $klass->klass_date_begin;
        $klassCourse->time_begin = $klass->klass_time_begin;
        $klassCourse->time_duration_minutes = intval($klass->klass_time_duration_minutes);
        $klassCourse->time_end = $klass->klass_time_end;
        $klassCourse->level = $klass->klass_level;
        $klassCourse->week = intval($klass->klass_week);
        $klassCourse->days = $klass->klass_days;

        // $klassCourse->status = $klass->status;
        $klassCourse->status = $klass->klass_status;

        $klassCourse->subway_line = $klass->klass_subway_line;
        $klassCourse->subway_station = $klass->klass_subway_station;

        $klassCourse->venue_title = $klass->klass_venue_title;
        $klassCourse->venue_telephone = $klass->klass_venue_telephone;
        $klassCourse->venue_address = $klass->klass_venue_address;
        $klassCourse->venue_road_address = $klass->klass_venue_road_address;
        $klassCourse->venue_latitude = $klass->klass_venue_latitude;
        $klassCourse->venue_longitude = $klass->klass_venue_longitude;
        
        $klassCourse->price = intval($klass->klass_price);
        $klassCourse->student_cnt = intval($klass->klass_student_cnt);
        $klassCourse->class_poster_url = $klass->klass_class_poster_url;
        $klassCourse->class_banner_url = $klass->klass_class_banner_url;

        $klassCourse->date_created = $klass->klass_date_created;
        $klassCourse->date_updated = $klass->klass_date_updated;

        $klassCourse->teacher_id = intval($klass->teacher_id);
        $klassCourse->teacher_resume = $klass->teacher_resume;
        $klassCourse->teacher_greeting = $klass->teacher_greeting;

        $teacher = new Teacher();
        $teacher->id = intval($klass->teacher_id);
        $teacher->user_id = intval($klass->teacher_user_id);
        $teacher->nickname = $klass->teacher_nickname;
        $teacher->name = $klass->teacher_name;
        $teacher->gender = $klass->teacher_gender;
        $teacher->birthday = $klass->teacher_birthday;
        $teacher->thumbnail = $klass->teacher_thumbnail;
        $teacher->status = $klass->teacher_status;
        $teacher->mobile = $klass->teacher_mobile;
        $teacher->email = $klass->teacher_email;
        $teacher->resume = $klass->teacher_resume;
        $teacher->greeting = $klass->teacher_greeting;
        $teacher->memo = $klass->teacher_memo;
        $teacher->date_created = $klass->teacher_date_created;
        $teacher->date_updated = $klass->teacher_date_updated;

        $klassCourse->teacher = $teacher;

        // 추가할 정보들을 넣는다.
        $klassCourse = $this->deco_klass_extra($klassCourse);
        
        return $klassCourse;
    }

    // @ Desc : 수업 정보에 추가적인 데이터를 줍니다. ex) 이미지, 날짜 등
    public function deco_klass_extra($klassCourse=null)
    {
        if(is_null($klassCourse)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klassCourse)");
            return null;
        } // end if

        $klassCourse = $this->get_class_poster_img_url($klassCourse);
        $klassCourse = $this->get_time_begin_img_url($klassCourse);
        $klassCourse = $this->get_level_img_url($klassCourse);
        $klassCourse = $this->get_days_list($klassCourse);
        $klassCourse = $this->get_days_img_url($klassCourse);
        $klassCourse = $this->get_subway_station_img_url($klassCourse);
        $klassCourse = $this->get_price_with_format($klassCourse);  

        return $klassCourse;

    } // end method

    // @ Desc : 수업 관련 추가 정보를 넣어줍니다.
    public function deco_klass_list($klass_list=null) 
    {
        if(empty($klass_list)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$klass_list)");
            return array();
        } // end if

        $klass_list_next = array();
        foreach ($klass_list as $klass)
        {
            // join으로 가져온 klass와 teacher의 정보를 나눕니다.

            $klassCourse = $this->deco_klass($klass);

            array_push($klass_list_next, $klassCourse);
        }

        return $klass_list_next;
        
    } // end method

    private function get_class_poster_img_url($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $klass->class_img_err_url = $this->CI->my_path->get("/assets/images/event/error.svg");
        if(empty($klass->class_poster_url)) {
            $klass->class_poster_url = "";
            $klass->class_poster_url_loadable = $this->CI->my_path->get("/assets/images/class/poster/no_cover_image.jpg");
        }
        else
        {
            $klass->class_poster_url_loadable = $this->CI->my_path->get_loadable_url_class_poster($klass->class_poster_url);   
        } 

        return $klass;       
    }
    private function get_time_begin_img_url($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $time_begin = $klass->time_begin;
        if(empty($time_begin))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$time_begin)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        $military_hours = date("H", strtotime($time_begin));
        $class_times_list = $const_map->{"class_times_list"};
        $class_times_eng_list = $const_map->{"class_times_eng_list"};
        $class_times_kor_list = $const_map->{"class_times_kor_list"};
        $class_times_img_url_list = $const_map->{"class_times_img_url_list"};

        if(6 <= $military_hours && $military_hours < 12) 
        {       
            // 오전
            $target_idx = 1;
        } 
        else if(12 <= $military_hours && $military_hours < 14) 
        {
            // 점심
            $target_idx = 2;
        }
        else if(14 <= $military_hours && $military_hours < 18) 
        {
            // 오후
            $target_idx = 3;
        }
        else if(18 <= $military_hours && $military_hours < 20) 
        {
            // 저녁
            $target_idx = 4;
        }
        else 
        {
            // TODO - Show Error - 지정된 시간이 없음.
            $target_idx = 0;
        }

        $klass->time_begin_name = $class_times_list[$target_idx];
        $klass->time_begin_name_eng = $class_times_eng_list[$target_idx];
        $klass->time_begin_name_kor = $class_times_kor_list[$target_idx];
        $klass->time_begin_img_url = $class_times_img_url_list[$target_idx];

        return $klass;
    } // end method
    private function get_level_img_url($klass=null)
    {

        if(is_null($klass)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $class_level = $klass->level;
        if(empty($class_level))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$class_level)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if


        $class_level_list = $const_map->{"class_level_list"};

        $idx_selected = -1;
        for ($i=0; $i < count($class_level_list); $i++) 
        {
            $cur_class_level = $class_level_list[$i];
            if(!empty($cur_class_level) && $cur_class_level === $class_level) 
            {
                $idx_selected = $i;
                break;
            }
        }
        $class_level_eng_list = $const_map->{"class_level_eng_list"};
        $class_level_kor_list = $const_map->{"class_level_kor_list"};
        $class_level_img_url_list = $const_map->{"class_level_img_url_list"};

        if(!(0 < $idx_selected)) 
        {
            // 선택한 항목이 없다. 기본 이미지를 돌려준다.
            $klass->level_eng = $class_level_eng_list[0];
            $klass->level_kor = $class_level_kor_list[0];
            $klass->level_img_url = $class_level_img_url_list[0];
        }
        else
        {
            // 선택한 항목이 있다. 선택한 이미지를 돌려준다.
            $klass->level_eng = $class_level_eng_list[$idx_selected];
            $klass->level_kor = $class_level_kor_list[$idx_selected];
            $klass->level_img_url = $class_level_img_url_list[$idx_selected];
        } // end if

        return $klass;

    } // end method
    private function get_days_list($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $class_days = $klass->days;
        if(empty($class_days))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$class_days)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        $class_days_list = $const_map->{"class_days_list"};

        // "|"로 구분된 요일 정보를 분리해서 전달한다.
        $days_list = explode($klass->delimiter, $class_days);

        // 유효성 검증 완료! 데이터를 저장합니다.
        $klass->days_list = $days_list;

        return $klass;
    } 
    private function get_days_map($days_list=null)
    {
        if(empty($days_list))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$days_list)");
            return;
        } // end if

        $days_map = [];
        for ($i=0; $i < count($days_list); $i++) 
        {
                $day = $days_list[$i];
                $day = strtolower($day);
                $days_map[$day] = $day;
        } // end for

        return $days_map;
    }
    private function get_days_img_url($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $days_list = $klass->days_list;
        if(empty($days_list))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$days_list)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        $days_list = $klass->days_list;
        $days_map = $this->get_days_map($days_list);

        $class_days_list = $const_map->{"class_days_list"};
        
        $selected_idx_arr = array();
        for ($i=0; $i < count($class_days_list); $i++) 
        {
            $cur_class_days = $class_days_list[$i];
            if(!empty($days_map[$cur_class_days])) 
            {
                array_push($selected_idx_arr, $i);
            } // end if
        } // end for
        $class_days_eng_list = $const_map->{"class_days_eng_list"};
        $class_days_kor_list = $const_map->{"class_days_kor_list"};
        $class_days_img_url_list = $const_map->{"class_days_img_url_list"};

        // 수업 요일이 주당 2일 이상으로 변경될 가능성을 고려, 설계한다.
        for ($i=0; $i < count($selected_idx_arr); $i++) 
        {
            $selected_idx = $selected_idx_arr[$i];

            if(empty($klass->days_eng)) {
                $klass->days_eng = $class_days_eng_list[$selected_idx];
            } else {
                $klass->days_eng .= $klass->delimiter . "" . $class_days_eng_list[$selected_idx];
            }
            if(empty($klass->days_kor)) {
                $klass->days_kor = $class_days_kor_list[$selected_idx];
            } else {
                $klass->days_kor .= $klass->delimiter . "" . $class_days_kor_list[$selected_idx];
            }
            if(empty($klass->days_img_url)) {
                $klass->days_img_url = $class_days_img_url_list[$selected_idx];
            } else {
                $klass->days_img_url .= $klass->delimiter . "" . $class_days_img_url_list[$selected_idx];
            }
        } // end for

        return $klass;
    }
    private function get_subway_station_img_url($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $subway_line = $klass->subway_line;
        if(empty($subway_line))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$subway_line)");
            return;
        } // end if

        $subway_station = $klass->subway_station;
        if(empty($subway_line))
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$subway_station)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        $subway_line_list = $const_map->{"subway_line_list"};
        
        $idx_subway_line = -1;
        for ($i=0; $i < count($subway_line_list); $i++) 
        {
            $subway_line_from_list = $subway_line_list[$i];
            if(!empty($subway_line_from_list) && $subway_line_from_list === $subway_line) 
            {
                $idx_subway_line = $i;
                break;
            }
        } // end for

        $subway_station_list = $const_map->{"subway_station_list"};
        $subway_station_list = $subway_station_list[$idx_subway_line];

        $idx_subway_station = -1;
        for ($i=0; $i < count($subway_station_list); $i++) 
        {
            $subway_station_from_list = $subway_station_list[$i];
            if(!empty($subway_station_from_list) && $subway_station_from_list === $subway_station) 
            {
                $idx_subway_station = $i;
                break;
            }
        } // end for

        $subway_station_img_list = $const_map->{"subway_station_img_list"};
        $klass->subway_station_img = $subway_station_img_list[$idx_subway_line][$idx_subway_station];

        return $klass;
    } 
    private function get_price_with_format($klass=null)
    {
        if(is_null($klass)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        }
        else if(is_null($klass->price)) 
        {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass->price)");
            return;
        } // end if
        $klass->price_with_format = number_format($klass->price);

        return $klass;
    } 

    private function getStr($target=null, $key="")	
    {
        if(is_null($target))
        {
            return null;
        }
        if(empty($key))
        {
            return null;
        }
        if(is_null($this->CI->my_keyvalue))
        {
            return null;
        }
        if(!$this->CI->my_keyvalue->has($target, $key))
        {
            return null;
        }

        return $this->CI->my_keyvalue->get($target, $key);
    }

    private function getNumber($target=null, $key="")  
    {
        if(is_null($target))
        {
            return null;
        }
        if(empty($key))
        {
            return null;
        }
        if(is_null($this->CI->my_keyvalue))
        {
            return null;
        }
        if(!$this->CI->my_keyvalue->has($target, $key))
        {
            return null;
        }

        return $this->CI->my_keyvalue->get_number($target, $key);
    }    

    // @ Desc : 수업 관련 추가 정보를 넣어줍니다.
    public function deco_payment_import_list($pi_list=null) 
    {
        if(empty($pi_list)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$pi_list)");
            return array();
        } // end if

        $pi_list_next = array();
        foreach ($pi_list as $payment)
        {
            // join으로 가져온 PaymentImport와 User의 정보를 나눕니다.

            $pi = new PaymentImport();

            $pi->id = $this->getNumber($payment, "pi_id");
            $pi->klass_id = $this->getNumber($payment, "pi_klass_id");
            $pi->user_id = $this->getNumber($payment, "pi_user_id");
            $pi->imp_uid = $this->getStr($payment, "pi_imp_uid");
            $pi->merchant_uid = $this->getStr($payment, "pi_merchant_uid");

            $pi->pay_method = $this->getStr($payment, "pi_pay_method");
            $pi->pg_provider = $this->getStr($payment, "pi_pg_provider");
            $pi->pg_tid = $this->getStr($payment, "pi_pg_tid");
            $pi->escrow = (bool)$this->getNumber($payment, "pi_escrow");
            $pi->apply_num = $this->getStr($payment, "pi_apply_num");

            $pi->card_name = $this->getStr($payment, "pi_card_name");

            $pi->card_quota = $this->getNumber($payment, "pi_card_quota");
            $pi->vbank_name = $this->getStr($payment, "pi_vbank_name");
            $pi->vbank_num = $this->getStr($payment, "pi_vbank_num");
            $pi->vbank_holder = $this->getStr($payment, "pi_vbank_holder");

            $pi->vbank_date = $this->getStr($payment, "pi_vbank_date");
            $pi->my_date_vbank_date = $this->getStr($payment, "pi_my_date_vbank_date");
            $pi->name = $this->getStr($payment, "pi_name");
            $pi->amount = $this->getNumber($payment, "pi_amount");
            $pi->cancel_amount = $this->getNumber($payment, "pi_cancel_amount");

            $pi->currency = $this->getStr($payment, "pi_currency");
            $pi->buyer_name = $this->getStr($payment, "pi_buyer_name");
            $pi->buyer_email = $this->getStr($payment, "pi_buyer_email");
            $pi->buyer_tel = $this->getStr($payment, "pi_buyer_tel");
            $pi->buyer_addr = $this->getStr($payment, "pi_buyer_addr");

            $pi->buyer_postcode = $this->getStr($payment, "pi_buyer_postcode");
            $pi->status = $this->getStr($payment, "pi_status");
            $pi->paid_at = $this->getNumber($payment, "pi_paid_at");
            $pi->my_date_paid_at = $this->getStr($payment, "pi_my_date_paid_at");
            $pi->failed_at = $this->getNumber($payment, "pi_failed_at");

            $pi->my_date_failed_at = $this->getStr($payment, "pi_my_date_failed_at");
            $pi->cancelled_at = $this->getNumber($payment, "pi_cancelled_at");
            $pi->my_date_cancelled_at = $this->getStr($payment, "pi_my_date_cancelled_at");
            $pi->fail_reason = $this->getStr($payment, "pi_fail_reason");
            $pi->cancel_reason = $this->getStr($payment, "pi_cancel_reason");

            $pi->receipt_url = $this->getStr($payment, "pi_receipt_url");
            $pi->cancel_receipt_url = $this->getStr($payment, "pi_cancel_receipt_url");
            $pi->date_created = $this->getStr($payment, "pi_date_created");

            $klass = new KlassCourse();

            $klass->id = $this->getNumber($payment, "klass_id");
            $klass->title = $this->getStr($payment, "klass_title");
            $klass->type = $this->getStr($payment, "klass_type");
            $klass->feature = $this->getStr($payment, "klass_feature");
            $klass->target = $this->getStr($payment, "klass_target");

            $klass->schedule = $this->getStr($payment, "klass_schedule");
            $klass->date_begin = $this->getStr($payment, "klass_date_begin");
            $klass->time_begin = $this->getStr($payment, "klass_time_begin");
            $klass->time_duration_minutes = $this->getStr($payment, "klass_time_duration_minutes");
            $klass->time_end = $this->getStr($payment, "klass_time_end");

            $klass->level = $this->getStr($payment, "klass_level");
            $klass->week = $this->getStr($payment, "klass_week");
            $klass->days = $this->getStr($payment, "klass_days");
            $klass->subway_line = $this->getStr($payment, "klass_subway_line");
            $klass->subway_station = $this->getStr($payment, "klass_subway_station");

            $klass->venue_title = $this->getStr($payment, "klass_venue_title");
            $klass->venue_telephone = $this->getStr($payment, "klass_venue_telephone");
            $klass->venue_address = $this->getStr($payment, "klass_venue_address");
            $klass->venue_road_address = $this->getStr($payment, "klass_venue_road_address");
            $klass->venue_latitude = $this->getStr($payment, "klass_venue_latitude");

            $klass->venue_longitude = $this->getStr($payment, "klass_venue_longitude");
            $klass->status = $this->getStr($payment, "klass_status");
            $klass->price = $this->getStr($payment, "klass_price");
            $klass->student_cnt = $this->getStr($payment, "klass_student_cnt");
            $klass->class_poster_url = $this->getStr($payment, "klass_class_poster_url");

            $klass->class_poster_url_loadable = 
            $this->CI->my_path->get_loadable_url_class_poster($klass->class_poster_url);

            $klass->class_banner_url = $this->getStr($payment, "klass_class_banner_url");
            $klass->date_created = $this->getStr($payment, "klass_date_created");
            $klass->date_updated = $this->getStr($payment, "klass_date_updated");

            // 수업 이미지 정보 추가
            $klass = $this->deco_klass_extra($klass);

            $pi->klass = $klass;

            // 수업을 듣는 유저 정보 추가
            $user = new User();

            $user->id = $this->getNumber($payment, "user_id");
            $user->nickname = $this->getStr($payment, "user_nickname");
            $user->name = $this->getStr($payment, "user_name");
            $user->gender = $this->getStr($payment, "user_gender");
            $user->birthday = $this->getStr($payment, "user_birthday");

            $user->thumbnail = $this->getStr($payment, "user_thumbnail");
            $user->status = $this->getStr($payment, "user_status");
            $user->permission = $this->getStr($payment, "user_permission");
            $user->mobile = $this->getStr($payment, "user_mobile");
            $user->email = $this->getStr($payment, "user_email");

            $pi->user = $user;

            // 수업 담당 선생님 정보 추가
            $teacher = new Teacher();

            $teacher->id = $this->getNumber($payment, "teacher_id");
            $teacher->user_id = $this->getNumber($payment, "teacher_user_id");
            $teacher->nickname = $this->getStr($payment, "teacher_nickname");
            $teacher->name = $this->getStr($payment, "teacher_name");
            $teacher->gender = $this->getStr($payment, "teacher_gender");
            $teacher->birthday = $this->getStr($payment, "teacher_birthday");

            $teacher->thumbnail = $this->getStr($payment, "teacher_thumbnail");
            $teacher->status = $this->getStr($payment, "teacher_status");
            $teacher->mobile = $this->getStr($payment, "teacher_mobile");
            $teacher->email = $this->getStr($payment, "teacher_email");
            $teacher->resume = $this->getStr($payment, "teacher_resume");
            $teacher->greeting = $this->getStr($payment, "teacher_greeting");

            $pi->teacher = $teacher;

            array_push($pi_list_next, $pi);
        }

        return $pi_list_next;
        
    } // end method 

    // @ Desc : 수업 관련 추가 정보를 넣어줍니다.
    public function deco_klass_n_student($klass_student=null) 
    {
        if(is_null($klass_student)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass_student)");
            return null;
        } // end if

        $ks = new KlassNStudent();

        $ks->id = $this->getNumber($klass_student, "ks_id");
        $ks->klass_id = $this->getNumber($klass_student, "ks_klass_id");
        $ks->teacher_id = $this->getNumber($klass_student, "ks_teacher_id");
        $ks->user_id = $this->getNumber($klass_student, "ks_user_id");
        $ks->status = $this->getStr($klass_student, "ks_status");
        $ks->date_created = $this->getStr($klass_student, "ks_date_created");

        $ks->date_updated = $this->getStr($klass_student, "ks_date_updated");

        $klass = new KlassCourse();

        $klass->id = $this->getNumber($klass_student, "klass_id");
        $klass->title = $this->getStr($klass_student, "klass_title");
        $klass->type = $this->getStr($klass_student, "klass_type");
        $klass->feature = $this->getStr($klass_student, "klass_feature");
        $klass->target = $this->getStr($klass_student, "klass_target");

        $klass->schedule = $this->getStr($klass_student, "klass_schedule");
        $klass->date_begin = $this->getStr($klass_student, "klass_date_begin");
        $klass->time_begin = $this->getStr($klass_student, "klass_time_begin");
        $klass->time_duration_minutes = $this->getStr($klass_student, "klass_time_duration_minutes");
        $klass->time_end = $this->getStr($klass_student, "klass_time_end");

        $klass->level = $this->getStr($klass_student, "klass_level");
        $klass->week = $this->getStr($klass_student, "klass_week");
        $klass->days = $this->getStr($klass_student, "klass_days");
        $klass->subway_line = $this->getStr($klass_student, "klass_subway_line");
        $klass->subway_station = $this->getStr($klass_student, "klass_subway_station");

        $klass->venue_title = $this->getStr($klass_student, "klass_venue_title");
        $klass->venue_telephone = $this->getStr($klass_student, "klass_venue_telephone");
        $klass->venue_address = $this->getStr($klass_student, "klass_venue_address");
        $klass->venue_road_address = $this->getStr($klass_student, "klass_venue_road_address");
        $klass->venue_latitude = $this->getStr($klass_student, "klass_venue_latitude");

        $klass->venue_longitude = $this->getStr($klass_student, "klass_venue_longitude");
        $klass->status = $this->getStr($klass_student, "klass_status");
        $klass->price = $this->getStr($klass_student, "klass_price");
        $klass->student_cnt = $this->getStr($klass_student, "klass_student_cnt");
        $klass->class_poster_url = $this->getStr($klass_student, "klass_class_poster_url");

        $klass->class_poster_url_loadable = 
        $this->CI->my_path->get_loadable_url_class_poster($klass->class_poster_url);

        $klass->class_banner_url = $this->getStr($klass_student, "klass_class_banner_url");
        $klass->date_created = $this->getStr($klass_student, "klass_date_created");
        $klass->date_updated = $this->getStr($klass_student, "klass_date_updated");

        $teacher = new Teacher();     

        $teacher->id = $this->getNumber($klass_student, "teacher_id");
        $teacher->nickname = $this->getStr($klass_student, "teacher_nickname");
        $teacher->name = $this->getStr($klass_student, "teacher_name");
        $teacher->gender = $this->getStr($klass_student, "teacher_gender");
        $teacher->birthday = $this->getStr($klass_student, "teacher_birthday");

        $teacher->thumbnail = $this->getStr($klass_student, "teacher_thumbnail");
        $teacher->status = $this->getStr($klass_student, "teacher_status");
        $teacher->permission = $this->getStr($klass_student, "teacher_permission");
        $teacher->mobile = $this->getStr($klass_student, "teacher_mobile");
        $teacher->email = $this->getStr($klass_student, "teacher_email");

        $teacher->teacher_resume = $this->getStr($klass_student, "teacher_resume");
        $teacher->teacher_greeting = $this->getStr($klass_student, "teacher_greeting");

        if(0 < $teacher->id)
        {
            $ks->teacher = $teacher; 
        } // end if        

        if(0 < $klass->id)
        {
            $klass = $this->deco_klass_extra($klass);
            $klass->teacher = $teacher;
            $ks->klass = $klass;
        } // end if

        $user = new User();

        $user->id = $this->getNumber($klass_student, "user_id");
        $user->nickname = $this->getStr($klass_student, "user_nickname");
        $user->name = $this->getStr($klass_student, "user_name");
        $user->gender = $this->getStr($klass_student, "user_gender");
        $user->birthday = $this->getStr($klass_student, "user_birthday");

        $user->thumbnail = $this->getStr($klass_student, "user_thumbnail");
        $user->status = $this->getStr($klass_student, "user_status");
        $user->permission = $this->getStr($klass_student, "user_permission");
        $user->mobile = $this->getStr($klass_student, "user_mobile");
        $user->email = $this->getStr($klass_student, "user_email");

        if(0 < $user->id)
        {
            $ks->user = $user;
        } // end if

        return $ks;

    } // end method

    // @ Desc : 출석 데이터 관련 추가 정보를 넣어줍니다.
    public function deco_attendance($src=null) 
    {
        if(is_null($src)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass_student)");
            return null;
        } // end if

        $kat = new KlassAttendance();

        $kat->id = $this->getNumber($src, "kat_id");
        $kat->klass_id = $this->getNumber($src, "kat_klass_id");
        $kat->user_id = $this->getNumber($src, "kat_user_id");
        $kat->status = $this->getStr($src, "kat_status");
        $kat->date_attend = $this->getStr($src, "kat_date_attend");

        $kat->date_created = $this->getStr($src, "kat_date_created");
        $kat->date_updated = $this->getStr($src, "kat_date_updated");

        return $kat;

    } // end method 

    public function deco_attendance_table_by_attend_date($src_list=null) 
    {
        if(empty($src_list))
        {
            return [];
        }

        $target_list = 
        $this->deco_attendance_list($src_list);

        $date_attend_prev = "";
        $target_table = [];
        $target_list_date_attend = [];
        for ($i=0; $i < count($target_list); $i++) 
        { 
            $attendance = $target_list[$i];

            if(empty($date_attend_prev)) 
            {
                $date_attend_prev = $attendance->date_attend;
            } // end if

            if($attendance->date_attend != $date_attend_prev) 
            {
                // 새로운 날짜로 변경
                array_push($target_table, $target_list_date_attend);
                $target_list_date_attend = [];
            }

            array_push($target_list_date_attend, $attendance);

            // 마지막 엘리먼트라면, 테이블에 리스트를 추가하고 종료
            if($i == (count($target_list) - 1)) 
            {
                array_push($target_table, $target_list_date_attend);
                $target_list_date_attend = [];
            } // end if
        } // end for

        return $target_table;
    } // end method    

    public function deco_attendance_list($src_list=null) 
    {
        if(empty($src_list))
        {
            return [];
        }

        $target_list = [];
        foreach ($src_list as $key => $value) {
            $target = $this->deco_attendance($value);
            array_push($target_list, $target);
        }

        return $target_list;
    } // end method

    public function deco_klass_n_student_stat_list($target_list=null)
    {

        if(empty($target_list))
        {
            return [];
        }

        $list_next = [];
        foreach($target_list as $target) 
        {
            $target_next = $this->deco_klass_n_student_stat($target);
            array_push($list_next, $target_next);
        }

        return $list_next;

    } // end method

    public function deco_klass_n_student_stat($target=null)
    {
        
        if(is_null($target)) 
        {
            return null;
        }

        $ks = new KlassNStudent();

        $ks->id = $this->getNumber($target, "ks_id");
        $ks->klass_id = $this->getNumber($target, "ks_klass_id");
        $ks->teacher_id = $this->getNumber($target, "ks_teacher_id");
        $ks->user_id = $this->getNumber($target, "ks_user_id");
        $ks->status = $this->getStr($target, "ks_status");
        $ks->date_created = $this->getStr($target, "ks_date_created");
        $ks->date_updated = $this->getStr($target, "ks_date_updated");

        $ks->attendance_total_cnt = $this->getNumber($target, "at_status_total_cnt");
        $ks->attendance_presence_cnt = $this->getNumber($target, "at_status_presence_cnt");
        $ks->attendance_ready_cnt = $this->getNumber($target, "at_status_ready_cnt");
        $ks->attendance_absence_cnt = $this->getNumber($target, "at_status_absence_cnt");

        $ks->review_cnt = $this->getNumber($target, "review_cnt");
        $ks->question_cnt = $this->getNumber($target, "question_cnt");

        $user = new User();

        $user->id = $this->getNumber($target, "user_id");
        $user->nickname = $this->getStr($target, "user_nickname");
        $user->name = $this->getStr($target, "user_name");
        $user->gender = $this->getStr($target, "user_gender");
        $user->birthday = $this->getStr($target, "user_birthday");

        $user->thumbnail = $this->getStr($target, "user_thumbnail");
        $user->status = $this->getStr($target, "user_status");
        $user->permission = $this->getStr($target, "user_permission");
        $user->mobile = $this->getStr($target, "user_mobile");
        $user->email = $this->getStr($target, "user_email");

        if(0 < $user->id)
        {
            $ks->user = $user;
        } // end if

        return $ks;

    } // end method

}