import { BookService } from './../book.service';
import { Book } from './../models/book';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book;

  constructor(private route: ActivatedRoute, private books: BookService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      var tempBook: Book = this.books.getBook(Number(params.get('bookId')));
      if(tempBook) {
        this.book = tempBook;
      }
      else {
        this.book = new Book();
      }
    })
  }

}
