<?php

class MY_Error
{
	public static $EVENT_FILE_NOT_EXIST="File not exist!";
	public static $EVENT_PARAM_IS_EMPTY="Param is empty!";
	public static $EVENT_PARAM_IS_NOT_VALID="Param is not valid!";
	public static $EVENT_JSON_DECODING_IS_FAILED="JSON Decoding is failed!";

	private $log_list;

	public function add($class_name="", $method_name="", $event="", $message="", $extra=null) 
	{
		if(empty($class_name)) {
			return;
		}
		if(empty($method_name)) {
			return;
		}		
		if(empty($event)) {
			return;
		}

		$log = [
			'class_name' => $class_name,
			'method_name' => $method_name,
			'event' => $event,
			'message' => $message,
			'extra' => $extra
		];

		if(is_null($this->log_list)) {
			$this->log_list = array();
		}

		array_push($this->log_list, $log);
	}

	public function get() {
		return $this->log_list;
	}

	public function hasError() {
		if(is_null($this->log_list) || empty($this->log_list)) {
			return false;
		}
		return true;
	}
}