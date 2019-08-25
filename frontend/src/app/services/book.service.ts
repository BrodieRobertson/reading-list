import { Book } from './../models/book';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringToReadingState, stringToBoolean } from '../string-conversion';
import { bookPath } from '../api-routes';

@Injectable({
  providedIn: 'root'
})

export class BookService {
  nextId: number;
  books: Array<Book>;

  constructor(private http: HttpClient) {
    this.books = []
    this.nextId = 0;
  }

  static extractBooks(res: Array<any>) {
    var books = []
    res.forEach((entry) => {
      var idFound = -1;
      for(var i = 0; i < books.length; ++i) {
        if(books[i].id === entry.id) {
          idFound = i;
          break;
        }
      }
      
      if(idFound  < 0) {
        var book = new Book();
        book.id = entry.id;
        book.name = entry.name;
        book.image = entry.image;
        book.pages = entry.pages;
        book.isbn = entry.isbn;
        book.readingState = stringToReadingState(entry.readingstate)
        book.read = stringToBoolean(entry.completed)
        book.owned = stringToBoolean(entry.owned)
        book.dropped = stringToBoolean(entry.dropped)
        books.push(book);
      }
    })
    return books
  }

  static extractBook(res) {
    return this.extractBooks(res)[0]
  }

  /**
   * Gets all of the books
   */
  getBooks() {
    return this.http.get<Array<any>>(bookPath(null));
  }

  /**
   * Gets a book by it's id
   * @param id The books id
   */
  getBook(id: string) {
    return this.http.get<Array<any>>(bookPath(id));
  }

  /**
   * Adds a new book
   * @param book The new book
   */
  addBook(book: Book) {
    book.id = this.nextId + "";
    ++this.nextId;
    this.books.push(book);
    return book.id;
  }

  /**
   * Updates a book or adds it if it's not already present
   * @param book The book being updated
   */
  updateBook(book: Book) {
    // var oldBook: Book = this.getBook(book.id);
    var oldBook = new Book()
    if(oldBook) {
      oldBook = book;
      return oldBook.id
    }
    else {
      return this.addBook(book);
    }
  }

  /**
   * Removes a book by it's id
   * @param id The books id 
   */
  removeBook(id: string) {
    this.books.filter((book) => {
      return book.id !== id;
    })
  }
}
