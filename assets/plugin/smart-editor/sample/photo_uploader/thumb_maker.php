<?php

class ThumbMaker{

	// before using this class
	// PLEASE CHECK GD2 library enabled in php.ini

	// ;extension=php_gd2.dll --> extension=php_gd2.dll

	// Linux
	// phpinfo() 의 gd 에 jpeg support 확인하세요. 
	// yum install php-gd

	// Directory permission
	// $ sudo chmod 766 thumbnail

	private static $THUMBNAIL_PATH="assets/images/thumbnail";
	private static $THUMBNAIL_DIR="";
	private static $THUMBNAIL_WIDTH=400;

	private static function get_thumb_dir_path() {

		if(!empty(self::$THUMBNAIL_DIR)) {
			return self::$THUMBNAIL_DIR;
		}

		$string = __FILE__;
		$pattern = '/(.+\/)assets\/.+/i';
		$replacement = '${1}' . self::$THUMBNAIL_PATH;
		self::$THUMBNAIL_DIR = preg_replace($pattern, $replacement, $string);

		return self::$THUMBNAIL_DIR;
	}

	public static function get_thumb_service_path() {

		// http://pat.im/817

		$php_filename = basename(__FILE__);
		$relative_path = preg_replace("`\/[^/]*\.php$`i", "/", $_SERVER['PHP_SELF']);

		// replace thumbnail path
		$string = $relative_path;
		$pattern = '/(.+\/)assets\/.+/i';
		$replacement = '${1}' . self::$THUMBNAIL_PATH;
		$thumbnail_path = preg_replace($pattern, $replacement, $string);

		$base_URL = ($_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://';
		$base_URL .= ($_SERVER['SERVER_PORT'] != '80') ? $_SERVER['HTTP_HOST'].':'.$_SERVER['SERVER_PORT'] : $_SERVER['HTTP_HOST'];
		$full_URL = $base_URL.$thumbnail_path;

		return $full_URL;

	}

	private static function is_thumb_dir_not_exists() {
		return !self::is_thumb_dir_exists();
	}
	private static function is_thumb_dir_exists() {
		$thumbnail_dir_path = self::get_thumb_dir_path();
		return file_exists($thumbnail_dir_path);
	}
	private static function is_thumb_dir_not_writable() {
		return !self::is_thumb_dir_writable();
	}
	private static function is_thumb_dir_writable() 
	{
		$thumbnail_dir_path = self::get_thumb_dir_path();
		return is_writable($thumbnail_dir_path);
	}
	private static function is_thumb_dir_not_valid() 
	{
		return !self::is_thumb_dir_valid();
	}
	private static function is_thumb_dir_valid() 
	{
		if(self::is_thumb_dir_not_exists()) 
		{
			return false;
		}

		if(self::is_thumb_dir_not_writable()) 
		{
			return false;
		}
		return true;
	}

	public static function is_thumb_dir_working() {

		$result = new stdClass();
		$result->SUCCESS = false;
		$result->PATH = self::get_thumb_dir_path();
		$result->REASON = "";

		$is_thumb_dir_not_exists = self::is_thumb_dir_not_exists();
		if($is_thumb_dir_not_exists) {
			$result->REASON = "thumbnail_directory_not_exists";
			return $result;
		}

		$is_thumb_dir_not_writable = self::is_thumb_dir_not_writable();
		if($is_thumb_dir_not_writable) {
			$result->REASON = "thumbnail_not_writable";
			return $result;
		}

		$result->SUCCESS = true;
		return $result;

	}

	private static function get_thumbnail_name($file_type="") {

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

	private static $IMAGE_FILE_TYPE_JPG="jpg";
	private static $IMAGE_FILE_TYPE_JPEG="jpeg";
	private static $IMAGE_FILE_TYPE_PNG="png";
	private static $IMAGE_FILE_TYPE_GIF="gif";
	private static $IMAGE_FILE_TYPE_BMP="bmp"; // TODO

	public static function has_thumbnail_with_name($thumbnail_name) {

		if(self::is_thumb_dir_not_valid()) {
			return false;
		}
		if(empty($thumbnail_name)) {
			return false;
		}
		$thumbnail_dir_path = self::get_thumb_dir_path();
		if(empty($thumbnail_dir_path)) {
			return;
		}

		// write json str file, if file exist, overwrite on it.
		$file_path = "$thumbnail_dir_path/$thumbnail_name";
		$is_not_file_exists = !file_exists($file_path);
		if($is_not_file_exists) {
			// echo "!Error! / QuizFileManager / get_quiz_file_path / \$is_not_file_exists<br/>";
			return false;
		}
		return true;
	}

	private static function is_jpg($img_url) {

		$regex = "\.jpg$"; // SCHEME
		preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

		if(!empty($m)) {
			return true;
		}
		return false;

	}

	private static function is_jpeg($img_url) {

		$regex = "\.jpeg$"; // SCHEME
		preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

		if(!empty($m)) {
			return true;
		}
		return false;

	}

	private static function is_png($img_url) {

		$regex = "\.png$"; // SCHEME
		preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

		if(!empty($m)) {
			return true;
		}
		return false;

	}

	private static function is_gif($img_url) {

		$regex = "\.gif$"; // SCHEME
		preg_match("/$regex/i", $img_url, $m, PREG_OFFSET_CAPTURE);

		if(!empty($m)) {
			return true;
		}
		return false;

	}

	private static function get_img_type($img_url="") {
		if(empty($img_url)) {
			return "";
		}

		$pattern = '/.+\.(png|jpg|jpeg|gif)$/i';
		$replacement = '${1}';
		$result = preg_replace($pattern, $replacement, $img_url);

		return $result;
	}

	private static function is_not_valid_img_type($img_url="") {
		return !self::is_valid_img_type($img_url);
	}
	private static function is_valid_img_type($img_url="") {
		if(empty($img_url)) {
			return false;
		}

		if(self::is_jpg($img_url)) {
			return true;
		} else if(self::is_jpeg($img_url)) {
			return true;
		} else if(self::is_png($img_url)) {
			return true;
		} else if(self::is_gif($img_url)) {
			return true;
		}

		return false;
	}

	public static function delete_thumbnail($thumbnail_name = "") {

		if(self::is_thumb_dir_not_valid()) {
			return false;
		}
		if(empty($thumbnail_name)) {
			return false;
		}

		$thumbnail_dir_path = self::get_thumb_dir_path();
		$file_path = $thumbnail_dir_path . "/" . $thumbnail_name;

		if(!file_exists($file_path)) {
			return false;
		}

		return unlink($file_path);
	}

	public static function make_thumbnail($img_src_url="", $image_width=-1) {

		$result = new stdClass();
		$result->error = "Congrats! No Errors.";
		$result->process = array();

		// VALIDATION - INIT
		if(self::is_thumb_dir_not_valid()) {
			$result->error = "make_thumbnail / self::is_thumb_dir_not_valid <br/>";
			return $result;
		}
		if(empty($img_src_url)) {
			$result->error = "make_thumbnail / empty(\$img_src_url) <br/>";
			return $result;
		}
		if(self::is_not_valid_img_type($img_src_url)) {
			$result->error = "make_thumbnail / self::is_not_valid_img_type <br/>";
			return $result;
		}
		$file_type = self::get_img_type($img_src_url);
		if(empty($file_type)) {
			$result->error = "make_thumbnail / empty(\$file_type) <br/>";
			return $result;
		}
		$thumbnail_name = self::get_thumbnail_name($file_type);
		if(empty($thumbnail_name)) {
			$result->error = 
			"!Error! / XogamesThumbnailManager / make_thumbnail / empty(\$thumbnail_name)<br/>";
			return $result;
		}
		$thumbnail_dir_path = self::get_thumb_dir_path();
		if(empty($thumbnail_dir_path)) {
			$result->error = 
			"!Error! / XogamesThumbnailManager / make_thumbnail / empty(\$thumbnail_dir_path)<br/>";
			return $result;
		}
		// VALIDATION - DONE

		$file_path = $thumbnail_dir_path . "/" . $thumbnail_name;
		if(!(0 < $image_width)) {
			$image_width = self::$THUMBNAIL_WIDTH;
		}

		$result_make_thumb = self::make_thumb($img_src_url, $file_path, $image_width);

		if(is_null($result_make_thumb) || $result_make_thumb->success == false) {
			return $result_make_thumb;
		}

		if(file_exists($file_path)) {
			$result->success = true;
			$result->thumbnail_name = $thumbnail_name;
			$result->thumbnail_url = self::get_thumb_service_path() . "/" . $thumbnail_name;

			return $result;
		}

		$result->success = false;
		$result->error = "No thumbnail";
		return $result;
	}

	// http://unitstep.net/blog/2009/05/05/using-curl-in-php-to-access-https-ssltls-protected-sites/
	// @ Referer : https://davidwalsh.name/create-image-thumbnail-php
	private static function make_thumb($src="", $dest="", $crop_size=-1) {

		$result = new stdClass();
		$result->error = "";

		if(self::is_thumb_dir_not_valid()) {
			$result->error = "make_thumb / self::is_thumb_dir_not_valid <br/>";
			return $result;
		}
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
		$crop_info = self::getHMatched($width, $height, $crop_size);

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

	private static function getHMatched($width="", $height="", $desired_width=-1) {
		// 가로(Horizontal) 변을 원하는 크기로 변경해서 나머지 세로 변을 선택된 가로 변과 원하는 크기의 비율로 변경해줍니다.
		// $width:$height = $new_width:$new_height;

		$new_height = round(($height*$desired_width) / $width);

		$result = new stdClass();
		$result->desired_height = $new_height;
		$result->desired_width = $desired_width;

		return $result;
	}

	private static function getShorterMatched($width="", $height="", $desired_size=-1) {
		// 짧은 쪽의 변을 원하는 크기로 변경해서 나머지 긴 변을 선택된 변과 원하는 크기의 비율로 변경해줍니다.
		$result = new stdClass();
		if($height < $width) {

			// landscape
			if($desired_size < $height) {

				$result->view_mode = "landscape";
				$desired_height = $desired_size;
				$desired_width = floor(($desired_height * $width) / $height);

				// $desired_width:$desired_height = $width:$height;

			} else {

				$desired_width = $width;
				$desired_height = $height;
			}

			$result->desired_height = $desired_height;
			$result->desired_width = $desired_width;


		} else if($width <= $height) {

			// portrait
			if($desired_size < $width) {

				$result->view_mode = "portrait";
				$desired_width = $desired_size;
				$desired_height = floor(($desired_width * $height) / $width);

			} else {

				$desired_width = $width;
				$desired_height = $height;

			}

			$result->desired_height = $desired_height;
			$result->desired_width = $desired_width;

		}

		return $result;
	}
	


} // end of class

?>
