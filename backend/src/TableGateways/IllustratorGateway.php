<?php
namespace src\TableGateways;

class IllustratorGateway {
  private $db = null;

  public function __constructor($db) {
    $this->db = $db; 
  }

  /**
   * Gets all the illustrators
   */
  public function getAll() {
    $statement = "
      SELECT id, name FROM illustrator;
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
   * Gets an illustrator specified by an id
   */
  public function get($id) {
    $statement = "
      SELECT id, name FROM illustrator WHERE id = ?;
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
   * Inserts an illustrator
   */
  public function insert(Array $input) {
    $statement = "
      INSERT INTO illustrator (name) VALUES (:name)
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
   * Updates an illustrator specified by it's id
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
   * Deletes an illustrator specified by it's id
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