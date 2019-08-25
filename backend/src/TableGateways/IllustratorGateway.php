<?php
namespace Src\TableGateways;

class IllustratorGateway {
  private $db = null;

  public function __construct($db) {
    $this->db = $db; 
  }

  /**
   * Gets all the illustrators
   */
  public function getAll() {
    $statement = "
      SELECT illustrator.id, illustrator.name, book.id AS 
        bookId, book.name AS bookName FROM illustrator
      JOIN bookillustrator ON illustrator.id = bookillustrator.bookId
      JOIN book ON illustrator.id = book.id
      ORDER BY illustrator.id;
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
   * Gets an illustrator specified by an id
   */
  public function get($id) {
    $statement = "
      SELECT illustrator.id, illustrator.name, book.id AS bookId, book.name AS bookName FROM illustrator 
      JOIN bookillustrator ON illustrator.id = bookillustrator.bookId
      JOIN book ON illustrator.id = book.id
      WHERE illustrator.id = ?
      ORDER BY illustrator.id;
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array($id));
      $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
      return $result;
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Inserts an illustrator
   */
  public function insert(Array $input) {
    $statement = "
      INSERT INTO illustrator (name) VALUES (:name);
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'name' => $input['name']
      ));
      return $statement->rowCount();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }

    // Insert into book and bookillustrator, when has any illustrated book
  }

  /**
   * Updates an illustrator specified by it's id
   */
  public function update($id, Array $input) {
    $statement = "
      UPDATE illustrator 
      SET name = :name
      WHERE id = :id;
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'id' => $id,
        'name' => $input['name']
      ));
      return $statement->rowCount();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }

    // If any illustrated books added or removed, must add to/remove from book and bookillustrator
  }

  /**
   * Deletes an illustrator specified by it's id
   */
  public function delete($id) {
    // Clean out foreign key table rows
    (new BookIllustratorGateway)->delete(null, $id);

    $statement = "
      DELETE FROM illustrator
      WHERE id = ?;
    ";

    try {
      for($i = 0; $i < count($statements); $i++) {
        $statement = $this->db->prepare($statement);
        $statement->execute(array($id));
      }
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }
}