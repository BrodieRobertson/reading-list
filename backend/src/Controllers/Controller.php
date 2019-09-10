<?php
namespace Src\Controllers;

define("HTTP_OK", "HTTP/1.1 200 OK");
define("HTTP_CREATED", "HTTP/1.1 201 Created");
define("HTTP_UNPROCESSABLE", "HTTP/1.1 422 Unprocessable Entity");
define("HTTP_NOT_FOUND", "HTTP/1.1 404 Not Found");

class Controller {
  private $db;
  private $requestMethod;
  private $id;
  private $tableGateway;
  private $validator;

  public function __construct($db, $requestMethod, $id, $tableGateway, $validator) {
    $this->db = $db;
    $this->requestMethod = $requestMethod;
    $this->id = $id;
    $this->tableGateway = $tableGateway;
    $this->validator = $validator;
  }

  /**
   * Processes an api request
   */
  public function processRequest() {
    switch($this->requestMethod) {
      case 'GET':
        if($this->id) {
          $response = $this->get($this->id);
        }
        else {
          $response = $this->getAll();
        }
        break;
      case 'POST':
        $response = $this->create();
        break;
      case 'PUT':
        $response = $this->update($this->id);
        break;
      case 'DELETE':
        $response = $this->delete($this->id);
        break;
      case 'OPTIONS':
        break;
      default:
        $response = $this->notFoundResponse();
        break;
    }

    $myfile = fopen("log.txt", "w") or die("Unable to open file!");
    fwrite($myfile, print_r($response, true));
    fclose($myfile);
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
   * Gets a row specified by it's id
   */
  private function get($id) {
    $result = $this->tableGateway->get($id);
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
    if (!$result) {
      return $this->unprocessableResponse();
    }

    $response['status_code_header'] = HTTP_CREATED;
    $response['body'] = json_encode($result);
    return $response;
  }

  /**
   * Updates a row specified by it's id
   */
  private function update($id) {
    $result = $this->tableGateway->get($id);
    if(!$result) {
      return $this->notFoundResponse();
    }

    $input = (array) json_decode(file_get_contents('php://input'), TRUE);

    // If the row is not valid the response can't be processed
    if(!$this->validator->validate($input)) {
      return $this->unprocessableResponse();
    }

    $result = $this->tableGateway->update($id, $input);
    if(!$result) {
      return $this->unprocessableResponse();
    }
    
    $response['status_code_header'] = HTTP_OK;
    $response['body'] = $result;
    return $response;
  }

  /**
   * Deletes a row specified by it's id
   */
  private function delete($id) {
    $result = $this->tableGateway->get($id);
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