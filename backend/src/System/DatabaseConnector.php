<?php
namespace Src\System;

class DatabaseConnector {
  private $dbConnection = null;

  public function __construct() {
    $host = getenv('DB_HOST');
    $port = getenv('DB_PORT');
    $db = getenv('DB_DATABASE');
    $user = getenv('DB_USERNAME');
    $pass = getenv('DB_PASSWORD');

    try {
      $this->dbConnection = new PDO("mysql:host=$host;port=$port;charset=utf8mb4;dbname=$db", $user, $pass);
    } 
    catch (PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Gets a connection to the db
   */
  public function getConnection() {
    return $this->dbConnection;
  }
}