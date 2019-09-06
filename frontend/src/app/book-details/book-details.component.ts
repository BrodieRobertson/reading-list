import { ReadingState } from '../utils/reading-state.enum';
import { BookService } from '../services/book.service';
import { Book } from './../models/book';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  book: Book;
  ReadingState = ReadingState

  constructor(private route: ActivatedRoute, private books: BookService, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.books.getBook(params.get('bookId')).subscribe((res) => {this.book = BookService.extractBook(res)});
      if(!this.book) {
        this.book = new Book();
      }
    })
  }

  /**
   * Switches to the edit form if the book can be edited
   */
  onEdit() {
    if(this.book.id === "-1") {
      window.alert("This book can not be edited")
    }
    else {
      this.router.navigateByUrl("book/" + this.book.id + "/edit");
    }
  }

  /**
   * Confirms if the book should be deleted if the book can be deleted
   */
  onDelete() {
    if(this.book.id === "-1") {
      window.alert("This book can not be deleted")
    }
    else {
      var answer: Boolean = window.confirm("Are you sure you want to delete " + this.book.name + "?");
      if(answer) {
        this.books.removeBook(this.book.id).subscribe((res) => {
          window.alert(this.book.name + " has been deleted, returning to the list");
          this.router.navigateByUrl("/")
        });
      }
    }
  }
}
