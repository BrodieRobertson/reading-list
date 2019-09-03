import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book.service';
import { Lists } from '../utils/lists.enum';
import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { ReadingState } from '../utils/reading-state.enum';


const regularButtonStyle = "regular-button"
const darkRegularButtonStyle = "regular-button-dark"

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})

export class BookListComponent implements OnInit {
  cachedBooks: Array<Book>;
  buttonStyles: Array<string>;
  previousList: number;
  selectedList: number;
  currentList: Lists;
  listName: String;
  Lists = Lists;
  
  constructor(private route: ActivatedRoute, private books: BookService) {}

  ngOnInit() {
    this.cachedBooks = []
    this.route.paramMap.subscribe(params => {
      this.books.getBooks().subscribe((res) => this.cachedBooks = BookService.extractBooks(res))
    })

    this.currentList = Lists.ALL;
    this.previousList = -1;
    this.selectedList = -1;
    this.buttonStyles = [];

    for(var i = 0; i < 8; ++i) {
      this.buttonStyles.push(regularButtonStyle)
    }
    this.changeList(this.currentList);
  }

  /**
   * Loads a list of books
   * 
   * @param list The list to load
   */
  changeList(list: Lists) {
    if(this.selectedList != -1) {
      this.previousList = this.selectedList;
    }

    switch(list) {
      case Lists.CURRENTLY_READING:
        this.listName = "Currently Reading Books"
        this.selectedList = 1;
        break;
      case Lists.PLAN_TO_READ:
        this.listName = "Plan to Read Books"
        this.selectedList = 2;
        break;
      case Lists.READ:
        this.listName = "Read Books"
        this.selectedList = 3;
        break;
      case Lists.UNREAD:
        this.listName = "Unread Books"
        this.selectedList = 4;
        break;
      case Lists.OWNED:
        this.listName = "Owned Books"
        this.selectedList = 5;
        break;
      case Lists.NOT_OWNED:
        this.listName = "Not Owned Books"
        this.selectedList = 6;
        break;
      case Lists.DROPPED:
        this.listName = "Dropped Books"
        this.selectedList = 7;
        break;
      default:
        this.listName = "All Books"
        this.selectedList = 0;
        break;
    }

    this.updateButtonStyles()
  }

  /**
   * Loads the data for the current list
   */
  loadList() {
    switch(this.selectedList) {
      case Lists.CURRENTLY_READING:
        return this.cachedBooks.filter(book => {
          return book.readingState === ReadingState.CURRENTLY_READING;
        })
      case Lists.PLAN_TO_READ:
        return this.cachedBooks.filter(book => {
          return book.readingState === ReadingState.PLAN_TO_READ;
        })
      case Lists.READ:
        return this.cachedBooks.filter(book => {
          return book.read;
        })
      case Lists.UNREAD:
        return this.cachedBooks.filter(book => {
          return !book.read;
        })
      case Lists.OWNED:
        return this.cachedBooks.filter(book => {
          return book.owned;
        })
      case Lists.NOT_OWNED:
        return this.cachedBooks.filter(book => {
          return !book.owned;
        })
      case Lists.DROPPED:
        return this.cachedBooks.filter(book => {
          return book.readingState === ReadingState.DROPPED;
        })
      default:
        return this.cachedBooks;
      }
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

