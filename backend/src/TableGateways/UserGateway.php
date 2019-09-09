<?php
namespace Src\TableGateways;

class UserGateway {
  private $db = null;

  public function __construct($db) {
    $this->db = $db; 
  }

  /**
   * Gets all the users
   */
  public function getAll() {
    $statement = "
      SELECT * FROM user
      ORDER BY id;
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
   * Gets a user specified by it's id
   */
  public function get($id) {
    $statement = "
      SELECT * FROM user
      WHERE id = ?
      ORDER BY id;
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
   * Inserts a user
   */
  public function insert(Array $input) {
    // $myfile = fopen("log.txt", "w") or die("Unable to open file!");
    // fwrite($myfile, print_r($input, true));
    // fclose($myfile);
    $statement = "
      INSERT INTO user (username, email) VALUES (:username, :email);
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'username' => $input['username'],
        'email' => $input['email']
      ));
      return $this->db->lastInsertId();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Updates an author specified by it's id
   */
  public function update($id, Array $input) {
    $statement = "
      UPDATE user
      SET 
        username = :username,
        email = :email
      WHERE id = :id;
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'id' => (int) $id,
        'username' => $input['username'],
        'email' => $input['email']
      ));
      return $statement->rowCount();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Deletes an author specified by it's id
   */
  public function delete($id) {
    // Clean out foreign key table rows
    (new UserBookGateway($this->db))->delete(null, $id);

    $statement = "
      DELETE FROM user
      WHERE id = ?;
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array($id));
      return $id;
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }
}