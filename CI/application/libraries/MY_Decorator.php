<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . '/models/KlassCourse.php';
require_once APPPATH . '/models/Teacher.php';
require_once APPPATH . '/models/KlassSubwayLine.php';
require_once APPPATH . '/models/KlassSubwayStation.php';
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










    // @ Desc : 수업 관련 추가 정보를 넣어줍니다.
    public function deco_klass($klass_list=null) 
    {
        if(empty($klass_list)) {
            $this->add_track_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$klass_list)");
            return;
        } // end if

        $klass_list_next = array();
        foreach ($klass_list as $klass)
        {
            // join으로 가져온 klass와 teacher의 정보를 나눕니다.

            $klassCourse = new KlassCourse();
            $klassCourse->id = intval($klass->klass_id);
            $klassCourse->title = $klass->klass_title;
            $klassCourse->desc = $klass->klass_desc;
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
            $klassCourse = $this->get_class_poster_img_url($klassCourse);
            $klassCourse = $this->get_time_begin_img_url($klassCourse);
            $klassCourse = $this->get_level_img_url($klassCourse);
            $klassCourse = $this->get_days_list($klassCourse);
            $klassCourse = $this->get_days_img_url($klassCourse);
            $klassCourse = $this->get_subway_station_img_url($klassCourse);
            $klassCourse = $this->get_price_with_format($klassCourse);
            
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

}