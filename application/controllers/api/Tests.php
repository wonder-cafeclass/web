<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';

class Tests extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['list_get']['limit'] = 500; // 500 requests per hour per user/key

        // init database
        $this->load->database();

        // init unit test
        $this->load->library('unit_test');

        // init param checker
        $this->load->library('paramChecker');
    }

    // Condition tags which Code Igniter 3 supports officially 
    private $is_object="is_object";
    private $is_string="is_string";
    private $is_bool="is_bool";
    private $is_true="is_true";
    private $is_false="is_false";
    private $is_int="is_int";
    private $is_numeric="is_numeric";
    private $is_float="is_float";
    private $is_double="is_double";
    private $is_array="is_array";
    private $is_null="is_null";
    private $is_resource="is_resource";

    private function run_unit_test($test=null, $expected_result="", $test_name="", $result_list=null, $test_raw=null) {

        if(is_null($this->unit)) {
            return;
        }

        $this->unit->run($test, $expected_result, $test_name);
        // $result = $this->unit->result()["0"];
        $result = $this->unit->result();
        $last_idx = (count($result) - 1);
        $last_result = $result[$last_idx];

        // custom data
        $last_result["Expected Result"] = $expected_result;
        $last_result["Received Result"] = $test;
        $last_result["Test - Received test name"] = $test_name;

        if(!is_null($test_raw)) {
            $last_result["Test Raw"] = $test_raw;            
        }

        if(is_null($result_list)) {
            $result_list = array();
        }

        if(strcmp($last_result["Result"], "Failed") == 0) {
            // 테스트가 실패한 경우에만 배열에 추가.
            if(is_array($result_list) && !is_null($result_list)) {
                array_push($result_list, $last_result);
            }
        }

        return $result_list;
    }

    // @Example : http://dev.cafeclass.kr/index.php/api/tests/paramcheck
    private function paramcheck_table_user_column_id($result_list=null) {

        if(is_null($result_list)) {
            $result_list = array();
        }

        $test_name = 'User id test -3';
        $test_output = $this->paramchecker->is_ok("user_id", -3);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = 'User id test -2';
        $test_output = $this->paramchecker->is_ok("user_id", -2);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = 'User id test -1';
        $test_output = $this->paramchecker->is_ok("user_id", -1);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        $test_name = 'User id test 0';
        $test_output = $this->paramchecker->is_ok("user_id", 0);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test 1';
        $test_output = $this->paramchecker->is_ok("user_id", 1);
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test 2';
        $test_output = $this->paramchecker->is_ok("user_id", 2);
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test 3';
        $test_output = $this->paramchecker->is_ok("user_id", 3);
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test 4';
        $test_output = $this->paramchecker->is_ok("user_id", 4);
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test PHP_INT_MAX - 4';
        $test_output = $this->paramchecker->is_ok("user_id", PHP_INT_MAX - 4);
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test PHP_INT_MAX - 3';
        $test_output = $this->paramchecker->is_ok("user_id", PHP_INT_MAX - 3);
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test PHP_INT_MAX - 2';
        $test_output = $this->paramchecker->is_ok("user_id", PHP_INT_MAX - 2);
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test PHP_INT_MAX - 1';
        $test_output = $this->paramchecker->is_ok("user_id", PHP_INT_MAX - 1);
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test PHP_INT_MAX';
        $test_output = $this->paramchecker->is_ok("user_id", PHP_INT_MAX);
        $test = $test_output["success"];
        $expected_result = true; // CORRECT
        // $expected_result = false; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test PHP_INT_MAX + 1';
        $test_output = $this->paramchecker->is_ok("user_id", PHP_INT_MAX + 1);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test PHP_INT_MAX + 2';
        $test_output = $this->paramchecker->is_ok("user_id", PHP_INT_MAX + 2);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test PHP_INT_MAX + 3';
        $test_output = $this->paramchecker->is_ok("user_id", PHP_INT_MAX + 3);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);

        $test_name = 'User id test PHP_INT_MAX + 4';
        $test_output = $this->paramchecker->is_ok("user_id", PHP_INT_MAX + 4);
        $test = $test_output["success"];
        $expected_result = false; // CORRECT
        // $expected_result = true; // WRONG
        $result_list = $this->run_unit_test($test, $expected_result, $test_name, $result_list, $test_output);        

        return $result_list;
    }

    public function paramcheck_get()
    {
        $result_list = array();

        // table user - column id
        $result_list = $this->paramcheck_table_user_column_id($result_list);

        // $this->set_response($result_list, REST_Controller::HTTP_OK);
        $this->set_response($result_list, REST_Controller::HTTP_OK);
    }

}
