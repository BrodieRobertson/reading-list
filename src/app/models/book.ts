import { Author } from './author';
import { Illustrator } from './illustrator';
import { ReadingState } from '../reading-state.enum';

export class Book {
  id: Number;
  name: String;
  authors: Array<Author>;
  illustrators: Array<Illustrator>;
  image: String;
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
    this.image = ""
    this.pages = 0;
    this.isbn = "123-4-56-789101-2"
  }

  /**
   * Removes an author from the authored list
   * @param authorToRemove The author to remove
   */
  removeAuthor(authorToRemove: Author) {
    this.authors = this.authors.filter(author => {
      return authorToRemove.id !== author.id
    })
  }

  /**
   * Removes an illustrator from the illustrator list
   * @param illustratorToRemove The illustrator to remove
   */
  removeIllustrator(illustratorToRemove: Illustrator) {
    this.illustrators = this.illustrators.filter(illustrator => {
      return illustratorToRemove.id !== illustrator.id
    })
  }
}
