<?php
require "../bootstrap.php";

use Src\TableGateways\IllustratorGateway;
use Src\TableGateways\BookGateway;
use Src\TableGateways\AuthorGateway;
use Src\TableGateways\BookAuthorGateway;
use Src\TableGateways\BookIllustratorGateway;

use Src\Validators\IllustratorValidator;
use Src\Validators\BookValidator;
use Src\Validators\AuthorValidator;
use Src\Validators\BookAuthorValidator;
use Src\Validators\BookIllustratorValidator;

use Src\Controllers\Controller;
use Src\Controllers\JointController;
use \Okta\JwtVerifier\JwtVerifierBuilder;

define("HTTP_UNAUTHORIZED", "HTTP/1.1 401 Unauthorized");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri );

// The element id is optional
$id = null;
if (isset($uri[2])) {
    $id = $uri[2];
}

// Authenticate the request with okta
// if(!authenticate()) {
//   header(HTTP_UNAUTHORIZED);
//   exit("Unauthorized");
// }

$requestMethod = $_SERVER["REQUEST_METHOD"];
$controller = null;
// pass the request method and user ID to the selected controller and process the HTTP request
switch($uri[1]) {
  case "book":
    $controller = new Controller($dbConnection, $requestMethod, $id, new BookGateway($dbConnection), new BookValidator());
    break;
  case "author":
    $controller = new Controller($dbConnection, $requestMethod, $id, new AuthorGateway($dbConnection), new AuthorValidator());
    break;
  case "illustrator":
    $controller = new Controller($dbConnection, $requestMethod, $id, new IllustratorGateway($dbConnection), new IllustratorValidator());
    break;
  case "bookillustrator":
    $controller = new JointController($dbConnection, $requestMethod, $id, null, new BookIllustratorGateway($dbConnection), new BookIllustratorValidator());
    break;
  case "bookauthor":
    $controller = new JointController($dbConnection, $requestMethod, $id, null, new BookAuthorGateway($dbConnection), new BookAuthorValidator());
    break;
  default:
    header(HTTP_NOT_FOUND);
    exit();
}

$controller->processRequest();

/**
 * Authenticate a request with OKTA
 */
function authenticate() {
  try {
    switch(true) {
      case array_key_exists('HTTP_AUTHORIZATION', $_SERVER) :
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        break;
      case array_key_exists('Authorization', $_SERVER) :
        $authHeader = $_SERVER['Authorization'];
        break;
      default :
        $authHeader = null;
        break;
      }

      preg_match('/Bearer\s(\S+)/', $authHeader, $matches);

      if(!isset($matches[1])) {
          throw new Exception('No Bearer Token');
      }

      $jwtVerifier = (new JwtVerifierBuilder())
        ->setIssuer(getenv('OKTAISSUER'))
        ->setAudience(getenv('OKTAAUDIENCE'))
        ->setClientId(getenv('OKTACLIENTID'))
        ->build();
      return $jwtVerifier->verify($matches[1]);
    }
    catch (Exception $e) {
        return false;
    }
}
