import { Book } from './book';

export class Illustrator {
  id: string;
  name: string;
  illustrated: Array<Book>

  constructor(id?: string, name?: string, illustrated?: Array<Book>) {
    this.id = id ? id : "-1"
    this.name = name ? name : "No Name"
    this.illustrated = illustrated ? illustrated : []
  }

  /**
   * Adds an illustrated book only if it's not already in the list, if it is it will be updated
   * @param book The book to add
   */
  addIllustrated(book: Book) {
    var foundBook = this.illustrated.find(illustratedBook => {
      return illustratedBook.id === book.id
    })

    if(!foundBook) {
      this.illustrated.push(book)
    }
    else {
      foundBook = book;
    }
  }

  /**
   * Removes an illustrated book from the list
   * @param name The name of the book
   */
  removeIllustrated(book: Book) {
    this.illustrated = this.illustrated.filter(illustratedBook => {
      return illustratedBook.id !== book.id
    })
  }
}
