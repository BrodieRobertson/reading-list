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
import { isNullOrUndefined } from 'util';

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
      this.authorList = [];
      this.illustratorList = [];
      this.book = undefined;
  }

  ngOnInit() {
    this.resetForm();
    this.route.paramMap.subscribe(params => {
      if(params.get("bookId")) {
        this.book = this.books.getBook(Number(params.get('bookId')));
        if(this.book) {
          // Copy out author names from the book
          var tempAuthorControls: FormArray = new FormArray([]);
          if(this.book.authors.length === 0) {
            tempAuthorControls.push(new FormControl(""))
          }
          else {
            this.book.authors.forEach(author => {
              tempAuthorControls.push(new FormControl(author.name))
            })
          }

          // Copy out illustrator names from the book
          var tempIllustratorControls: FormArray = new FormArray([]);
          if(this.book.illustrators.length === 0) {
            tempIllustratorControls.push(new FormControl(""))
          }
          else {
            this.book.illustrators.forEach(illustrator => {
              tempIllustratorControls.push(new FormControl(illustrator.name))
            });
          }

          // Rebuild the form
          this.editForm = this.formBuilder.group({
            name: this.book.name, 
            pages: this.book.pages, 
            image: this.book.image,
            isbn: this.book.isbn, 
            authors: tempAuthorControls, 
            illustrators: tempIllustratorControls,
            readingState: this.book.readingState, 
            read: this.book.read, 
            owned: this.book.owned});
        }
      }
      else {
        this.resetForm()
      }
    })
  }

  /**
   * Resets the form for future usage
   */
  resetForm() {
    this.editForm = this.formBuilder.group({
      name: '',
      pages: 0,
      isbn: '',
      image: '',
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
   * Removes a form array control
   * @param controls The array of controls
   * @param personList The list of person objects
   * @param index The index to remove from
   */
  removeControl(controls: FormArray, personList: Array<any>, index: number) {
    if(controls.length > 1) {
      controls.removeAt(index);
      personList.splice(index, 1)
    }
  }

  /**
   * Removes an author control
   * @param index The index of the control
   */
  removeAuthorControl(index: number) {
    this.removeControl(this.authorControls(), this.authorList, index)
  }

  /**
   * Removes an illustrator control
   * @param index The index of the control 
   */
  removeIllustratorControl(index: number) {
    this.removeControl(this.illustratorControls(), this.illustratorList, index);
  }

  /**
   * Adds a new author control if the clicked control is the current last
   * @param index The index of the clicked control
   */
  addAuthorControl(index: Number) {
    if(index === this.authorControls().length - 1) {
      this.authorControls().push(new FormControl(""))
      this.authorList.push(undefined)
    }
  }

  /**
   * Adds a new illustrator control if the clicked control is the current last 
   * @param index the index of the clicked control
   */
  addIllustratorControl(index: Number) {
    if(index === this.illustratorControls().length - 1) {
      this.illustratorControls().push(new FormControl(""))
      this.illustratorList.push(undefined)
    }
  }

  /**
   * Gets a list of the closest matching authors
   */
  getTopAuthors(name: string) {
    return this.authors.getAuthors();
  }

  /**
   * Gets a list of the closest matching illustrators
   */
  getTopIllustrators(name: string) {
    return this.illustrators.getIllustrators();
  }

  /**
   * Adds an author to author list
   * @param author An author
   * @param index The index to add it at
   */
  addAuthor(author: Author, index: number) {
    this.authorList[index] = author
  }

  /**
   * Adds an illustrator to the illustrator list
   * @param illustrator An illustrator 
   * @param index The index to add it at
   */
  addIllustrator(illustrator: Illustrator, index: number) {
    this.illustratorList[index] = illustrator
  }

  onPersonFocusLost(topResults: Array<any>, personAdder: Function, name: string, index: number) {
    if(topResults.length === 1 && topResults[0].name === name) {
      personAdder(topResults[0], index)
    }
  }
  /**
   * Adds an author to the author list when focus lost if it's an exact match
   * @param index The index to add the author to
   */
  onAuthorFocusLost(index: number) {
    var name: string = this.authorControls().value[index]
    this.onPersonFocusLost(this.getTopAuthors(name), this.addAuthor, name, index)
  }

  /**
   * Adds an illustrator to the illustrator list when focus lost if it's an exact match
   * @param index The index to add the illustrator to
   */
  onIllustratorFocusLost(index: number) {
    var name: string = this.illustratorControls().value[index]
    this.onPersonFocusLost(this.getTopIllustrators(name), this.addIllustrator, name, index)
  }

  /**
   * Extract authors from the text input
   */
  extractAuthors() {
    var controls: FormArray = this.authorControls().value
    for(var i: number = 0; i < controls.length; ++i) {
      if(controls[i] !== "" && isNullOrUndefined(this.authorList[i])) {
        var temp = new Author();
        temp.name = controls[i];
        var id = this.authors.addAuthor(temp)
        var newAuthor = this.authors.getAuthor(id);
        this.authorList[i] = newAuthor;
      }
    }
  }

  /**
   * Extract illustrators from the text input
   */
  extractIllustrators() {
    var controls: FormArray = this.illustratorControls().value
    for(var i: number = 0; i < controls.length; ++i) {
      if(controls[i] !== "" && isNullOrUndefined(this.illustratorList[i])) {
        var temp = new Illustrator();
        temp.name = controls[i];
        var id = this.illustrators.addIllustrator(temp)
        var newAuthor = this.illustrators.getIllustrator(id);
        this.illustratorList[i] = newAuthor;
      }
    }
  }

  /**
   * Save the changes to the book
   */
  onSubmit(value: any) {
    var newBook: Book = new Book();
    this.extractAuthors();
    this.extractIllustrators();

    if(!this.book) {
      newBook.name = value.name;
      newBook.pages = value.pages;
      newBook.isbn = value.isbn;
      newBook.image = value.image;
      newBook.authors = this.authorList
      newBook.illustrators = this.illustratorList
      newBook.readingState = value.readingState;
      newBook.owned = value.owned;
      newBook.read = value.read;
    }
    else {
      // SUPPORT BOOK EDITING
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
