import { ReadingState } from './../reading-state.enum';
import { Book } from './../models/book';
import { ActivatedRoute } from '@angular/router';
import { BookService } from './../book.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  editForm: FormGroup;
  ReadingState = ReadingState;

  constructor(private route: ActivatedRoute, private books: BookService, private formBuilder: FormBuilder) {
    this.editForm = formBuilder.group({
      name: '',
      pages: 0,
      isbn: '',
      authors: [],
      illustrators: [],
      readingState: ReadingState.PLAN_TO_READ,
      read: false,
      owned: false,
    })
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      var book: Book = this.books.getBook(Number(params.get('bookId')));
      if(book) {
        this.editForm.setValue({name: book.name, pages: book.pages, 
          isbn: book.isbn, authors: book.authors, illustrators: book.illustrators,
          readingState: book.readingState, read: book.read, owned: book.owned});
      }
    })
  }

  onSubmit(value) {

  }
}
