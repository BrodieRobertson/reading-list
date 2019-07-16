import { Author } from './author';
import { Illustrator } from './illustrator';

export class Book {
  id: Number;
  name: String;
  authors: Array<Author>;
  illustrators: Array<Illustrator>;
  pages: Number;
  isbn: String;
  currentlyReading: Boolean;
  read: Boolean;
  owned: Boolean;
  dropped: Boolean;

  constructor() {
    this.id = -1;
    this.name = "No Name"
    this.authors = []
    this.illustrators = []
    this.pages = 0;
    this.isbn = "123-4-56-789101-2"
  }
}
