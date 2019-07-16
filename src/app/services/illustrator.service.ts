import { Illustrator } from './../models/illustrator';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IllustratorService {
  nextId: number;
  illustrators: Array<Illustrator>;

  constructor() {
    this.illustrators = []
    this.nextId = 0;
  }

  /**
   * Gets all of the illustrators
   */
  getIllustrators() {
    return this.illustrators;
  }

  /**
   * Gets an illustrator by it's id
   * @param id The illustrators id
   */
  getIllustrator(id: Number) {
    return this.illustrators.filter((book) => {
      return book.id === id;
    })[0];
  }

  /**
   * Adds a new illustrator
   * @param illustrator The new illustrator
   */
  addIllustrator(illustrator: Illustrator) {
    illustrator.id = this.nextId;
    ++this.nextId;
    this.illustrators.push(illustrator);
    return illustrator.id;
  }

  /**
   * Removes a illustrator by it's id
   * @param id The illustrators id 
   */
  removeIllustrator(id: Number) {
    this.illustrators.filter((illustrator) => {
      return illustrator.id !== id;
    })
  }
}
