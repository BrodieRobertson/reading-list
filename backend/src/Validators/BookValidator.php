<?php
namespace Src\Validators;

class BookValidator {
  /**
   * Validates the book input
   */
  public function validate($input) {
    if(!isset($input['name'])) {
      return false;
    }

    if(!isset($input['pages'])) {
      return false;
    }
    
    if(!isset($input['isbn'])) {
      return false;
    }

    if(!isset($input['readingState'])) {
      return false;
    }

    if(!isset($input['read'])) {
      return false;
    }

    if(!isset($input['owned'])) {
      return false;
    }

    return true;
  }
}