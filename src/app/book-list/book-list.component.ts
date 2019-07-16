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
        return this.bookList.filter(book => {
          return book.currentlyReading;
        })
      case Lists.DROPPED:
        this.listName = "Dropped Books"
        return this.bookList.filter(book => {
          return book.dropped;
        })
      case Lists.NOT_OWNED:
        this.listName = "Not Owned Books"
        return this.bookList.filter(book => {
          return !book.owned;
        })
      case Lists.OWNED:
        this.listName = "Owned Books"
        return this.bookList.filter(book => {
          return book.owned;
        })
      case Lists.READ:
        this.listName = "Read Books"
        return this.bookList.filter(book => {
          return book.read;
        })
      case Lists.UNREAD:
        this.listName = "Unread Books"
        return this.bookList.filter(book => {
          return !book.read;
        })
      default:
        this.listName = "All Books"
        return this.bookList;
    }
  }
}
