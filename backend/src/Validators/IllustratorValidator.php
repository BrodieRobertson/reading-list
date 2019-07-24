<?php
namespace Src\Validators;

class IllustratorValidator {
  /**
   * Validates an illustrator input
   */
  public function validate($input) {
    if(!isset($input['name'])) {
      return false;
    }

    return true;
  }
}