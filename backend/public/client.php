<?php
require "../bootstrap.php";

$clientId = getenv("OKTACLIENTID");
$clientSecret = getenv("OKTASECRET");
$scope = getenv("SCOPE");
$issuer = getenv("OKTAISSUER");

// $token = obtainToken($issuer, $clientId, $clientSecret, $scope);
$token = "";

// Test requests
getAllBooks($token);
getBook($token, 1);

getAllAuthors($token);
getAuthor($token, 1);

getAllIllustrators($token);
getIllustrator($token, 1);

getAllBookAuthors($token);
getBookAuthor($token, 1);

getAllBookIllustrators($token);
getBookIllustrator($token, 1);

// End of client tests

/**
 * Obtains an authentication token
 */
function obtainToken($issuer, $clientId, $clientSecret, $scope) {
  echo "Obtaining token...";

  // Prepare the request
  $uri = $issuer . '/v1/token';
  $token = base64_encode("$clientId:$clientSecret");
  $payload = http_build_query([
    'grant_type' => 'client_credentials',
    'scope' => $scope
  ]);

  // build curl request
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $uri);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
    "Authorization: Basic $token"
  ]);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  // process and return the response
  $response = curl_exec($ch);
  $response = json_decode($response, true);
  if (!isset($response['access_token'])
      || !isset($response['token_type'])) {
      exit('failed, exiting.');
  }

  echo "success!\n";

  // here's your token to use in API requests
  return $response['token_type'] . " " . $response['access_token'];
}

/**
 * Performs a request
 */
function request($message, $uri) {
  echo $message;    
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8000/" . $uri);
  curl_setopt( $ch, CURLOPT_HTTPHEADER, [
      'Content-Type: application/json',
      // "Authorization: $token"
  ]);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $response = curl_exec($ch);

  var_dump($response);
}

/**
 * Performs a request to get all books
 */
function getAllBooks($token) {
  request("Getting all books...", "book");
}

/**
 * Performs a request to get a book
 */
function getBook($token, $id) {
  request("Getting book with id " . $id, "book/" . $id);
}

/**
 * Performs a request to get all authors
 */
function getAllAuthors($token) {
  request("Getting all authors...", "author");
}

/**
 * Performs a request to get an author
 */
function getAuthor($token, $id) {
  request("Getting author with id " . $id, "author/" . $id);
}

/**
 * Performs a request to get all illustrators
 */
function getAllIllustrators($token) {
  request("Getting all illustrators...", "illustrator");
}

/**
 * Performs a request to get an illustrator
 */
function getIllustrator($token, $id) {
  request("Getting illustrator with id " . $id, "illustrator/" . $id);
}

/**
 * Performs a request to get all book authors
 */
function getAllBookAuthors($token) {
  request("Getting all bookauthors...", "bookauthor");
}

/**
 * Performs a request to get a sub set of book authors
 */
function getBookAuthor($token, $id) {
  request("Getting a sub of book authors...", "bookauthor/" . $id);
}

/**
 * Performs a request to get all book illustrators
 */
function getAllBookIllustrators($token) {
  request("Getting all bookillustrators...", "bookillustrator");
}

/**
 * Performs a a request to get a sub set of book illustrators
 */
function getBookIllustrator($token, $id) {
  request("Getting a sub set of book illustrators...", "bookillustrator/" . $id);
}