<?php
namespace src\TableGateways;

class BookGateway {
  private $db = null;

  public function __constructor($db) {
    $this->db = $db; 
  }

  /**
   * Gets all the books
   */
  public function getAll() {
    $statement = "
      SELECT id, name, image, pages, isbn, readingstate, read, owned, dropped FROM book;
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
   * Gets a book specified by it's id
   */
  public function get($id) {
    $statement = "
      SELECT 
        id, name, image, pages, isbn, readingstate, read, owned, dropped 
      FROM book 
      WHERE id = ?;
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
   * Inserts a book
   */
  public function insert(Array $input) {
    $statement = "
      INSERT INTO 
        book (name, image, pages, isbn, readingstate, read, owned, dropped) 
      VALUES (:name, :image, :pages, :isbn, :readingstate, :read, :owned, :dropped)
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
   * Updates a book specified by it's id
   */
  public function update($id, Array $input) {
    $statement = "
      UPDATE book
      SET 
        name = :name,
        images = :images,
        pages = :pages,
        isbn = :isbn,
        reading = :readingstate,
        read = :read,
        owned = :owned,
        dropped = :dropped
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
    catch(PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Deletes a book specified by it's id
   */
  public function delete($id) {
    $statement = "
      DELETE FROM author
      WHERE id = ?
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array($id));
      return $statement->rowCount();
    }
    catch(PDOException $e) {
      exit($e->getMessage());
    }
  }
}