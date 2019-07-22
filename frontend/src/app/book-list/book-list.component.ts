import { BookService } from '../services/book.service';
import { Lists } from '../lists.enum';
import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { ReadingState } from '../reading-state.enum';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})

export class BookListComponent implements OnInit {
  bookList: Array<Book>
  currentList: Lists;
  listName: String;
  Lists = Lists;
  
  constructor(private books: BookService) {}

  ngOnInit() {
    this.currentList = Lists.ALL;
    this.loadList(this.currentList);
  }

  /**
   * Loads a list of books
   * 
   * @param list The list to load
   */
  loadList(list: Lists) {
    this.bookList = this.books.getBooks();
    switch(list) {
      case Lists.CURRENTLY_READING:
        this.listName = "Currently Reading Books"
        this.bookList = this.bookList.filter(book => {
          return book.readingState === ReadingState.CURRENTLY_READING;
        })
        break;
      case Lists.DROPPED:
        this.listName = "Dropped Books"
        this.bookList = this.bookList.filter(book => {
          return book.readingState === ReadingState.DROPPED;
        })
        break;
      case Lists.PLAN_TO_READ:
        this.listName = "Plan to Read Books"
        this.bookList = this.bookList.filter(book => {
          return book.readingState === ReadingState.PLAN_TO_READ;
        })
        break;
      case Lists.NOT_OWNED:
        this.listName = "Not Owned Books"
        this.bookList = this.bookList.filter(book => {
          return !book.owned;
        })
        break;
      case Lists.OWNED:
        this.listName = "Owned Books"
        this.bookList = this.bookList.filter(book => {
          return book.owned;
        })
        break;
      case Lists.READ:
        this.listName = "Read Books"
        this.bookList = this.bookList.filter(book => {
          return book.read;
        })
        break;
      case Lists.UNREAD:
        this.listName = "Unread Books"
        this.bookList = this.bookList.filter(book => {
          return !book.read;
        })
        break;
      default:
        this.listName = "All Books"
        break;
    }
  }
}
