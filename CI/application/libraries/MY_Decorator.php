<?php

require_once APPPATH . '/models/KlassCourse.php';
require_once APPPATH . '/models/Teacher.php';

class MY_Decorator
{
	private $CI=null;

    function __construct()
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) 
        {
            return;
        }
    }	

    // @ Desc : 수업 관련 추가 정보를 넣어줍니다.
    public function deco_klass($klass_list=null) 
    {
        $this->CI->my_tracker->add_init(__FILE__, __FUNCTION__, __LINE__);

        if(empty($klass_list)) {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$klass_list)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
            return;
        } // end if

        // $rows = $query->custom_result_object('KlassCourse');

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
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
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
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $time_begin = $klass->time_begin;
        if(empty($time_begin))
        {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$time_begin)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
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
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $class_level = $klass->level;
        if(empty($class_level))
        {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$class_level)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
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
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $class_days = $klass->days;
        if(empty($class_days))
        {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$class_days)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
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
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$days_list)");
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
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $days_list = $klass->days_list;
        if(empty($days_list))
        {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$days_list)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
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
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        $subway_line = $klass->subway_line;
        if(empty($subway_line))
        {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$subway_line)");
            return;
        } // end if

        $subway_station = $klass->subway_station;
        if(empty($subway_line))
        {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "empty(\$subway_station)");
            return;
        } // end if

        $const_map = $this->CI->my_paramchecker->get_const_map();
        if(is_null($const_map)) {
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$const_map)");
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
            $this->CI->my_tracker->add_stopped(__FILE__, __FUNCTION__, __LINE__, "is_null(\$klass)");
            return;
        } // end if

        if(!isset($klass->price)) 
        {
                return;
        }
        $klass->price_with_format = number_format($klass->price);

        return $klass;
    } 	

}