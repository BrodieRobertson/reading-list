<?php
require 'bootstrap.php';

$statements = array (
  "
    CREATE TABLE author (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      PRIMARY KEY (id)
    ) ENGINE='INNODB';
  ",
  "
    INSERT INTO author (name) VALUES
      ('John'),
      ('Smith'),
      ('Tim'),
      ('Bob');
  ",
  "
    CREATE TABLE illustrator (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      PRIMARY KEY (id)
    ) ENGINE='INNODB';
  ",
  "
    INSERT INTO illustrator (name) VALUES
      ('James'),
      ('Joey'),
      ('Thomas'),
      ('Kyle');
  ",
  "
    CREATE TABLE book (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      image VARCHAR(100),
      pages INT NOT NULL,
      isbn VARCHAR(25),
      readingstate INT NOT NULL,
      completed BIT(1) NOT NULL,
      owned BIT(1) NOT NULL,
      PRIMARY KEY (id)
    ) ENGINE='INNODB';
  ",
  "
    INSERT INTO book (name, image, pages, isbn, readingstate, completed, owned) VALUES
      ('book1', NULL, 100, '8501234567897', 0, 0, 1),
      ('book2', NULL, 100, '9221234567123', 1, 0, 0),
      ('book3', NULL, 100, '3071234567875', 2, 1, 0),
      ('book4', NULL, 100, '4051234567534', 0, 0, 1),
      ('book5', NULL, 100, '1021234567901', 2, 0, 0);
  ",
  "
    CREATE TABLE bookauthor (
      bookid INT NOT NULL,
      authorid INT NOT NULL,
      PRIMARY KEY(bookid, authorid),
      FOREIGN KEY(bookid) REFERENCES book(id),
      FOREIGN KEY(authorid) REFERENCES author(id)
    ) ENGINE='INNODB';
  ",
  "
    INSERT INTO bookauthor (bookid, authorid) VALUES
      (3, 1),
      (3, 3),
      (1, 1),
      (2, 3),
      (2, 1),
      (2, 2),
      (3, 2);
  ",
  "
    CREATE TABLE bookillustrator (
      bookid INT NOT NULL,
      illustratorid INT NOT NULL,
      PRIMARY KEY(bookid, illustratorid),
      FOREIGN KEY(bookid) REFERENCES book(id),
      FOREIGN KEY(illustratorid) REFERENCES illustrator(id)
    ) ENGINE='INNODB';
  ",
  "
    INSERT INTO bookillustrator (bookid, illustratorid) VALUES
      (1, 1),
      (1, 2),
      (3, 2),
      (2, 1),
      (2, 2),
      (2, 3);
  "
);
$statement = <<<SQL_QUERY


SQL_QUERY;

try {
  for($i = 0; $i < count($statements); $i++) {
    $createTable = $dbConnection->exec($statements[$i]);
  }
  echo "Success!\n";
} 
catch (\PDOException $e) {
  exit($e->getMessage());
}