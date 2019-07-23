<?php
namespace src\TableGateways;

class AuthorGateway {
  private $db = null;

  public function __constructor($db) {
    $this->db = $db; 
  }

  /**
   * Gets all the authors
   */
  public function getAll() {
    $statement = "
      SELECT author.id, author.name, book.id, book.name FROM author
      JOIN bookauthor ON author.id = bookauthor.bookId
      JOIN book ON author.id = book.id;
    ";

    try {
      $statement = $this->$db->query($statement);
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
      return $result;
    }
    catch(PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Gets an author specified by it's id
   */
  public function get($id) {
    $statement = "
      SELECT author.id, author.name, book.id, book.id FROM author 
      JOIN bookauthor ON author.id = bookauthor.bookId
      JOIN book ON author.id = book.id
      WHERE author.id = ?;
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array($id));
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
      return $result;
    }
    catch(PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Inserts an author
   */
  public function insert(Array $input) {
    $statement = "
      INSERT INTO author (name) VALUES (:name)
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'name' => $input['name']
      ));
      return $statement->rowCount();
    }
    catch(PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Updates an author specified by it's id
   */
  public function update($id, Array $input) {
    $statement = "
      UPDATE author 
      SET name = :name
      WHERE id = :id;
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'id' => (int) $id,
        'name' => $input['name']
      ));
      return $statement->rowCount();
    }
    catch(PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Deletes an author specified by it's id
   */
  public function delete($id) {
    $statements = array(
      "
        DELETE FROM bookauthor
        WHERE id = ?
      ",
      "
        DELETE FROM author
        WHERE id = ?
      ",
    ); 

    try {
      for($i = 0; $i < count($statements); $i++) {
        $statements[$i] = $this->db->prepare($statement);
        $statements[$i]->execute(array($id));
      }
    }
    catch(PDOException $e) {
      exit($e->getMessage());
    }
  }
}
