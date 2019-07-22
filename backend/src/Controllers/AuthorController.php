<?php
namespace src\Controller;

require '../http_constants.php';

use src\TableGateways\AuthorGateway;

class AuthorController {
  private $db;
  private $requestMethod;
  private $id;

  private $authorGateway;

  public function __construct($db, $requestMethod, $id) {
    $this->db = $db;
    $this->requestMethod = $requestMethod;
    $this->id = $id;

    $this->personGateway = new AuthorGateway($db);
  }

  /**
   * Processes an api request
   */
  public function processRequest() {
    switch($this->requestMethod) {
      case 'GET':
        if($this->id) {
          $response = $this->getAuthor($this->id);
        }
        else {
          $response = $this->getAllAuthors();
        }
        break;
      case 'POST':
        $response = $this->createAuthor();
        break;
      case 'PUT':
        $response = $this->updateAuthor($this->id);
        break;
      case 'DELETE':
        $response = $this->deleteAuthor($this-id);
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
   * Gets all the authors
   */
  private function getAllAuthors() {
    $result = $this->authorGateway->getAllAuthors();
    $response['status_code_header'] = HTTP_OK;
    $response['body'] = json_encode($result);
    return $response;
  }

  /**
   * Gets an author specified by it's id
   */
  private function getAuthor($id) {
    $result = $this->authorGateway->find($id);
      if(!$result) {
        return $this->notFoundResponse();
      }

      $response['status_code_header'] = HTTP_OK;
      $response['body'] = json_encode($result);
      return $response;
  }

  /**
   * Creates a new author
   */
  private function createAuthor() {
    $input = (array) json_decode(file_get_contents('php://input'), TRUE);

    // If the author is not valid the response can't be processed
    if(!$this->validateAuthor($input)) {
      return $this->unprocessableResponse();
    }

    $this->authorGateway->insert($input);
    $response['status_code_header'] = HTTP_CREATED;
    $response['body'] = null;
    return $response;
  }

  /**
   * Updates an author specified by it's id
   */
  private function updateAuthor($id) {
    $result = $this->authorGateway->find($id);
    if (!$result) {
      return $this->notFoundResponse();
    }

    $input = (array) json_decode(file_get_contents('php://input'), TRUE);

    // If the author is not valid the response can't be processed
    if(!$this->validateAuthor($input)) {
      return $this->unprocessableResponse();
    }

    $this->authorGateway->update($id, $input);
    $response['status_code_header'] = HTTP_OK;
    $response['body'] = null;
    return $response;
  }

  /**
   * Deletes an author specified by it's id
   */
  private function deleteAuthor($id) {
    $result = $this->authorGateway->find($id);
    if(!$result) {
        return $this->notFoundResponse();
    }

    $this->authorGateway->delete($id);
    $response['status_code_header'] = HTTP_OK;
    $response['body'] = null;
    return $response;
  }

  /**
   * Validates an author
   */
  private function validateAuthor($input) {
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
   * Response for a response that can't be found 
   */
  private function notFoundResponse() {
    $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
    $response['body'] = null;
    return $response;
  }
}