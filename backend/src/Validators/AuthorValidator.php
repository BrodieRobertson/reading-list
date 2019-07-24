<?php
namespace Src\Validators;

class AuthorValidator {
  /**
   * Validates an author input
   */
  public function validate($input) {
    if(!isset($input['name'])) {
      return false;
    }

    return true;
  }
}