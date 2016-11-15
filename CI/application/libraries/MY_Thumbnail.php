<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Custom Auth class
 * Check Auth in various level - Server(Production/Admin/Dev), User(Teacher/Student/Admin)
 *
 * @author    Wonder Jung, @cafeclass
 * @license   MIT
 */


class MY_Thumbnail {

	private $CI=null;
    private $curl=null;
    public $thumbnail_path="assets/images/thumbnail";
    public $thumbnail_path_user="assets/images/user";

    private $IMAGE_FILE_TYPE_JPG="jpg";
    private $IMAGE_FILE_TYPE_JPEG="jpeg";
    private $IMAGE_FILE_TYPE_PNG="png";
    private $IMAGE_FILE_TYPE_GIF="gif";

    public function __construct($params=null)
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) 
        {
            return;
        }

        if(!isset($this->CI->my_error)) 
        {
            return;
        }

        if(!isset($this->CI->my_curl)) 
        {
            return;
        }
        $this->curl = $this->CI->my_curl;

        $target_path = $this->get_thumb_dir_path_user();
        if(!is_writable($target_path))
        {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_DIR_PATH_IS_NOT_WRITABLE,
                // $message=""
                $target_path, 
                // $extra=null
                null
            );
            return;
        }
    }

    public function is_not_ok() {
        return !$this->is_ok();
    }
    public function is_ok() {
        return ($this->CI->my_error->hasError())?false:true;
    }    

    public function get_file_name_from_url($url="") 
    {
        if($this->is_not_ok()) 
        {
            return "";
        }

        if(empty($url)) 
        {
            return "";
        }

        $filename = "";
        if($this->is_jpg($url) || $this->is_jpeg($url)) 
        {
            $filename = $this->get_thumbnail_name($this->IMAGE_FILE_TYPE_JPG);
        }
        else if($this->is_png($url)) 
        {
            $filename = $this->get_thumbnail_name($this->IMAGE_FILE_TYPE_PNG);
        }
        else if($this->is_gif($url)) 
        {
            $filename = $this->get_thumbnail_name($this->IMAGE_FILE_TYPE_gif);
        }

        return $filename;
    }

    /*
    *   @ Desc : 원격 서버에 저장된 이미지를 curl로 다운로드 합니다.
    */
    public function download_image($url="")
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        if(empty($url)) 
        {
            return;
        }

        $filename = $this->get_file_name_from_url($url);
        if(empty($filename))
        {
            return;
        }

        // 저장할 파일 이름을 지정합니다.
        $thumb_dir_path = $this->get_thumb_dir_path();
        $is_success = $this->curl->download($url, $thumb_dir_path, $filename);

        return ($is_success)?"$thumb_dir_path/$filename":null;
    }

    public function resize($src="", $dest="", $crop_size=-1) 
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        $result = new stdClass();
        $result->error = "";

        if(empty($src)) {
            $result->error = "make_thumb / empty(\$src) <br/>";
            return $result;
        }
        if(!file_exists($src)) {
            $result->error = "make_thumb / !file_exists(\$src) <br/>";
            return $result; 
        }
        if(is_null($dest)) {
            $result->error = "make_thumb / is_null(\$dest) <br/>";
            return $result;
        }
        if($crop_size < 0) {
            $result->error = "make_thumb / is_null(\$crop_size < 0) <br/>";
            return $result;
        }
        $result->crop_size = $crop_size;

        // read the source image 
        $download_src_img_path = $src;
        if(self::is_jpeg($download_src_img_path) || self::is_jpg($download_src_img_path)) {
            $source_image = imagecreatefromjpeg($download_src_img_path);    
        } else if(self::is_png($download_src_img_path)) {
            $source_image = imagecreatefrompng($download_src_img_path); 
        } else if(self::is_gif($download_src_img_path)) {
            $source_image = imagecreatefromgif($download_src_img_path);
        } else {
            $result_download->success == false;
            $result->success == false;
            $result->error = "make_thumb / unsupported image type! $download_src_img_path <br/>";
            return $result;
        }

        // imagecreatefromstring
        if(is_null($source_image)) {
            $result->success == false;
            $result->error = "make_thumb / is_null(\$source_image) <br/>";
            return $result;
        }
        $width = intval(imagesx($source_image));
        $result->width = $width;
        if(!(0 <$width)) {
            $result->success == false;
            $result->error = "make_thumb / !(0 <\$width) <br/>";
            return $result;
        }
        $height = intval(imagesy($source_image));
        $result->height = $height;
        if(!(0 <$height)) {
            $result->success == false;
            $result->error = "make_thumb / !(0 <\$height) <br/>";
            return $result;
        }

        // $crop_size
        // find the "desired height" of this thumbnail, relative to the desired width  
        $desired_width = 0;
        $desired_height = 0;

        // $crop_info = $this->getShorterMatched($width, $height, $crop_size);
        // 가로 너비 기준, 원하는 사이즈로. 세로는 가로가 변경된 비율만큼 변한다.
        $crop_info = $this->getHMatched($width, $height, $crop_size);

        $desired_width = $crop_info->desired_width;
        $desired_height = $crop_info->desired_height;

        if(!(0 <$desired_width)) {
            $result->success == false;
            $result->error = "make_thumb / !(0 <\$desired_width) <br/>";
            return $result;
        }
        if(!(0 <$desired_height)) {
            $result->success == false;
            $result->error = "make_thumb / !(0 <\$desired_height) <br/>";
            return $result;
        }

         // create a new, "virtual" image 
        $virtual_image = imagecreatetruecolor($desired_width, $desired_height);
        
         // copy source image at a resized size 
        imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
        
         // create the physical thumbnail image to its destination 
        imagejpeg($virtual_image, $dest);

        $result->success = true;

        return $result;
    }
    private function getHMatched($width="", $height="", $desired_width=-1) {
        // 가로(Horizontal) 변을 원하는 크기로 변경해서 나머지 세로 변을 선택된 가로 변과 원하는 크기의 비율로 변경해줍니다.
        // $width:$height = $new_width:$new_height;

        $new_height = round(($height*$desired_width) / $width);

        $result = new stdClass();
        $result->desired_height = $new_height;
        $result->desired_width = $desired_width;

        return $result;
    }


    private function get_thumbnail_name($file_type="") {

        if(empty($file_type)) {
            return "";
        }

        // Set time zone as Seoul
        date_default_timezone_set('Asia/Seoul');

        $t = microtime(true);
        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        $date = date('Y-m-d|H|i|s');

        return $date . "|" . $micro . "." . $file_type;
    } 
    
    private function is_jpg($img_url) {

        $regex = "\.jpg$"; // SCHEME
        preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

        if(!empty($m)) {
            return true;
        }
        return false;

    }

    private function is_jpeg($img_url) {

        $regex = "\.jpeg$"; // SCHEME
        preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

        if(!empty($m)) {
            return true;
        }
        return false;

    }

    private function is_png($img_url) {

        $regex = "\.png$"; // SCHEME
        preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

        if(!empty($m)) {
            return true;
        }
        return false;

    }

    private function is_gif($img_url) {

        $regex = "\.gif$"; // SCHEME
        preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

        if(!empty($m)) {
            return true;
        }
        return false;

    }       

    private function get_thumb_path($filename="")
    {
        if(empty($filename)) 
        {
            return "";
        }

        $thumb_dir_path = $this->get_thumb_dir_path();
        if(empty($thumb_dir_path)) 
        {
            return "";
        }

        return $thumb_dir_path . "/" . $filename;
    }

    public function get_service_path($dir_path="", $filename="")
    {
        if(empty($dir_path)) 
        {
            return "";
        }
        if(empty($filename)) 
        {
            return "";
        }

        return $dir_path . "/" . $filename;
    }    

    private function get_thumb_dir_path() 
    {
        $string = __FILE__;
        $pattern = '/(.+\/)CI\/.+/i';
        $replacement = '${1}' . $this->thumbnail_path;
        $thumb_dir_path = preg_replace($pattern, $replacement, $string);

        return $thumb_dir_path;
    }

    public function get_thumb_dir_path_user() 
    {
        if($this->is_not_ok()) 
        {
            return "";
        }

        $string = __FILE__;
        $pattern = '/(.+\/)CI\/.+/i';
        $replacement = '${1}' . $this->thumbnail_path_user;
        $thumb_dir_path = preg_replace($pattern, $replacement, $string);

        return $thumb_dir_path;
    }

}