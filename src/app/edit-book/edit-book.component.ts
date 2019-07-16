import { Author } from './../models/author';
import { Illustrator } from './../models/illustrator';
import { AuthorService } from './../services/author.service';
import { ReadingState } from './../reading-state.enum';
import { Book } from './../models/book';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Form } from '@angular/forms';
import { IllustratorService } from '../services/illustrator.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  editForm: FormGroup;
  book: Book;
  illustratorList: Array<Illustrator>
  authorList: Array<Author>
  ReadingState = ReadingState;

  constructor(private books: BookService, private authors: AuthorService, private illustrators: IllustratorService,
    private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
      this.authorList = this.authors.getAuthors();
      this.illustratorList = this.illustrators.getIllustrators();
      this.book = undefined;
  }

  /**
   * Initialize the form
   */
  initializeForm() {
    
  }

  ngOnInit() {
    this.resetForm();
    this.route.paramMap.subscribe(params => {
      if(params.get("bookId")) {
        this.book = this.books.getBook(Number(params.get('bookId')));
        if(this.book) {
          this.editForm.setValue({name: this.book.name, pages: this.book.pages, 
            isbn: this.book.isbn, authors: this.book.authors, illustrators: this.book.illustrators,
            readingState: this.book.readingState, read: this.book.read, owned: this.book.owned});
        }
      }
      else {
        this.resetForm()
      }
    })
  }

  resetForm() {
    this.editForm = this.formBuilder.group({
      name: '',
      pages: 0,
      isbn: '',
      authors: new FormArray([new FormControl("")]),
      illustrators: new FormArray([new FormControl("")]),
      readingState: ReadingState.PLAN_TO_READ,
      read: false,
      owned: false,
    })
  }

  /**
   * Gets the author controls
   */
  authorControls(): FormArray {
    return this.editForm.get("authors") as FormArray
  }
  
  /**
   * Gets the illustrator controls
   */
  illustratorControls(): FormArray {
    return this.editForm.get("illustrators") as FormArray
  }

  /**
   * Removes an author control
   * @param index The index of the control
   */
  removeAuthorControl(index: Number) {
    if(this.authorControls().length > 1) {
      this.authorControls().removeAt(index.valueOf())
    }
  }

  /**
   * Removes an illustrator control
   * @param index The index of the control 
   */
  removeIllustratorControl(index: Number) {
    if(this.illustratorControls().length > 1) {
      this.illustratorControls().removeAt(index.valueOf())
    }
  }

  /**
   * Adds a new author control if the clicked control is the current last
   * @param index The index of the clicked control
   */
  addAuthorControl(index: Number) {
    if(index === this.authorControls().length - 1) {
      this.authorControls().push(new FormControl(""))
    }
  }

  /**
   * Adds a new illustrator control if the clicked control is the current last 
   * @param index the index of the clicked control
   */
  addIllustratorControl(index: Number) {
    if(index === this.illustratorControls().length - 1) {
      this.illustratorControls().push(new FormControl(""))
    }
  }

  /**
   * Gets a list of the closest matching authors
   */
  getTopAuthors() {
    return this.authors;
  }

  /**
   * Gets a list of the closest matching illustrators
   */
  getTopIllustrators() {
    return this.illustrators;
  }

  addAuthor(author: Author) {

  }

  addIllustrator(illustrator: Illustrator) {

  }

  /**
   * Save the changes to the book
   */
  onSubmit(value: any) {
    var newBook: Book = new Book();
    if(!this.book) {
      newBook.name = value.name;
      newBook.pages = value.pages;
      newBook.isbn = value.isbn;
      // newBook.authors = value.authors;
      // newBook.illustrators = value.illustrators;
      newBook.readingState = value.readingState;
      newBook.owned = value.owned;
      newBook.read = value.read;
    }
    else {

    }
    var bookId: Number = this.books.addBook(newBook);

    if(bookId >= 0) {
      if(!this.book) {
        window.alert("New book successfully added")
      }
      else {
        window.alert(this.book.name + " successfully updated")
      }
      this.router.navigateByUrl("book/" + bookId)
    }
    else {
      window.alert("There was an error saving this book")
      this.router.navigateByUrl("/")
    }

    this.resetForm();
  }
}
