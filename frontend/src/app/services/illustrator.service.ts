import { HttpClient } from '@angular/common/http';
import { Illustrator } from './../models/illustrator';
import { Injectable } from '@angular/core';
import { illustratorPath } from '../utils/api-routes';

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
        var illustrator = new Illustrator();
        illustrator.id = entry.id;
        illustrator.name = entry.name;
        illustrators.push(illustrator);
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
  getIllustrators() {
    return this.http.get<Array<any>>(illustratorPath(null))
  }

  /**
   * Gets an illustrator by it's id
   * @param id The illustrators id
   */
  getIllustrator(id: string) {
    return this.http.get<Array<any>>(illustratorPath(id))
  }

  /**
   * Adds a new illustrator
   * @param illustrator The new illustrator
   */
  addIllustrator(illustrator: Illustrator) {
    illustrator.id = this.nextId + "";
    ++this.nextId;
    this.illustrators.push(illustrator);
    return illustrator.id;
  }

  /**
   * Updates an illustrator or adds it if it's not already present
   * @param illustrator The book being updated
   */
  updateIllustrator(illustrator: Illustrator) {
    // var oldIllustrator: Illustrator = this.getIllustrator(illustrator.id);
    var oldIllustrator = new Illustrator()
    if(oldIllustrator) {
      oldIllustrator = illustrator;
      return oldIllustrator.id
    }
    else {
      return this.addIllustrator(illustrator);
    }
  }

  /**
   * Removes a illustrator by it's id
   * @param id The illustrators id 
   */
  removeIllustrator(id: string) {
    this.illustrators.filter((illustrator) => {
      return illustrator.id !== id;
    })
  }
}
