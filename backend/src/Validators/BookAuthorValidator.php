<?php
namespace Src\Validators;

class BookAuthorValidator {
  /**
   * Validates a book author input
   */
  public function validate($input) {
    if(!isset($input['bookid'])) {
      return false;
    }

    if(!isset($input['authorid'])) {
      return false;
    }

    return true;
  }
}