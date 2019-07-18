import { Author } from './../models/author';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  nextId: number;
  authors: Array<Author>;

  constructor() { 
    this.authors = [];
    this.nextId = 0;
  }

  /**
   * Gets all the authors
   */
  getAuthors() {
    return this.authors;
  }

  /**
   * Gets an author by it's id
   * @param id The authors id
   */
  getAuthor(id: Number) {
    return this.authors.filter((author) => {
      return author.id === id;
    })[0];
  }

  /**
   * Updates an author or adds it if it's not already present
   * @param author The book being updated
   */
  updateAuthor(author: Author) {
    var oldAuthor: Author = this.getAuthor(author.id);
    if(oldAuthor) {
      oldAuthor = author;
      return oldAuthor.id
    }
    else {
      return this.addAuthor(author);
    }
  }

  /**
   * Adds a new author
   * @param author The new author
   */
  addAuthor(author: Author) {
    author.id = this.nextId;
    this.nextId++;
    this.authors.push(author);
    return author.id;
  }

  /**
   * Removes an author by it's id
   * @param id The authors id
   */
  removeAuthor(id: Number) {
    this.authors.filter((author) => {
      return author.id !== id;
    })
  }
}
