<?php
require "../bootstrap.php";
require "http_constants.php";

use src\TableGateways\IllustratorGateway;
use src\TableGateways\BookGateway;
use src\TableGateways\AuthorGateway;
use src\Controllers\Controller;
use \Okta\JwtVerifier\JwtVerifierBuilder;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri );

// the user id is, of course, optional and must be a number
$userId = null;
if (isset($uri[2])) {
    $id = $uri[2];
}

// AUthenticate the request with okta
if(!authenticate()) {
  header(HTTP_UNAUTHORIZED);
  exit("Unauthorized");
}

$requestMethod = $_SERVER["REQUEST_METHOD"];

// pass the request method and user ID to the selected controller and process the HTTP request
switch($uri[1]) {
  case "book":
    $controller = new Controller($dbConnection, $requestMethod, $id, new BookGateway());
    break;
  case "author":
    $author = new Controller($dbConnection, $requestMethod, $id, new AuthorGateway());
    break;
  case "illustrator":
    $controller = new Controller($dbConnection, $requestMethod, $id, new IllustratorGateway());
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