<?php

class MY_Error
{
	public static $EVENT_FILE_NOT_EXIST="File not exist!";
	public static $EVENT_INSTANCE_NOT_EXIST="instance not exist!";
	public static $EVENT_PARAM_IS_EMPTY="Param is empty!";
	public static $EVENT_PARAM_IS_NOT_VALID="Param is not valid!";
	public static $EVENT_DIR_PATH_IS_NOT_WRITABLE="Dir path is not writable!";
	public static $EVENT_JSON_DECODING_IS_FAILED="JSON Decoding is failed!";
	public static $EVENT_UNKNOWN="Unknown error has been occured!";

	private $log_list;

	private $class_name_prev="";
	private $method_name_prev="";
	private $event_name_prev="";
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

		if($this->class_name_prev === $class_name)
		{
			$this->class_name_prev = $class_name;
		}
		if($this->method_name_prev = $method_name)
		{
			$this->method_name_prev = $method_name;
		}
		if($this->event_name_prev = $event)
		{
			$this->event_name_prev = $event;
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
	public function redo($event="", $message="", $extra=null)
	{
		$this->add($this->class_name_prev, $this->method_name_prev, $event, $message, $extra);
	}
	public function remessage($message="", $extra=null)
	{
		$this->add($this->class_name_prev, $this->method_name_prev, $this->event_name_prev, $message, $extra);	
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