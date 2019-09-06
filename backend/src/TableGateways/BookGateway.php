<?php
namespace Src\TableGateways;

class BookGateway {
  private $db = null;

  public function __construct($db) {
    $this->db = $db; 
  }

  /**
   * Gets all the books
   */
  public function getAll() {
    $statement = "
      SELECT book.id, book.name, book.image, book.pages, book.isbn, 
        book.readingstate, book.completed, book.owned, illustrator.id 
        AS illustratorId, illustrator.name AS illustratorName, 
        author.id AS authorId, author.name AS authorName FROM book
      LEFT JOIN bookauthor ON book.id = bookauthor.bookid
      LEFT JOIN author ON bookauthor.authorid = author.id
      LEFT JOIN bookillustrator ON book.id = bookillustrator.bookid
      LEFT JOIN illustrator ON bookillustrator.illustratorid = illustrator.id
      ORDER BY book.id;
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
   * Gets a book specified by it's id
   */
  public function get($id) {
    $statement = "
      SELECT book.id, book.name, book.image, book.pages, book.isbn, 
        book.readingstate, book.completed, book.owned, illustrator.id 
        AS illustratorId, illustrator.name AS illustratorName, 
        author.id AS authorId, author.name AS authorName FROM book
      LEFT JOIN bookauthor ON book.id = bookauthor.bookid
      LEFT JOIN author ON bookauthor.authorid = author.id
      LEFT JOIN bookillustrator ON book.id = bookillustrator.bookid
      LEFT JOIN illustrator ON bookillustrator.illustratorid = illustrator.id
      WHERE book.id = ?
      ORDER BY book.id;
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
   * Inserts a book
   */
  public function insert(Array $input) {
    $statement = "
      INSERT INTO 
        book (name, image, pages, isbn, readingstate, completed, owned, dropped) 
      VALUES (:name, :image, :pages, :isbn, :readingstate, :completed, :owned, :dropped);
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'name' => $input['name'],
        'image' => $input['image'],
        'pages' => $input['pages'],
        'isbn' => $input['isbn'],
        'readingstate' => $input['readingstate'],
        'completed' => $input['read'],
        'owned' => $input['owned'],
        'dropped' => $input['dropped']
      ));
      return $statement->rowCount();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }

    // Insert into author, illustrator, bookauthor, bookillustrator, when has any authors or illustrators
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
        'name' => $input['name'],
        'image' => $input['image'],
        'pages' => $input['pages'],
        'isbn' => $input['isbn'],
        'readingstate' => $input['readingstate'],
        'completed' => $input['read'],
        'owned' => $input['owned'],
        'dropped' => $input['dropped']
      ));
      return $statement->rowCount();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }

    // If any illustrators removed or added, must remove or add to/remove from bookillustrator and illustrator
    // If any authors removed or added, must remove or add to/remove from bookauthor and author
  }

  /**
   * Deletes a book specified by it's id
   */
  public function delete($id) {
    // Clean out foreign key tables rows
    (new BookAuthorGateway($this->db))->delete($id, null);
    (new BookIllustratorGateway($this->db))->delete($id, null);

    $statement = "
        DELETE FROM book
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