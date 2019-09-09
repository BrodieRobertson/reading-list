<?php
namespace Src\Validators;

class UserValidator {
  /**
   * Validates the user input
   */
  public function validate($input) {
    if(!isset($input['username'])) {
    return false;
    }

    if(!isset($input['email'])) {
    return false;
    }    

    return true;
  }
}