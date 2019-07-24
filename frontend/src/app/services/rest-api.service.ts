import { Type } from './../type.enum';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RestApiService {
  url = "http://localhost:3306";

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  }

  constructor(private http: HttpClient) { }

  selectPath(type: Type) {
    switch(type) {
      case Type.AUTHOR:
        return "/author";
      case Type.ILLUSTRATOR:
        return "/illustrator";
      case Type.BOOK:
        return "/book";
      case Type.BOOK_AUTHOR:
        return "/bookauthor";
      case Type.BOOK_ILLUSTRATOR:
        return "/bookillustrator";
      default:
        return "";
    }
  }
  /**
   * Gets all the rows for a type
   * @param type The model type
   */
  getAll(type: Type) {
    return this.http.get(this.url + this.selectPath(type)).pipe(
      retry(1), catchError(this.handleError)
    );
  }

  /**
   * Gets a row for a type
   * @param type The model type
   * @param id The id
   */
  get(type: Type, id: number) {
    return this.http.get(this.url + this.selectPath(type) + "/" + id).pipe(
      retry(1), catchError(this.handleError)
    )
  }

  /**
   * Creates a row and any foreign key related rows for a type
   * @param type The model type
   * @param payload The payload
   */
  create(type: Type, payload: any) {
    return this.http.put(this.url + this.selectPath(type), JSON.stringify(payload), this.httpOptions).pipe(
      retry(1), catchError(this.handleError)
    )
  }

  /**
   * Updates all rows associated with the payload
   * @param type The model type
   * @param id The id
   * @param payload The payload
   */
  update(type: Type, id: number, payload: any) {
    return this.http.post(this.url + this.selectPath(type) + "/" + id, JSON.stringify(payload), this.httpOptions).pipe(
      retry(1), catchError(this.handleError)
    )
  }

  /**
   * Deletes a row and any associated rows
   * @param type The type
   * @param id The id
   */
  delete(type: Type, id: number) {
    return this.http.delete(this.url + this.selectPath(type) + "/" + id, this.httpOptions).pipe(
      retry(1), catchError(this.handleError)
    )
  }

  /**
   * Handles an error created by an api call
   * @param error The error that occurred
   */
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } 
    else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
