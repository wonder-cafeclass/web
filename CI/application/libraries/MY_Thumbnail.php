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
    private $my_path=null;
    public $download_path="assets/images/download";
    public $thumbnail_path_user="assets/images/user";

    public $IMAGE_FILE_TYPE_JPG="jpg";
    public $IMAGE_FILE_TYPE_JPEG="jpeg";
    public $IMAGE_FILE_TYPE_PNG="png";
    public $IMAGE_FILE_TYPE_GIF="gif";

    public function __construct($params=null)
    {
        // get singleton object.
        $this->CI =& get_instance();
        if(!isset($this->CI)) 
        {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_INSTANCE_NOT_EXIST,
                // $message=""
                "\$this->CI", 
                // $extra=null
                null
            );            
            return;
        }

        if(!isset($this->CI->my_error)) 
        {
            return;
        }

        if(!isset($this->CI->my_curl)) 
        {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_INSTANCE_NOT_EXIST,
                // $message=""
                "\$this->CI->my_curl",
                // $extra=null
                null
            );
            return;
        }
        $this->curl = $this->CI->my_curl;

        if(!isset($this->CI->my_path)) 
        {
            $this->CI->my_error->add(
                // $class_name=""
                static::class,
                // $method_name=""
                __FUNCTION__,
                // $event=""
                MY_Error::$EVENT_INSTANCE_NOT_EXIST,
                // $message=""
                "\$this->CI->my_path",
                // $extra=null
                null
            );
            return;
        }
        $this->my_path = $this->CI->my_path;


        $target_path = $this->my_path->get_path_download(__FILE__);
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

        $target_path = $this->my_path->get_path_user_thumb(__FILE__);
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

    private function addError($method_name="", $event="", $message="") 
    {
        $this->CI->my_error->add(
            // $class_name=""
            static::class,
            // $method_name=""
            $method_name,
            // $event=""
            $event,
            // $message=""
            $message,
            // $extra=null
            null
        );
    }

    public function is_not_ok() {
        return !$this->is_ok();
    }
    public function is_ok() {
        return ($this->CI->my_error->hasError())?false:true;
    }    

    public function get_file_name_from_uri($url="") 
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
    public function download_image($url="", $filename="")
    {
        if($this->is_not_ok()) 
        {
            return;
        }
        if(empty($url)) 
        {
            return;
        }
        if(empty($filename))
        {
            $filename = $this->get_file_name_from_uri($url);
        }
        if(empty($filename))
        {
            return;
        }

        // 저장할 파일 이름을 지정합니다.
        $thumb_dir_path = $this->my_path->get_path_download(__FILE__);
        $is_success = $this->curl->download($url, $thumb_dir_path, $filename);

        return ($is_success)?"$thumb_dir_path/$filename":null;
    }

    private function get_source_image($download_src_img_path=null) {

        if(is_null($download_src_img_path)) 
        {
            return null;
        }

        // read the source image 
        $source_image = null;
        if( self::is_jpeg($download_src_img_path) || 
            self::is_jpg($download_src_img_path)) 
        {
            $source_image = imagecreatefromjpeg($download_src_img_path);    
        } 
        else if(self::is_png($download_src_img_path)) 
        {
            $source_image = imagecreatefrompng($download_src_img_path); 
        } 
        else if(self::is_gif($download_src_img_path)) 
        {
            $source_image = imagecreatefromgif($download_src_img_path);
        }

        return $source_image;         
    }

    public function resize_width_height($src_uri="", $dest_dir="", $desired_width=-1, $desired_height=-1) 
    {
        if($this->is_not_ok()) 
        {
            return;
        }

        $result = [];
        $result["error"] = "";
        $result["params"] =
        array(
            "src_uri"=>$src_uri,
            "dest_dir"=>$dest_dir,
            "desired_width"=>$desired_width,
            "desired_height"=>$desired_height
        );

        if(empty($src_uri)) {
            $result["error"] 
            = "resize_width_height / empty(\$src_uri)";
            return $result;
        }
        if(!file_exists($src_uri)) {
            $result["error"]
            = "resize_width_height / !file_exists(\$src_uri)";
            return $result; 
        }
        if(is_null($dest_dir)) {
            $result["error"]
            = "resize_width_height / is_null(\$dest_dir)";
            return $result;
        }
        if(!(0 < $desired_width) && !(0 < $desired_height)) {
            $result["success"] = false;
            $result["error"] 
            = "resize_width_height / !(0 <\$desired_width) && !(0 < \$desired_height)";
            return $result;
        }
        if(!(0 < $desired_width)) {
            $result["success"] = false;
            $result["error"] 
            = "resize_width_height / !(0 <\$desired_width)";
            return $result;
        }
        // 등록할 파일 이름을 가져옵니다.
        $new_file_name = $this->get_file_name_from_uri($src_uri);
        if(empty($new_file_name)) {
            $result["success"] = false;
            $result["error"] 
            = "empty(\$new_file_name) <br/>";
            return $result;
        }
        // 등록할 uri를 만듭니다.
        $dest_dir = 
        $this->my_path->get_path_img_dir(__FILE__, $dest_dir);
        if(!is_writeable($dest_dir)) {
            $result["error"]
            = "resize_width_height / !is_writeable(\$dest_dir) <br/>";
            return $result;
        }
        $new_file_uri = "$dest_dir/$new_file_name";

        // 이미지 객체를 만듭니다.
        $source_image = $this->get_source_image($src_uri);
        if(is_null($source_image)) {
            $result["success"] = false;
            $result["error"]
            = "resize_width_height / is_null(\$source_image) <br/>";
            return $result;
        }
        $width = intval(imagesx($source_image));
        $result->width = $width;
        if(!(0 <$width)) {
            $result["success"] = false;
            $result["error"]
            = "resize_width_height / !(0 <\$width) <br/>";
            return $result;
        }
        $height = intval(imagesy($source_image));
        $result->height = $height;
        if(!(0 <$height)) {
            $result["success"] = false;
            $result["error"]
            = "resize_width_height / !(0 <\$height) <br/>";
            return $result;
        }

        // $desired_width가 유효, $desired_height는 유효하지 않음. 
        // 입력한 이미지의 비율로 $desired_height를 계산함. 
        // 가로 너비 기준, 원하는 사이즈로. 세로는 가로가 변경된 비율만큼 변한다.
        if((0 < $desired_width) && !(0 < $desired_height)) 
        {
            $crop_info = 
            $this->getHMatched($width, $height, $desired_width);
            $desired_height = 
            $crop_info->desired_height;
        }
        $result["params"]["desired_height"] = $desired_height;

         // create a new, "virtual" image 
        $virtual_image = imagecreatetruecolor($desired_width, $desired_height);
        
         // copy source image at a resized size 
        imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
        
         // create the physical thumbnail image to its destination 
        imagejpeg($virtual_image, $new_file_uri);

        // 임시 저장한 섬네일을 지웁니다.
        $this->delete_thumbnail($src_uri); 

        $result["success"] = true;
        $result["thumbnail"] = $new_file_name;

        return $result;
    } // end method

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


    public function get_thumbnail_name($file_type="") {

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

        $regex = "\.jpg"; // SCHEME
        preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

        if(!empty($m)) {
            return true;
        }
        return false;

    }

    private function is_jpeg($img_url) {

        $regex = "\.jpeg"; // SCHEME
        preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

        if(!empty($m)) {
            return true;
        }
        return false;

    }

    private function is_png($img_url) {

        $regex = "\.png"; // SCHEME
        preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

        if(!empty($m)) {
            return true;
        }
        return false;

    }

    private function is_gif($img_url) {

        $regex = "\.gif"; // SCHEME
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

        $thumb_dir_path = $this->my_path->get_path_download(__FILE__);
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



    public function delete_thumbnail_klass_poster($thumbnail="") 
    {
        if(empty($thumbnail)) 
        {
            return false;
        }

        $path_thumbnail_klass_poster = $this->get_path_thumbnail_klass_poster($thumbnail);

        return $this->delete_thumbnail($path_thumbnail_klass_poster);
    }
    public function get_path_thumbnail_klass_poster($thumbnail="")
    {
        if(empty($thumbnail)) 
        {
            return "";
        }
        $path_class_banner = $this->CI->my_path->get_path_class_poster(__FILE__);

        return $path_class_banner . "/" . $thumbnail;
    }


    public function delete_thumbnail_klass_banner($thumbnail="") 
    {
        if(empty($thumbnail)) 
        {
            return false;
        }

        $path_thumbnail_klass_banner = $this->get_path_thumbnail_klass_banner($thumbnail);

        return $this->delete_thumbnail($path_thumbnail_klass_banner);
    }
    public function get_path_thumbnail_klass_banner($thumbnail="")
    {
        if(empty($thumbnail)) 
        {
            return "";
        }
        $path_class_banner = $this->CI->my_path->get_path_class_banner(__FILE__);

        return $path_class_banner . $thumbnail;
    }

    /*
    *   @ Desc : 임시 섬네일을 지웁니다.
    */
    private function delete_thumbnail($file_path = "") {

        if(empty($file_path))
        {
            return;
        }
        if(!file_exists($file_path)) 
        {
            return;
        }
        if(!is_writable($file_path)) 
        {
            return;
        }

        return unlink($file_path);
    } 

    /*
    *   @ Desc : 서버 내부의 이미지를 가져와 유저 프로필 이미지크기로 변경, 유저 프로필 디렉토리에 저장합니다. 원본은 지웁니다.
    */
    public function resize_user_thumbnail($inner_image_uri="")
    {
        if(empty($inner_image_uri))
        {
            $this->addError(
                // $method_name="", 
                __FUNCTION__,
                // $event="", 
                MY_Error::$EVENT_PARAM_IS_EMPTY,
                // $message=""
                "User thumbnail resizing failed! / \$inner_image_uri is not valid!"
            );
            return;
        }
        if(!is_writable($inner_image_uri))
        {
            $this->addError(
                // $method_name="", 
                __FUNCTION__,
                // $event="", 
                MY_Error::$EVENT_FILE_WRITING_FAILED,
                // $message=""
                "User thumbnail resizing failed! / \$inner_image_uri is not writable!"
            );            
            return;
        }

        $file_name = $this->get_file_name_from_uri($inner_image_uri);
        $file_path = $this->my_path->get_path_user_thumb(__FILE__) . "/" . $file_name;

        $output = 
        $this->resize(
            // $src="", 
            $inner_image_uri,
            // $dest="", 
            $file_path,
            // $crop_size=-1
            150
        );

        $thumbnail_url = "";
        if(isset($output) && isset($output->success) && $output->success) 
        {
            $thumbnail_url = $file_name;
        }
        else
        {
            // 섬네일 만들기에 실패했습니다.
            // Error Log를 기록합니다.
            $this->addError(
                // $method_name="", 
                __FUNCTION__,
                // $event="", 
                MY_Error::$EVENT_FILE_WRITING_FAILED,
                // $message=""
                "User thumbnail resizing failed! / \$inner_image_uri : $inner_image_uri"
            );            
        }

        // 임시 저장한 섬네일을 지웁니다.
        $this->delete_thumbnail($inner_image_uri); 
        
        return $thumbnail_url;
    }   

    /*
    *   @ Desc : 유저 섬네일을 만듭니다.
    */
    public function get_user_thumbnail($remote_image_url="")
    {   
        // 외부 서버의 이미지를 다운로드, 임시로 저장합니다.
        $temp_image_uri = $this->download_image($remote_image_url);

        if(empty($temp_image_uri))
        {
            // Error Log - wonder.jung
            $this->addError(
                // $method_name="", 
                __FUNCTION__,
                // $event="", 
                MY_Error::$EVENT_DOWNLOAD_FAILED,
                // $message=""
                "User thumbnail downloading failed! / \$remote_image_url : $remote_image_url / \$temp_image_uri : $temp_image_uri"
            );

            // 섬네일 다운로드에 실패했습니다.
            return "";
        }

        // 섬네일 다운로드에 성공!
        // 서비스 정책에 맞게 resize 합니다.
        // 유저 섬네일은 150x150.
        return $this->resize_user_thumbnail($temp_image_uri);

    }

}