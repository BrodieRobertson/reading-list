<?php
namespace Src\Validators;

class BookValidator {
  public function validate($input) {
    if(!isset($input['name'])) {
      return false;
    }

    if(!isset($input['images'])) {
      return false;
    }

    if(!isset($input['pages'])) {
      return false;
    }

    if(!isset($input['isbn'])) {
      return false;
    }

    if(!isset($input['readingstate'])) {
      return false;
    }

    if(!isset($input['read'])) {
      return false;
    }

    if(!isset($input['owned'])) {
      return false;
    }

    if(!isset($input['dropped'])) {
      return false;
    }

    return true;
  }
}