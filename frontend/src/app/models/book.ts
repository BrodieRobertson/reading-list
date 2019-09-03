import { Author } from './author';
import { Illustrator } from './illustrator';
import { ReadingState } from '../utils/reading-state.enum';

export class Book {
  id: string;
  name: string;
  authors: Array<Author>;
  illustrators: Array<Illustrator>;
  image: string;
  pages: number;
  isbn: string;
  readingState: ReadingState
  read: boolean;
  owned: boolean;

  constructor(id?: string, name?: string, authors?: Array<Author>, illustrators?: Array<Illustrator>, image?: string, page?: number, isbn?: string) {
    this.id = id ? id : "-1";
    this.name = name ? name : "No Name"
    this.authors = authors ? authors : []
    this.illustrators = illustrators ? illustrators : []
    this.image = image ? image : ""
    this.pages = page ? page : 0;
    this.isbn = isbn ? isbn : "123-4-56-789101-2"
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
