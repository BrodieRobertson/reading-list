<?php
namespace Src\Validators;

class UserBookValidator {
  /**
   * Validates the user book input
   */
  public function validate($input) {
    if(!isset($input['userid'])) {
      return false;
    }

    if(!isset($input['bookid'])) {
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