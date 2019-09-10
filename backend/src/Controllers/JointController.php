<?php
namespace Src\Controllers;

define("HTTP_OK", "HTTP/1.1 200 OK");
define("HTTP_CREATED", "HTTP/1.1 201 Created");
define("HTTP_UNPROCESSABLE", "HTTP/1.1 422 Unprocessable Entity");
define("HTTP_NOT_FOUND", "HTTP/1.1 404 Not Found");

class JointController {
  private $db;
  private $requestMethod;
  private $firstId;
  private $secondId;
  private $tableGateway;
  private $validator;

  public function __construct($db, $requestMethod, $firstId, $secondId, $tableGateway, $validator) {
    $this->db = $db;
    $this->requestMethod = $requestMethod;
    $this->firstId = $firstId;
    $this->secondId = $secondId;
    $this->tableGateway = $tableGateway;
    $this->validator = $validator;
  }
  
  /**
   * Processes an api request
   */
  public function processRequest() {
    switch($this->requestMethod) {
      case 'GET':
        if($this->firstId || $this->secondId) {
          $response = $this->get($this->firstId, $this->secondId);
        }
        else {
          $response = $this->getAll();
        }
        break;
      case 'POST':
        $response = $this->create();
        break;
      case 'DELETE':
        $response = $this->delete($this->firstId, $this->secondId);
        break;
      default:
        $response = $this->notFoundResponse();
        break;
    }

    header($response['status_code_header']);

    // If there is a body then echo it
    if($response['body']) {
      echo $response['body'];
    }
  }

  /**
   * Gets all the rows of a table
   */
  private function getAll() {
    $result = $this->tableGateway->getAll();
    $response['status_code_header'] = HTTP_OK;
    $response['body'] = json_encode($result);
    return $response;
  }

  /**
   * Gets a sub set of rows specified by it's ids
   */
  private function get($firstId, $secondId) {
    $result = $this->tableGateway->get($firstId, $secondId);
    if(!$result) {
      return $this->notFoundResponse();
    }

    $response['status_code_header'] = HTTP_OK;
    $response['body'] = json_encode($result);
    return $response;
  }

  /**
   * Creates a new row
   */
  private function create() {
    $input = (array) json_decode(file_get_contents('php://input'), TRUE);

    // If the row is not valid the response can't be processed
    if(!$this->validator->validate($input)) {
      return $this->unprocessableResponse();
    }

    $result = $this->tableGateway->insert($input);
    if(!$result) {
      return $this->unprocessableResponse();
    }
    $response['status_code_header'] = HTTP_CREATED;
    $response['body'] = $result;
    return $response;
  }

  /**
   * Delete a sub set of rows specified by it's ids
   */
  private function delete($firstId, $secondId) {
    $result = $this->tableGateway->get($firstId, $secondId);
    if(!$result) {
      return $this->notFoundResponse();
    }

    $result = $this->tableGateway->delete($id);
    if(!$result) {
      return $this->unprocessableResponse();
    }
    $response['status_code_header'] = HTTP_OK;
    $response['body'] = $result;
    return $response;
  }

  /**
   * Response for an unprocessable request
   */
  private function unprocessableResponse() {
    $response['status_code_header'] = HTTP_UNPROCESSABLE;
    $response['body'] = json_encode([
      'error' => 'Invalid input'
    ]);

    return $response;
  }
  /**
   * Response for a request method that can't be found
   */
  private function notFoundResponse() {
    $response['status_code_header'] = HTTP_NOT_FOUND;
    $response['body'] = null;
    return $response;
  }
}