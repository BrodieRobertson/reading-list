import { Book } from './../models/book';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Illustrator } from './../models/illustrator';
import { Injectable } from '@angular/core';
import { illustratorPath } from '../utils/api-routes';
import { catchError } from 'rxjs/operators';
import { handleApiError } from '../utils/handle-api-error';
import { httpOptions } from '../utils/http-options';

@Injectable({
  providedIn: 'root'
})
export class IllustratorService {
  nextId: number;
  illustrators: Array<Illustrator>;

  constructor(private http: HttpClient) {
    this.illustrators = []
    this.nextId = 0;
  }

  /**
   * Extracts the author objects from the response
   * @param res The response from the server 
   */
  static extractIllustrators(res: Array<any>) {
    var illustrators = []
    res.forEach((entry) => {
      var idFound = -1;
      for(var i = 0; i < illustrators.length; ++i) {
        if(illustrators[i].id === entry.id) {
          idFound = i;
          break;
        }
      }
      
      if(idFound  < 0) {
        var illustrator = new Illustrator(entry.id, entry.name);
        illustrators.push(illustrator);
      }
      else {
        var book = new Book(entry.bookId, entry.bookName);
        illustrators[idFound].illustrated.push(book)
      }
    })
    return illustrators
  }

  /**
   * Extracts an author object from the response
   * @param res The response from the server
   */
  static extractIllustrator(res: Array<any>) {
    return this.extractIllustrators(res)[0]
  }
  /**
   * Gets all of the illustrators
   */
  getIllustrators(errorCallback?: Function) {
    return this.http.get<Array<any>>(illustratorPath(null)).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback))
    )
  }

  /**
   * Gets an illustrator by it's id
   * @param id The illustrators id
   */
  getIllustrator(id: string, errorCallback?: Function) {
    return this.http.get<Array<any>>(illustratorPath(id)).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback))
    )
  }

  /**
   * Adds a new illustrator
   * @param illustrator The new illustrator
   */
  addIllustrator(illustrator: Illustrator, errorCallback?: Function) {
    return this.http.post(illustratorPath(null), illustrator, httpOptions).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback))
    )
    // illustrator.id = this.nextId + "";
    // ++this.nextId;
    // this.illustrators.push(illustrator);
    // return illustrator.id;
  }

  /**
   * Updates an illustrator or adds it if it's not already present
   * @param illustrator The book being updated
   */
  updateIllustrator(illustrator: Illustrator, errorCallback?: Function) {
    this.http.put(illustratorPath(illustrator.id), illustrator, httpOptions).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback))
    )
    // var oldIllustrator: Illustrator = this.getIllustrator(illustrator.id);
    // var oldIllustrator = new Illustrator()
    // if(oldIllustrator) {
    //   oldIllustrator = illustrator;
    //   return oldIllustrator.id
    // }
    // else {
    //   return this.addIllustrator(illustrator);
    // }
  }

  /**
   * Removes a illustrator by it's id
   * @param id The illustrators id 
   */
  removeIllustrator(id: string, errorCallback?: Function) {
    this.http.delete(illustratorPath(id)).pipe(
      catchError((err: HttpErrorResponse) => handleApiError(err, errorCallback))
    )
    // this.illustrators.filter((illustrator) => {
    //   return illustrator.id !== id;
    // })
  }
}
