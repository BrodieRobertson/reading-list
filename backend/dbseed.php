<?php
require 'bootstrap.php';

$statement = <<<SQL_QUERY
  CREATE TABLE author (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
  ) ENGINE="INNODB";

  INSERT INTO author (id, name) VALUES
    (0, 'John'),
    (1, 'Smith'),
    (2, 'Tim'),
    (3, 'Bob');

  CREATE TABLE illustrator (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
  ) ENGINE="INNODB";

  INSERT INTO illustrator (id, name) VALUES
    (0, 'James'),
    (1, 'Joey'),
    (2, 'Thomas'),
    (3, 'Kyle');

  CREATE TABLE book (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(100),
    pages INT NOT NULL,
    isbn VARCHAR(25),
    readingstate INT NOT NULL,
    completed BIT(1) NOT NULL,
    owned BIT(1) NOT NULL,
    dropped BIT(1) NOT NULL,
    PRIMARY KEY (id)
  ) ENGINE="INNODB";

  INSERT INTO book (id, name, image, pages, isbn, readingstate, completed, owned, dropped) VALUES
    (0, 'book1', NULL, 100, '8501234567897', 0, 0, 1, 0),
    (1, 'book2', NULL, 100, '9221234567123', 1, 0, 0, 0),
    (2, 'book3', NULL, 100, '3071234567875', 2, 1, 0, 0),
    (3, 'book4', NULL, 100, '4051234567534', 0, 0, 1, 0),
    (4, 'book5', NULL, 100, '1021234567901', 0, 0, 0, 1);

  CREATE TABLE bookauthor (
    bookid INT NOT NULL,
    authorid INT NOT NULL,
    PRIMARY KEY(bookid, authorid),
    FOREIGN KEY(bookid) REFERENCES book(id),
    FOREIGN KEY(authorid) REFERENCES author(id)
  ) ENGINE="INNODB";

  INSERT INTO bookauthor (bookid, authorid) VALUES
    (6, 1),
    (3, 5),
    (1, 1),
    (2, 3),
    (2, 1),
    (2, 2),
    (3, 2);

  CREATE TABLE bookillustrator (
    bookid INT NOT NULL,
    illustratorid INT NOT NULL,
    PRIMARY KEY(bookid, illustratorid),
    FOREIGN KEY(bookid) REFERENCES book(id),
    FOREIGN KEY(illustratorid) REFERENCES illustrator(id)
  ) ENGINE="INNODB";

  INSERT INTO bookillustrator (bookid, illustratorid) VALUES
    (1, 1),
    (1, 2),
    (3, 2),
    (2, 1),
    (2, 2),
    (2, 3);
SQL_QUERY;

try {
  $createTable = $dbConnection->exec($statement);
  echo "Success!\n";
} catch (\PDOException $e) {
  exit($e->getMessage());
}