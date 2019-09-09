<?php 

namespace Src\TableGateways;

class BookAuthorGateway {
  private $db = null;

  public function __construct($db) {
    $this->db = $db;
  }

  /**
   * Gets all the bookauthors
   */
  public function getAll() {
    $statement = "
      SELECT * FROM bookauthor;
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
   * Gets a sub set of bookauthors, fails if not ids are provided
   */
  public function get($bookId, $authorId) {
    // Gets a sub set of book ids
    try {
      if($bookId && !$authorId) {
        $statement = "
          SELECT * FROM bookauthor
          WHERE bookid = ?;
        ";

        $statement = $this->db->prepare($statement);
        $statement->execute(array($bookId));
      }
      // Gets a sub set of author ids
      else if($authorId && !$bookId) {
        $statement = "
          SELECT * FROM bookauthor
          WHERE authorid = ?;
        ";

        $statement = $this->db->prepare($statement);
        $statement->execute(array($authorId));
      }
      // Gets a single row
      else if($authorId && $bookId) {
        $statement = "
          SELECT * FROM bookauthor
          WHERE authorid = :authorid AND
          bookid = :bookid;
        ";

        $statement = $this->db->prepare($statement);
        $statement->execute(array(
          'authorid' => $authorId,
          'bookid' => $bookId
        ));
      }
      // No ids
      else {
        exit("Unable to get any data from bookauthor");
      }
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }

    $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
    return $result;
  }

  /**
   * Inserts a bookauthor
   */
  public function insert(Array $input) {
    $statement = "
      INSERT INTO bookauthor (bookid, authorid) VALUES (:bookid, :authorid);
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'bookid' => $input['bookid'],
        'authorid' => $input['authorid']
      ));
      return $statement->rowCount();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Deletes a subset of book authors
   */
  public function delete($bookId, $authorId) {
    // Deletes a sub set if book ids
    if($bookId && !$authorId) {
      $statement = "
        DELETE FROM bookauthor
        WHERE bookid = ?;
      ";

      $statement = $this->db->prepare($statement);
      $statement->execute(array($bookId));
      return $statement->rowCount();
    }
    // Deletes a sub set of author ids
    else if($authorId && !$bookId) {
      $statement = "
        DELETE FROM bookauthor
        WHERE authorid = ?;
      ";

      $statement = $this->db->prepare($statement);
      $statement->execute(array($authorId));
      return $statement->rowCount();
    }
    // Delete a row
    else if($authorId && $bookId) {
      $statement = "
        DELETE FROM bookauthor
        WHERE authorid = :authorid AND
        bookid = :bookid;
      ";

      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'authorid' => $authorId,
        'bookid' => $bookId
      ));
      return $statement->rowCount();
    }
    // No ids
    else {
      exit("Unable to delete any data from bookauthor");
    }
  }
}