<?php
namespace src\Controller;

require '../http_constants.php';

class Controller {
  private $db;
  private $requestMethod;
  private $id;
  private $tableGateway;

  public function __construct($db, $requestMethod, $id, $tableGateway) {
    $this->db = $db;
    $this->requestMethod = $requestMethod;
    $this->id = $id;
    $this->tableGateway = $tableGateway;
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
        $response = $this->delete($this-id);
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
    if(!$this->validateInput($input)) {
      return $this->unprocessableResponse();
    }

    $this->tableGateway->insert($input);
    $response['status_code_header'] = HTTP_CREATED;
    $response['body'] = null;
    return $response;
  }

  /**
   * Updates a row specified by it's id
   */
  private function update($id) {
    $result = $this->tableGateway->find($id);
    if (!$result) {
      return $this->notFoundResponse();
    }

    $input = (array) json_decode(file_get_contents('php://input'), TRUE);

    // If the row is not valid the response can't be processed
    if(!$this->validateInput($input)) {
      return $this->unprocessableResponse();
    }

    $this->tableGateway->update($id, $input);
    $response['status_code_header'] = HTTP_OK;
    $response['body'] = null;
    return $response;
  }

  /**
   * Deletes a row specified by it's id
   */
  private function delete($id) {
    $result = $this->tableGateway->find($id);
    if(!$result) {
        return $this->notFoundResponse();
    }

    $this->tableGateway->delete($id);
    $response['status_code_header'] = HTTP_OK;
    $response['body'] = null;
    return $response;
  }

  /**
   * Validates a row
   */
  private function validateInput($input) {
    if(!isset($input['name'])) {
      return false;
    }

    return true;
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