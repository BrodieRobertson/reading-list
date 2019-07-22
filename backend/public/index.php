<?php
require "../bootstrap.php";

use src\Controller\AuthorController;
use src\Controller\IllustratorController;
use src\Controller\BookController;

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
    $userId = (int) $uri[2];
}

$requestMethod = $_SERVER["REQUEST_METHOD"];
$controller = null;

// pass the request method and user ID to the selected controller and process the HTTP request
switch($uri[1]) {
  case "book":
    $controller = new BookController($dbConnection, $requestMethod, $userId);
    break;
  case "author":
    $author = new AuthorController($dbConnection, $requestMethod, $userId);
    break;
  case "illustrator":
    $controller = new IllustratorController($dbConnection, $requestMethod, $userId);
    break;
  default:
    header("HTTP/1.1 404 Not Found");
    exit();
}

$controller->processRequest();

