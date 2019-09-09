<?php 

namespace Src\TableGateways;

class UserBookGateway {
  private $db = null;

  public function __construct($db) {
    $this->db = $db;
  }

  /**
   * Gets all the userbooks
   */
  public function getAll() {
    $statement = "
      SELECT userbook.bookid, userbook.readingstate, userbook.completed, 
      userbook.owned, book.name, book.pages, book.isbn FROM userbook
      JOIN book ON book.id = userbook.bookid
      ORDER BY userbook.bookid
      ";

    try {
      $statement = $this->db->query($statement);
      $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
      return $result;
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Gets a sub set of userbooks, fails if not ids are provided
   */
  public function get($userid, $bookId) {
    try {
      if($bookId && !$userid) {
        $statement = "
            SELECT userbook.bookid, userbook.readingstate, userbook.completed, 
            userbook.owned, book.name, book.pages, book.isbn FROM userbook
            JOIN book ON book.id = userbook.bookid
            ORDER BY userbook.bookid
            WHERE bookid = ?;
          ";

        $statement = $this->db->prepare($statement);
        $statement->execute(array($bookId));
      }
      // Gets a sub set of author ids
      else if($userid && !$bookId) {
        $statement = "
          SELECT userbook.bookid, userbook.readingstate, userbook.completed, 
          userbook.owned, book.name, book.pages, book.isbn FROM userbook
          JOIN book ON book.id = userbook.bookid
          ORDER BY userbook.bookid
          WHERE userid = ?;
        ";

        $statement = $this->db->prepare($statement);
        $statement->execute(array($userid));
      }
      // Gets a single row
      else if($userid && $bookId) {
        $statement = "
          SELECT userbook.bookid, userbook.readingstate, userbook.completed, 
          userbook.owned, book.name, book.pages, book.isbn FROM userbook
          JOIN book ON book.id = userbook.bookid
          ORDER BY userbook.bookid
          WHERE userid = :userid AND bookid = :bookid;
        ";

        $statement = $this->db->prepare($statement);
        $statement->execute(array(
          'userid' => $userid,
          'bookid' => $bookId
        ));
      }
      // No ids
      else {
        exit("Unable to get any data from userbooks");
      }
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }

    $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
    return $result;
  }

  /**
   * Inserts a user book
   */
  public function insert(Array $input) {
    $statement = "
      INSERT INTO userbook (userid, bookid, completed, owned) 
      VALUES (:userid, :bookid, :readingstate, :completed, :owned);
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'bookid' => $bookId,
        'authorid' => $userid
      ));
      return $statement->rowCount();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Deletes a subset of user books
   */
  public function delete($userid, $bookId) {
    // Deletes a sub set if book ids
    if($bookId && !$userid) {
      $statement = "
        DELETE FROM userbook
        WHERE bookid = ?;
      ";

      $statement = $this->db->prepare($statement);
      $statement->execute(array($bookId));
      return $statement->rowCount();
    }
    // Deletes a sub set of author ids
    else if($userid && !$bookId) {
      $statement = "
        DELETE FROM userbook
        WHERE userid = ?;
      ";

      $statement = $this->db->prepare($statement);
      $statement->execute(array($userid));
      return $statement->rowCount();
    }
    // Delete a row
    else if($userid && $bookId) {
      $statement = "
        DELETE FROM userbook
        WHERE userid = :userid AND
        bookid = :bookid;
      ";

      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'userid' => $userid,
        'bookid' => $bookId
      ));
      return $statement->rowCount();
    }
    // No ids
    else {
      exit("Unable to delete any data from userbook");
    }
  }
}