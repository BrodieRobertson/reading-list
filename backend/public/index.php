<?php
require "../bootstrap.php";
require "http_constants.php";

use src\TableGateways\IllustratorGateway;
use src\TableGateways\BookGateway;
use src\TableGateways\AuthorGateway;
use src\Controllers\Controller;

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

$requestMethod = $_SERVER["REQUEST_METHOD"];
$controller = null;

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

