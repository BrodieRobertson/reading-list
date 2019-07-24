<?php
require 'bootstrap.php';

$statement = <<<SQL_QUERY
  DROP TABLE IF EXISTS bookauthor;
  DROP TABLE IF EXISTS bookillustrator;
  DROP TABLE IF EXISTS author;
  DROP TABLE IF EXISTS illustrator;
  DROP TABLE IF EXISTS book;
SQL_QUERY;

try {
  $deleteTable = $dbConnection->exec($statement);
  echo "Success!\n";
} 
catch (\PDOException $e) {
  exit($e->getMessage());
}