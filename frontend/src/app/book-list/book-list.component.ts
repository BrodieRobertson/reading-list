import { BookService } from '../services/book.service';
import { Lists } from '../lists.enum';
import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { ReadingState } from '../reading-state.enum';


const regularButtonStyle = "regular-button"
const darkRegularButtonStyle = "regular-button-dark"

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})

export class BookListComponent implements OnInit {
  bookList: Array<Book>;
  buttonStyles: Array<string>;
  previousList: number;
  selectedList: number;
  currentList: Lists;
  listName: String;
  Lists = Lists;
  
  constructor(private books: BookService) {}

  ngOnInit() {
    this.bookList = []
    this.currentList = Lists.ALL;
    this.previousList = -1;
    this.selectedList = -1;
    this.buttonStyles = [];
    for(var i = 0; i < 8; ++i) {
      this.buttonStyles.push(regularButtonStyle)
    }
    this.loadList(this.currentList);
  }

  /**
   * Loads a list of books
   * 
   * @param list The list to load
   */
  loadList(list: Lists) {
    this.books.getBooks().subscribe((res) => this.bookList = BookService.extractBooks(res))

    if(this.selectedList != -1) {
      this.previousList = this.selectedList;
    }

    switch(list) {
      case Lists.CURRENTLY_READING:
        this.listName = "Currently Reading Books"
        this.selectedList = 1;
        this.bookList = this.bookList.filter(book => {
          return book.readingState === ReadingState.CURRENTLY_READING;
        })
        break;
      case Lists.PLAN_TO_READ:
        this.listName = "Plan to Read Books"
        this.selectedList = 2;
        this.bookList = this.bookList.filter(book => {
          return book.readingState === ReadingState.PLAN_TO_READ;
        })
        break;
      case Lists.READ:
        this.listName = "Read Books"
        this.selectedList = 3;
        this.bookList = this.bookList.filter(book => {
          return book.read;
        })
        break;
      case Lists.UNREAD:
        this.listName = "Unread Books"
        this.selectedList = 4;
        this.bookList = this.bookList.filter(book => {
          return !book.read;
        })
        break;
      case Lists.OWNED:
        this.listName = "Owned Books"
        this.selectedList = 5;
        this.bookList = this.bookList.filter(book => {
          return book.owned;
        })
        break;
      case Lists.NOT_OWNED:
        this.listName = "Not Owned Books"
        this.selectedList = 6;
        this.bookList = this.bookList.filter(book => {
          return !book.owned;
        })
        break;
      case Lists.DROPPED:
        this.listName = "Dropped Books"
        this.selectedList = 7;
        this.bookList = this.bookList.filter(book => {
          return book.readingState === ReadingState.DROPPED;
        })
        break;
      default:
        this.listName = "All Books"
        this.selectedList = 0;
        break;
    }

    this.updateButtonStyles()
  }

  /**
   * Updates the styles of the regular buttons
   */
  updateButtonStyles() {
    if(this.previousList != -1) {
      this.buttonStyles[this.previousList] = regularButtonStyle
    }
    this.buttonStyles[this.selectedList] = darkRegularButtonStyle
  }
}

