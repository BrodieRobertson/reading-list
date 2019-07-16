import { ReadingState } from './../reading-state.enum';
import { Book } from './../models/book';
import { ActivatedRoute, Router } from '@angular/router';
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
  bookName: String;
  ReadingState = ReadingState;

  constructor(private route: ActivatedRoute, private books: BookService, private formBuilder: FormBuilder, private router: Router) {
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
        this.bookName = book.name;
      }
    })
  }

  /**
   * Save the changes to the book
   */
  onSubmit(value: any) {
    var newBook: Book = new Book();
    newBook.name = value.name;
    newBook.pages = value.pages;
    newBook.isbn = value.isbn;
    newBook.authors = value.authors;
    newBook.illustrators = value.illustrators;
    newBook.readingState = value.readingState;
    newBook.owned = value.owned;
    newBook.read = value.read;
    var bookId: Number = this.books.addToList(newBook);

    if(bookId) {
      if(this.bookName === "") {
        window.alert("New book successfully added")
      }
      else {
        window.alert(this.bookName + " successfully updated")
      }
      this.router.navigateByUrl("book/" + bookId)
    }
    else {
      window.alert("There was an error saving this book")
      this.router.navigateByUrl("/")
    }
  }
}
