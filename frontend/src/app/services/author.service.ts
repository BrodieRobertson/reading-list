import { catchError } from 'rxjs/operators';
import { Book } from './../models/book';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Author } from './../models/author';
import { Injectable } from '@angular/core';
import { authorPath } from '../utils/api-routes';
import { handleApiError } from '../utils/handle-api-error';
import { httpOptions } from '../utils/http-options';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  nextId: number;
  authors: Array<Author>;

  constructor(private http: HttpClient) { 
    this.authors = [];
    this.nextId = 0;
  }
 
  /**
   * Extracts the author objects from the response
   * @param res The response from the server 
   */
  static extractAuthors(res: Array<any>) {
    var authors: Array<Author> = []
    res.forEach((entry) => {
      var idFound = -1;
      for(var i = 0; i < authors.length; ++i) {
        if(authors[i].id === entry.id) {
          idFound = i;
          break;
        }
      }
      
      // id not found, new Author
      if(idFound  < 0) {
        var author = new Author(entry.id, entry.name);
        author.authored.push(new Book(entry.bookId, entry.bookName))
        authors.push(author);
      }
      // id found, new authored book
      else {
        var book = new Book(entry.bookId, entry.bookName);
        authors[idFound].authored.push(book)
      }
    })
    return authors
  }

  /**
   * Extracts an author object from the response
   * @param res The response from the server
   */
  static extractAuthor(res: Array<any>) {
    return this.extractAuthors(res)[0]
  }

  /**
   * Gets all the authors
   */
  getAuthors(errorCallback?: Function) {
    return this.http.get<Array<any>>(authorPath(null)).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback)))
  }

  /**
   * Gets an author by it's id
   * @param id The authors id
   */
  getAuthor(id: string, errorCallback?: Function) {
    return this.http.get<Array<any>>(authorPath(id)).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback))
    )
  }

  /**
   * Updates an author
   * @param author The author being updated
   */
  updateAuthor(author: Author, errorCallback?: Function) {
    this.http.put(authorPath(author.id), author, httpOptions).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback))
    )
    // var oldAuthor: Author = this.getAuthor(author.id);
    // var oldAuthor = new Author()
    // if(oldAuthor) {
    //   oldAuthor = author;
    //   return oldAuthor.id
    // }
    // else {
    //   return this.addAuthor(author);
    // }
  }

  /**
   * Adds a new author
   * @param author The new author
   */
  addAuthor(author: Author, errorCallback?: Function) {
    return this.http.put<string>(authorPath(author.id), author, httpOptions).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback))
    )
    // author.id = this.nextId + "";
    // this.nextId++;
    // this.authors.push(author);
    // return author.id;
  }

  /**
   * Removes an author by it's id
   * @param id The authors id
   */
  removeAuthor(id: string, errorCallback?: Function) {
    return this.http.delete(authorPath(id)).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback))
    )
    // this.authors.filter((author) => {
    //   return author.id !== id;
    // })
  }
}
