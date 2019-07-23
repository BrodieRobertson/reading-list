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
      SELECT book.id, book.name, book.image, book.pages, book.isbn, 
        book.readingstate, book.read, book.owned, book.dropped, 
        illustrator.id, illustrator.name, author.id, author.name FROM book
      JOIN bookauthor ON book.id = bookauthor.bookid
      JOIN author ON bookauthor.authorid = author.id
      JOIN bookillustrator ON book.id = bookillustrator.bookid
      JOIN illustrator ON bookillustrator.illustratorid = illustrator.id
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
      SELECT book.id, book.name, book.image, book.pages, book.isbn, 
        book.readingstate, book.read, book.owned, book.dropped, 
        illustrator.id, illustrator.name, author.id, author.name FROM book
      JOIN bookauthor ON book.id = bookauthor.bookid
      JOIN author ON bookauthor.authorid = author.id
      JOIN bookillustrator ON book.id = bookillustrator.bookid
      JOIN illustrator ON bookillustrator.illustratorid = illustrator.id
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
    $statements = array(
      "
        DELETE FROM bookauthor
        WHERE id = ?;
      ",
      "
        DELETE FROM bookillustrator
        WHERE id = ?;
      ",
      "
        DELETE FROM book
        WHERE id = ?;
      "
    );

    try {
      for($i = 0; count($statements); $i++) {
        $statements[$i] = $this->db->prepare($statement);
        $statements[$i]->execute(array($id));
      }
    }
    catch(PDOException $e) {
      exit($e->getMessage());
    }
  }
}