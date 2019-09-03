import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

 /**
   * General error handler function
   * @param error The error that occured
   * @param callback A callback function to handle any cleanup
   */
 export function handleApiError(error: HttpErrorResponse, callback: Function){
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } 
  else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
    `Backend returned code ${error.status}, ` +
    `body was: ${error.error}`);
  }
  if(callback) {
    callback(error.status)
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
};