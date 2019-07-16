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
    book.id = this.books.length;
    this.books.push(book);
    console.log(book.id)
    return book.id;
  }

  removeFromList(id: Number) {
    this.books.filter((book) => {
      return book.id !== id;
    })
  }
}
