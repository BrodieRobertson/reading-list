import { BookService } from './../book.service';
import { Lists } from '../lists.enum';
import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})

export class BookListComponent implements OnInit {
  bookList: Array<Book>
  currentList: Lists;
  Lists = Lists;
  
  constructor(private books: BookService) {}

  ngOnInit() {
    this.currentList = Lists.CURRENTLY_READING;
    this.getList(this.currentList);
  }

  /**
   * Gets a list of books
   * 
   * @param list The list to load
   */
  getList(list: Lists) {
    this.bookList = this.books.getBooks();
    switch(list) {
      case Lists.CURRENTLY_READING:
        return this.bookList.filter(book => {
          return book.currentlyReading;
        })
      case Lists.DROPPED:
        return this.bookList.filter(book => {
          return book.dropped;
        })
      case Lists.NOT_OWNED:
        return this.bookList.filter(book => {
          return book.notOwned;
        })
      case Lists.OWNED:
        return this.bookList.filter(book => {
          return book.owned;
        })
      case Lists.READ:
        return this.bookList.filter(book => {
          return book.read;
        })
      case Lists.UNREAD:
        return this.bookList.filter(book => {
          return book.unread;
        })
    }
  }
}
