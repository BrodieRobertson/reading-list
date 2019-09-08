<?php
namespace Src\TableGateways;

class AuthorGateway {
  private $db = null;

  public function __construct($db) {
    $this->db = $db; 
  }

  /**
   * Gets all the authors
   */
  public function getAll() {
    $statement = "
      SELECT author.id, author.name, book.id AS bookId, book.name AS bookName FROM author
      LEFT JOIN bookauthor ON author.id = bookauthor.authorId
      LEFT JOIN book ON book.id = bookauthor.bookid
      ORDER BY author.id;
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
   * Gets an author specified by it's id
   */
  public function get($id) {
    $statement = "
      SELECT author.id, author.name, book.id AS bookId, book.name AS bookName FROM author
      LEFT JOIN bookauthor ON author.id = bookauthor.authorId
      LEFT JOIN book ON book.id = bookauthor.bookid
      WHERE author.id = ?
      ORDER BY author.id;
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
   * Inserts an author
   */
  public function insert(Array $input) {
    $myfile = fopen("log.txt", "w") or die("Unable to open file!");
    fwrite($myfile, print_r($input, true));
    fclose($myfile);
    $statement = "
      INSERT INTO author (name) VALUES (:name);
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'name' => $input['name']
      ));
      return $this->db->lastInsertId();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }

    // Insert into book and bookauthor, when has authored books
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
    catch(\PDOException $e) {
      exit($e->getMessage());
    }

    // If any authored books added or removed, must add to/remove from book and book author
  }

  /**
   * Deletes an author specified by it's id
   */
  public function delete($id) {
    // Clean out foreign key table rows
    (new BookAuthorGateway($this->db))->delete(null, $id);

    $statement = "
      DELETE FROM author
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
