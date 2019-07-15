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
  unread: Boolean;
  owned: Boolean;
  notOwned: Boolean;
  dropped: Boolean;
}
