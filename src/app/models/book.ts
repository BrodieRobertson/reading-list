import { Author } from './author';
import { Illustrator } from './illustrator';
import { ReadingState } from '../reading-state.enum';

export class Book {
  id: Number;
  name: String;
  authors: Array<Author>;
  illustrators: Array<Illustrator>;
  pages: Number;
  isbn: String;
  readingState: ReadingState
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
