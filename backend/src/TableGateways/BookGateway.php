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
   * Handles any changes to the authors of a book in a payload
   */
  private function handleAuthors($authors, $bookid) {
    // Handle removals and bookauthors
    $bookAuthors = (new BookAuthorGateway($this->db))->get($bookid, null);

    for($i = 0; $i < sizeof($bookAuthors); $i++) {
      // Search for a book author
      $found = false;
      for($j = 0; $j < sizeof($authors); $j++) {
        if($authors[$j]["authorid"] == $bookAuthors[$i]["id"]) {
          $found = true;
        }      
      }

      // Delete any bookauthors that aren't found
      if($found == false) {
        $bookAuthors->delete($bookAuthors[$i]["bookid"], $bookAuthors[$i]["authorid"]);
      }
    }

    $authorGateway = new AuthorGateway($this->db);
    for($i = 0; $i < sizeof($authors); $i++) {
      // Update an author
      if($authors[$i]["id"] != "-1") {
        $authorGateway->update($authors[$i]["id"], $authors[$i]);
      }
      // Insert a new author
      else {
        $authorGateway->insert($authors[$i]);
      }
    }
  }

  /**
   * Handles any changes to the illustrators of a book in a payload
   */
  private function handleIllustrators($illustrators, $bookid) {
    // Handle removals and bookillustrators
    $bookIllustrators = (new BookIllustratorGateway($this->db))->get($bookid, null);

    for($i = 0; $i < sizeof($bookIllustrators); $i++) {
      // Search for a book illustrator
      $found = false;
      for($j = 0; $j < sizeof($illustrators); $j++) {
        if($illustrators[$j]["illustratorid"] == $bookIllustrators[$i]["id"]) {
          $found = true;
        }      
      }

      // Delete any book illustrators that aren't found
      if($found == false) {
        $bookIllustrators->delete($bookIllustrators[$i]["bookid"], $bookIllustrators[$i]["illustratorid"]);
      }
    }
    

    $illustratorGateway = new IllustratorGateway($this->db);
    for($i = 0; $i < sizeof($illustrators); $i++) {
      // Update an illustrator
      if($illustrators[$i]["id"] != "-1") {
        $illustratorGateway->update($illustrators[$i]["id"], $illustrators[$i]);
      }
      // Insert an illustrator
      else {
        $illustratorGateway->insert($illustrators[$i]);
      }
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

      handleAuthors($input["authors"], "100");
      handleIllustrators($input["illustrators"], "100");

      return $statement->rowCount();
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Updates a book specified by it's id
   */
  public function update($id, Array $input) {
    handleAuthors($input["authors"], $id);
    handleIllustrators($input["illustrators"], $id);

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