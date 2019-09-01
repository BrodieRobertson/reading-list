import { Author } from './../models/author';
import { Book } from './../models/book';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringToReadingState, stringToBoolean } from '../string-conversion';
import { bookPath } from '../api-routes';
import { Illustrator } from '../models/illustrator';

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

  /**
   * Extracts the book objects from the response
   * @param res The response from the server
   */
  static extractBooks(res: Array<any>) {
    var books = []
    res.forEach((entry) => {
      let idFound = this.findItem(books, entry.id);
      
      // If a book with the same id does not exist
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

        // If there's an author then create it
        if(entry.authorId) {
          book.authors.push(this.createAuthor(entry.authorId, entry.authorName))
        }

        // If there's an illustrator then create it
        if(entry.illustratorId) {
          book.illustrators.push(this.createIllustrator(entry.illustratorId, entry.illustratorName))
        }

        books.push(book);
      }
      // Book with the same id, book with multiple authors or illustrators
      else {
        let book: Book = books[idFound];
        let authorIdFound = this.findItem(book.authors, entry.authorId)
        let illustratorIdFound = this.findItem(book.illustrators, entry.illustratorId)

        if(authorIdFound < 0) {
          book.authors.push(this.createAuthor(entry.authorId, entry.authorName))
        }

        if(illustratorIdFound < 0) {
          book.illustrators.push(this.createIllustrator(entry.illustratorId, entry.illustratorName))
        }
      }
    })
    return books
  }

  private static findItem(list: Array<any>, id: string) {
    for(var i = 0; i < list.length; ++i) {
      if(list[i].id === id) {
        return i;
      }
    }
    return -1
  }

  private static createAuthor(id: string, name: string) {
    var author = new Author()
    author.id = id
    author.name = name
    return author
  }

  private static createIllustrator(id: string, name: string) {
    var illustrator = new Illustrator() 
    illustrator.id = id
    illustrator.name = name
    return illustrator
  }

  /**
   * Extracts a book object from the response
   * @param res The response from the server
   */
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
