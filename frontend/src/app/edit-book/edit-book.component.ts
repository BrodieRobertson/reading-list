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
import { IdentifiableFormControl } from '../identifiable-form-control';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent implements OnInit {
  editForm: FormGroup;
  book: Book;
  illustratorList: Array<Illustrator>
  authorList: Array<Author>
  topAuthors: Array<Array<Author>>
  topIllustrators: Array<Array<Illustrator>>
  ReadingState = ReadingState;

  constructor(private books: BookService, private authors: AuthorService, private illustrators: IllustratorService,
    private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
      this.authorList = [];
      this.illustratorList = [];
      this.topAuthors = []
      this.topIllustrators = []
      this.book = null;
  }

  ngOnInit() {
    this.resetForm();
    this.route.paramMap.subscribe(params => {
      if(params.get("bookId")) {
        this.books.getBook(params.get('bookId')).subscribe((res) => {this.book = BookService.extractBook(res); this.buildForm()});
      }
    })
  }

  buildForm() {
    // Copy out author names from the book
    var tempAuthorControls: FormArray = new FormArray([]);
    if(this.book.authors.length === 0) {
      tempAuthorControls.push(new FormControl(""))
    }
    else {
      this.book.authors.forEach(author => {
        tempAuthorControls.push(new IdentifiableFormControl(author.name, author.id))
      })
    }

    // Copy out illustrator names from the book
    var tempIllustratorControls: FormArray = new FormArray([]);
    if(this.book.illustrators.length === 0) {
      tempIllustratorControls.push(new FormControl(""))
    }
    else {
      this.book.illustrators.forEach(illustrator => {
        tempIllustratorControls.push(new IdentifiableFormControl(illustrator.name, illustrator.id))
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
  removeControl(controls: FormArray, personList: Array<any>, topPersonList: Array<any>, index: number) {
    if(controls.length > 1) {
      controls.removeAt(index);
      topPersonList.splice(index, 1)
      personList.splice(index, 1)
    }
  }

  /**
   * Removes an author control
   * @param index The index of the control
   */
  removeAuthorControl(index: number) {
    this.removeControl(this.authorControls(), this.authorList, this.topAuthors, index)
  }

  /**
   * Removes an illustrator control
   * @param index The index of the control 
   */
  removeIllustratorControl(index: number) {
    this.removeControl(this.illustratorControls(), this.illustratorList, this.topIllustrators, index);
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
   * Updates the top authors list
   * @param name The name to check for
   */
  updateTopAuthors(index: number, name: string) {
    this.authors.getAuthors().subscribe((res) => {
      var tempAuthors = AuthorService.extractAuthors(res)
      var regex = new RegExp(name);
      tempAuthors = tempAuthors.filter(author => {
        if(regex.test(author.name)) {
          return author
        }
      })

      if(tempAuthors.length > 5) {
        tempAuthors = tempAuthors.slice(0, 5)
      }
      this.topAuthors[index] = tempAuthors
    });
  }

  /**
   * Updates the illustrators list
   * @param name The name to check for
   */
  updateTopIllustrators(index: number, name: string) {
    this.illustrators.getIllustrators().subscribe((res) => {
      var tempIllustrators = IllustratorService.extractIllustrators(res)
      var regex = new RegExp(name);
      tempIllustrators = tempIllustrators.filter(illustrator => {
        if(regex.test(illustrator.name)) {
          return illustrator;
        }
      })
      if(tempIllustrators.length > 5) {
        tempIllustrators = tempIllustrators.slice(0, 5);
      }
      this.topIllustrators[index] = tempIllustrators
    });
  }

  /**
   * Sets the value of a control to a new author
   * @param author The author being set
   * @param index The index of the control
   */
  setAuthor(author: Author, index: number) {
    this.authorControls().setControl(index, new IdentifiableFormControl(author.name, author.id))
  }

  /**
   * Sets the value of a control to a new illustrator
   * @param illustrator The illustrator being set
   * @param index The index of the control
   */
  setIllustrator(illustrator: Illustrator, index: number) {
    this.illustratorControls().setControl(index, new IdentifiableFormControl(illustrator.name, illustrator.id))
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

  /**
   * Adds a person to a person list when focus is lost if it's an exact match
   * @param topResults The top results for the input
   * @param personAdder The method to add a new person
   * @param name The name of the person
   * @param index The index of the control
   */
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
    this.onPersonFocusLost(this.topAuthors, this.addAuthor, name, index)
  }

  /**
   * Adds an illustrator to the illustrator list when focus lost if it's an exact match
   * @param index The index to add the illustrator to
   */
  onIllustratorFocusLost(index: number) {
    var name: string = this.illustratorControls().value[index]
    this.onPersonFocusLost(this.topIllustrators, this.addIllustrator, name, index)
  }

  /**
   * Updates the authored lists for the authors that have been added or removed 
   * @param book The book being checked for
   */
  updateAuthoredBooks(book: Book) {
    // Add or update the book in authored for authors in list
    for(var i: number = 0; i < this.authorList.length; ++i) {
      if(!isNullOrUndefined(this.authorList[i])) {
        this.authorList[i].addAuthored(book);
      }
    }

    // Remove book from any removed authors
    for(var i: number = 0; i < book.authors.length; ++i) {
      var foundAuthor: Author = this.authorList.find(author => {
        if(!isNullOrUndefined(author)) {
          return author.id === book.authors[i].id;
        }
      })

      // If author no longer in list, remove this book from it's authored list
      if(!foundAuthor) {
        book.authors[i].removeAuthored(book)
        book.removeAuthor(book.authors[i])
      }
    }
  }

  /**
   * Extract authors from the text input
   */
  extractAuthors() {
    var controls = this.authorControls().controls
    for(var i: number = 0; i < controls.length; ++i) {
      if(controls[i].value !== "") {
        var temp = new Author();
        temp.name = controls[i].value;
        if(controls[i] instanceof IdentifiableFormControl) {
          temp.id = (controls[i] as IdentifiableFormControl).id
        }
        // this.authors.getAuthor(id).subscribe((res) => {this.authorList[i] = AuthorService.extractAuthor(res)});
        this.authorList[i] = temp
      }
      else {
        controls.splice(i, 1)
        this.authorList.splice(i, 1)
        --i;
      }
    }
  }

  /**
   * Updates the illustrated lists for the illustrators that have been added or removed 
   * @param book The book being checked for
   */
  updateIllustratedBooks(book: Book) {
    // Add or update the book in illustrated for illustrators in list
    for(var i: number = 0; i < this.illustratorList.length; ++i) {
      if(!isNullOrUndefined(this.illustratorList[i])) {
        this.illustratorList[i].addIllustrated(book);
      }
    }

    // Remove book from any removed illustrators
    for(var i: number = 0; i < book.illustrators.length; ++i) {
      var foundIllustrator: Illustrator = this.illustratorList.find(illustrator => {
        if(!isNullOrUndefined(illustrator)) {
          return illustrator.id === book.illustrators[i].id;
        }
      })

      // If illustrator no longer in list, remove this book from it's illustrated list
      if(!foundIllustrator) {
        book.illustrators[i].removeIllustrated(book)
        book.removeIllustrator(book.illustrators[i])
      }
    }
  }

  /**
   * Extract illustrators from the text input
   */
  extractIllustrators() {
    var controls = this.illustratorControls().controls
    for(var i: number = 0; i < controls.length; ++i) {
      if(controls[i].value !== "") {
        var temp = new Illustrator();
        temp.name = controls[i].value;
        if(controls[i] instanceof IdentifiableFormControl) {
          temp.id = (controls[i] as IdentifiableFormControl).id
        }
        // this.illustrators.getIllustrator(id).subscribe((res) => {this.illustratorList[i] = IllustratorService.extractIllustrator(res)});
        this.illustratorList[i] = temp
      }
      else {
        controls.splice(i, 1)
        this.illustratorList.splice(i, 1)
        --i;
      }
    }
  }

  /**
   * Save the changes to the book
   */
  onSubmit(value: any) {
    var submittedBook: Book;
    if(!this.book) {
      submittedBook = new Book();
    }
    else {
      submittedBook = this.book
    }

    // Set all the new book data
    this.extractAuthors();
    this.extractIllustrators();
    this.updateIllustratedBooks(submittedBook);
    this.updateAuthoredBooks(submittedBook);

    submittedBook.name = value.name;
    submittedBook.pages = value.pages;
    submittedBook.isbn = value.isbn;
    submittedBook.image = value.image;
    submittedBook.authors = this.authorList
    submittedBook.illustrators = this.illustratorList
    submittedBook.readingState = value.readingState;
    submittedBook.owned = value.owned;
    submittedBook.read = value.read;

    var bookId = this.books.updateBook(submittedBook);

    // Display confirmation message
    if(bookId !== "-1") {
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

  /**
   * Leaves this page without saving the changes
   */
  onCancel() {
    this.resetForm();
    var confirmation: Boolean = window.confirm("Are you sure you want to leave this page, all changes will be lost?");
    if(confirmation) {
      if(this.book) {
        this.router.navigateByUrl("book/" + this.book.id)
      }
      else {
        this.router.navigateByUrl("/")
      }
    }
  }
}
