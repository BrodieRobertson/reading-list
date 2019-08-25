import { Book } from './../models/book';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from './../services/author.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Author } from './../models/author';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-author',
  templateUrl: './edit-author.component.html',
  styleUrls: ['./edit-author.component.scss']
})
export class EditAuthorComponent implements OnInit {
  author: Author
  editForm: FormGroup

  constructor(private authors: AuthorService, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.authors.getAuthor(params.get('authorId')).subscribe((res) => {this.author = AuthorService.extractAuthor(res)});
    })
  }

  buildForm() {
    // Copy out book names from author
    var tempBookControls: FormArray = new FormArray([]);
    if(this.author.authored.length === 0) {
      tempBookControls.push(new FormControl(""))
    }
    else {
      this.author.authored.forEach(book => {
        tempBookControls.push(new FormControl(book.name))
      })
    }

    // Rebuild the form
    this.editForm = this.formBuilder.group({
      name: this.author.name,
      books: tempBookControls
    })

    return this.editForm;
  }

  /**
   * Resets the form for future usage
   */
  resetForm() {
    this.editForm = this.formBuilder.group({
      name: '',
      books: new FormArray([new FormControl("")])
    })
  }

  /**
   * Gets the book controls
   */
  bookControls() {
    return this.editForm.get("books") as FormArray
  }

  /**
   * Removes a book control
   * @param index The index to remove from
   */
  removeBookControl(index: number) {
    this.bookControls().removeAt(index);
  }

  /**
   * Update the authored book of the author
   */
  updateAuthoredBooks() {
    // If book no longer in list remove it from the authored list
    for(var i: number = 0; i < this.author.authored.length; ++i) {
      var authoredBook: Book = this.author.authored[i]
      var foundBook = this.bookControls().value.find((book: string) => {
        return book === authoredBook.name
      })

      if(!foundBook) {
        authoredBook.removeAuthor(this.author)
        this.author.removeAuthored(authoredBook)
      }
    }
  }

  /**
   * Saves any change to the author 
   * @param value The values used to update the author
   */
  onSubmit(value: any) {
    var oldName: String = new String(this.author.name)
    this.author.name = value.name
    this.updateAuthoredBooks();
    
    var authorId = this.authors.updateAuthor(this.author)
    if(authorId !== "-1") {
      window.alert(oldName + " successfully updated")
    }
    else {
      window.alert("There was an error saving this author")
    }
    
    this.router.navigateByUrl("author/" + this.author.id)
    this.resetForm();
  }

  /**
   * Leaves the page without saving any changes 
   */
  onCancel() {
    this.resetForm();
    var confirmation: Boolean = window.confirm("Are you sure you want to leave this page, all change will be lost?")
    if(confirmation) {
      this.router.navigateByUrl("author/" + this.author.id)
    }
  }

}