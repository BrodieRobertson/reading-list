import { Book } from './models/book';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  books: Array<Book> = [];

  constructor() { }

  getBooks() {
    return this.books;
  }

  getBook(id: Number) {
    return this.books.filter((book) => {
      return book.id === id;
    })[0];
  }

  addToList(book: Book) {
    this.books.push(book);
  }

  removeFromList(id: Number) {
    this.books.filter((book) => {
      return book.id !== id;
    })
  }
}
