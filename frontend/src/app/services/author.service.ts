import { HttpClient } from '@angular/common/http';
import { Author } from './../models/author';
import { Injectable } from '@angular/core';
import { authorPath } from '../api-routes';

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
  
  static extractAuthors(res: Array<any>) {
    var authors = []
    res.forEach((entry) => {
      var idFound = -1;
      for(var i = 0; i < authors.length; ++i) {
        if(authors[i].id === entry.id) {
          idFound = i;
          break;
        }
      }
      
      if(idFound  < 0) {
        var author = new Author();
        author.id = entry.id;
        author.name = entry.name;
        authors.push(author);
      }
    })
    return authors
  }

  static extractAuthor(res: Array<any>) {
    return this.extractAuthors(res)[0]
  }

  /**
   * Gets all the authors
   */
  getAuthors() {
    return this.http.get<Array<any>>(authorPath(null))
  }

  /**
   * Gets an author by it's id
   * @param id The authors id
   */
  getAuthor(id: string) {
    return this.http.get<Array<any>>(authorPath(id))
  }

  /**
   * Updates an author or adds it if it's not already present
   * @param author The book being updated
   */
  updateAuthor(author: Author) {
    // var oldAuthor: Author = this.getAuthor(author.id);
    var oldAuthor = new Author()
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
    author.id = this.nextId + "";
    this.nextId++;
    this.authors.push(author);
    return author.id;
  }

  /**
   * Removes an author by it's id
   * @param id The authors id
   */
  removeAuthor(id: string) {
    this.authors.filter((author) => {
      return author.id !== id;
    })
  }
}
