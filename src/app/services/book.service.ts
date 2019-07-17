import { Book } from './../models/book';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  nextId: number;
  books: Array<Book>;

  constructor() {
    this.books = []
    this.nextId = 0;
  }

  /**
   * Gets all of the books
   */
  getBooks() {
    return this.books;
  }

  /**
   * Gets a book by it's id
   * @param id The books id
   */
  getBook(id: Number) {
    return this.books.filter((book) => {
      return book.id === id;
    })[0];
  }

  /**
   * Adds a new book
   * @param book The new book
   */
  addBook(book: Book) {
    book.id = this.nextId;
    ++this.nextId;
    this.books.push(book);
    return book.id;
  }

  /**
   * Removes a book by it's id
   * @param id The books id 
   */
  removeBook(id: Number) {
    this.books.filter((book) => {
      return book.id !== id;
    })
  }
}
