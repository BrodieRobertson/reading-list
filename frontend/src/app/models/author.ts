import { Book } from './book';

export class Author {
  id: Number;
  name: string;
  authored: Array<Book>

  constructor() {
    this.id = -1
    this.name = "No Name"
    this.authored = []
  }

  /**
   * Adds an authored book only if it's not already in the list, if it is it will be updated
   * @param book The book to add
   */
  addAuthored(book: Book) {
    var foundBook = this.authored.find(authoredBook => {
      return authoredBook.id === book.id
    })

    if(!foundBook) {
      this.authored.push(book)
    }
    else {
      foundBook = book;
    }
  }

  /**
   * Removes an authored book from the list
   * @param name The name of the book
   */
  removeAuthored(book: Book) {
    this.authored = this.authored.filter(authoredBook => {
      return authoredBook.id !== book.id
    })
  }
}
