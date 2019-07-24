<?php
namespace Src\Validators;

class BookIllustratorValidator {
  /**
   * Validates a book illustrator input
   */
  public function validate($input) {
    if(!isset($input['bookid'])) {
      return false;
    }

    if(!isset($input['illustratorid'])) {
      return false;
    }

    return true;
  }
}