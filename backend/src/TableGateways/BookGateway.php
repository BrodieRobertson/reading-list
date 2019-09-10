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
    $bookAuthorGateway = new BookAuthorGateway($this->db);
    $bookAuthors = $bookAuthorGateway->get($bookid, null);

    for($i = 0; $i < sizeof($bookAuthors); $i++) {
      // Search for a book author
      $found = false;
      for($j = 0; $j < sizeof($authors); $j++) {
        if($authors[$j]["id"] == $bookAuthors[$i]["authorid"]) {
          $found = true;
        }      
      }

      // Delete any bookauthors that aren't found
      if($found == false) {
        $bookAuthorGateway->delete($bookAuthors[$i]["bookid"], $bookAuthors[$i]["authorid"]);
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
        $newAuthorId = $authorGateway->insert($authors[$i]);
        $bookAuthorGateway->insert(array('bookid' => $bookid, 'authorid' => $newAuthorId));
      }
    }
  }

  /**
   * Handles any changes to the illustrators of a book in a payload
   */
  private function handleIllustrators($illustrators, $bookid) {
    // Handle removals and bookillustrators
    $bookIllustratorGateway = new BookIllustratorGateway($this->db);
    $bookIllustrators = $bookIllustratorGateway->get($bookid, null);

    for($i = 0; $i < sizeof($bookIllustrators); $i++) {
      // Search for a book illustrator
      $found = false;
      for($j = 0; $j < sizeof($illustrators); $j++) {
        if($illustrators[$j]["id"] == $bookIllustrators[$i]["illustratorid"]) {
          $found = true;
        }      
      }

      // Delete any book illustrators that aren't found
      if($found == false) {
        $bookIllustratorGateway->delete($bookIllustrators[$i]["bookid"], $bookIllustrators[$i]["illustratorid"]);
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
        $newIllustratorId = $illustratorGateway->insert($illustrators[$i]);
        $bookIllustratorGateway->insert(array('bookid' => $bookid, 'illustratorid' => $newIllustratorId));
      }
    }
  }

  /**
   * Inserts a book
   */
  public function insert(Array $input) {
    $completed = ($input["read"] == 1 ? $input["read"] : 0);
    $owned = ($input["owned"] == 1 ? $input["owned"] : 0);
    $statement = "
      INSERT INTO 
        book (name, image, pages, isbn, readingstate, completed, owned) 
      VALUES (:name, :image, :pages, :isbn, :readingstate, $completed, $owned);
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'name' => $input['name'],
        'image' => $input['image'],
        'pages' => $input['pages'],
        'isbn' => $input['isbn'],
        'readingstate' => $input['readingState'],
      ));
      
      $id = $this->db->lastInsertId();
      $this->handleAuthors($input["authors"], $id);
      $this->handleIllustrators($input["illustrators"], $id);

      return $id;
    }
    catch(\PDOException $e) {
      exit($e->getMessage());
    }
  }

  /**
   * Updates a book specified by it's id
   */
  public function update($id, Array $input) {
    $this->handleAuthors($input["authors"], $id);
    $this->handleIllustrators($input["illustrators"], $id);

    $completed = ($input["read"] == 1 ? $input["read"] : 0);
    $owned = ($input["owned"] == 1 ? $input["owned"] : 0);
    $statement = "
      UPDATE book
      SET 
        name = :name,
        image = :image,
        pages = :pages,
        isbn = :isbn,
        readingstate = :readingstate,
        completed = $completed,
        owned = $owned
      WHERE id = :id;
    ";

    try {
      $statement = $this->db->prepare($statement);
      $statement->execute(array(
        'id' => (int) $id,
        'name' => $input['name'],
        'image' => $input['image'],
        'pages' => $input['pages'],
        'isbn' => $input['isbn'],
        'readingstate' => $input['readingState'],
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