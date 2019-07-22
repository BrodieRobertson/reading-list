<?php
require 'bootstrap.php';

$statement = <<<SQL_QUERY
  CREATE TABLE author (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
  );

  INSERT INTO author (id, name) VALUES
    (0, John),
    (1, Smith),
    (2, Tim),
    (3, Bob);

  CREATE TABLE illustrator (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
  );

  INSERT INTO illustrator (id, name) VALUES
    (0, James),
    (1, Joey),
    (2, Thomas),
    (3, Kyle);

  CREATE TABLE book (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(100),
    pages INT NOT NULL,
    isbn VARCHAR(25),
    readingstate INT NOT NULL,
    read BIT NOT NULL,
    owned BIT NOT NULL,
    dropped BIT NOT NULL,
    PRIMARY KEY (id)
  );

  INSERT INTO book (id, name, image, pages, isbn, readingstate, read, owned, dropped) VALUES
    (0, book1, NULL, 100, 8501234567897, 0, 0, 0, 1, 0),
    (1, book2, NULL, 100, 9221234567123, 1, 1, 0, 0, 0),
    (2, book3, NULL, 100, 3071234567875, 2, 0, 1, 0, 0),
    (3, book4, NULL, 100, 4051234567534, 0, 0, 0, 1, 0),
    (4, book5, NULL, 100, 1021234567901, 0, 0, 0, 0, 1)

  CREATE TABLE bookauthor (
    bookId INT NOT NULL,
    authorId INT NOT NULL,
    PRIMARY KEY(bookId, authorId),
    FOREIGN KEY(bookId) REFERENCES book(id),
    FOREIGN KEY(authorId) REFERENCES author(id)
  );

  INSERT INTO bookauthor (bookId, authorId) VALUES
    (0, 1),
    (0, 0),
    (1, 1),
    (2, 0),
    (2, 1),
    (2, 2),
    (2, 3);

  CREATE TABLE bookillustrator (
    bookId INT NOT NULL,
    illustratorId INT NOT NULL,
    PRIMARY KEY(bookId, illustratorId),
    FOREIGN KEY(bookId) REFERENCES book(id),
    FOREIGN KEY(illustratorId) REFERENCES illustrator(id)
  );

  INSERT INTO bookillustrator (bookId, illustratrId) VALUES
    (0, 1),
    (0, 0),
    (1, 1),
    (2, 0),
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