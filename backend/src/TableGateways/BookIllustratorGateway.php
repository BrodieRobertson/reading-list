<?php

namespace Src\TableGateways;

class BookIllustratorGateway {
  private $db = null;

  public function __construct($db) {
    $this->db = $db;
  }

  /**
   * Gets all book illustrators
   */
  public function getAll() {
    $statement = "
      SELECT * FROM bookillustrator;
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
   * Gets a sub set of bookillustrators, fails if no ids are provided
   */
  public function get($bookId, $illustratorId) {
    try {
      // Gets a sub set of bok ids
      if($bookId && !$illustratorId) {
        $statement = "
          SELECT * FROM bookillustrator
          WHERE bookid = ?;
        ";

        $statement = $this->db->prepare($statement);
        $statement->execute(array($bookId));
      }
      // Gets a sub set of illustrator ids
      else if($illustratorId && !$bookId) {
        $statement = "
          SELECT * FROM bookillustrator
          WHERE illustratorid = ?;
        ";

        $statement = $this->db->prepare($statement);
        $statement->execute(array($illustratorId));
      }
      else if($illustratorId && $bookId) {
        $statement = "
          SELECT * FROM bookillustrator
          WHERE illustratorid = :illustratorid AND
          bookid = :bookid;
        ";

        $statement = $this->db->prepare($statement);
        $statement->execute(array(
          'illustratorid' => $authorId,
          'bookid' => $bookId
        ));
      }
      else {
        exit("Unable to get any data from bookillustrator");
      }
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }

    $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
    return $result;
  }

  /**
   * Inserts a bookillustrator
   */
  public function insert(Array $input) {
    $statement = "
      INSERT INTO bookillustrator (bookid, illustratorid) VALUES (:bookid, :illustratorid);
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'bookid' => $input['bookid'],
        'illustratorid' => $input['illustratorid']
      ));
      return $statement->rowCount();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Deletes a subset of book illustrators
   */
  public function delete($bookId, $illustratorId) {
    // Deletes a sub set if book ids
    if($bookId && !$illustratorId) {
      $statement = "
        DELETE FROM bookillustrator
        WHERE bookid = ?;
      ";

      $statement = $this->db->prepare($statement);
      $statement->execute(array($bookId));
      return $statement->rowCount();
    }
    // Deletes a sub set of illustrator ids
    else if($illustratorId && !$bookId) {
      $statement = "
        DELETE FROM bookillustrator
        WHERE illustratorid = ?;
      ";

      $statement = $this->db->prepare($statement);
      $statement->execute(array($illustratorId));
      return $statement->rowCount();
    }
    // Delete a row
    else if($illustratorId && $bookId) {
      $statement = "
        DELETE FROM bookillustrator
        WHERE illustratorid = :illustratorid AND
        bookid = :bookid;
      ";

      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'illustratorid' => $illustratorId,
        'bookid' => $bookId
      ));
      return $statement->rowCount();
    }
    // No ids
    else {
      exit("Unable to delete any data from bookillustrator");
    }
  }
}