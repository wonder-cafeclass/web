<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';

/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Users extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['list_get']['limit'] = 500; // 500 requests per hour per user/key
    }

    public function list_get()
    {
        // Users from a data store e.g. database
        $users = [
            ['id' => 1, 'name' => 'John'],
            ['id' => 2, 'name' => 'Jim'],
            ['id' => 3, 'name' => 'Jane'],
        ];

        if (!empty($users))
        {
            $response_body = [
                'status' => TRUE,
                'message' => 'Success',
                'data' => $users
            ];

            // OK (200) being the HTTP response code
            $this->set_response($response_body, REST_Controller::HTTP_OK); 
        }
        else
        {
            $response_body = [
                'status' => FALSE,
                'message' => 'User could not be found',
                'data' => $users
            ];

            // NOT_FOUND (404) being the HTTP response code
            $this->set_response($response_body, REST_Controller::HTTP_NOT_FOUND); 
        }
    }
    
    // REMOVE ME
/*
    public function users_post()
    {
        // $this->some_model->update_user( ... );
        $message = [
            'id' => 100, // Automatically generated by the model
            'name' => $this->post('name'),
            'email' => $this->post('email'),
            'message' => 'Added a resource'
        ];

        $this->set_response($message, REST_Controller::HTTP_CREATED); // CREATED (201) being the HTTP response code
    }

    public function users_delete()
    {
        $id = (int) $this->get('id');

        // Validate the id.
        if ($id <= 0)
        {
            // Set the response and exit
            $this->response(NULL, REST_Controller::HTTP_BAD_REQUEST); // BAD_REQUEST (400) being the HTTP response code
        }

        // $this->some_model->delete_something($id);
        $message = [
            'id' => $id,
            'message' => 'Deleted the resource'
        ];

        $this->set_response($message, REST_Controller::HTTP_NO_CONTENT); // NO_CONTENT (204) being the HTTP response code
    }
*/
}
