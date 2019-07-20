import { Book } from './../models/book';
import { FormGroup, FormBuilder, FormArray, FormControl, NgControlStatus } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Illustrator } from './../models/illustrator';
import { Component, OnInit } from '@angular/core';
import { IllustratorService } from '../services/illustrator.service';

@Component({
  selector: 'app-edit-illustrator',
  templateUrl: './edit-illustrator.component.html',
  styleUrls: ['./edit-illustrator.component.css']
})
export class EditIllustratorComponent implements OnInit {
  illustrator: Illustrator
  editForm: FormGroup

  constructor(private illustrators: IllustratorService, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.illustrator = this.illustrators.getIllustrator(Number(params.get('illustratorId')));
      if(this.illustrator) {
        // Copy out book names from the illustrator
        var tempBookControls: FormArray = new FormArray([]);
        if(this.illustrator.illustrated.length === 0) {
          tempBookControls.push(new FormControl("")) 
        }
        else {
          this.illustrator.illustrated.forEach(book => {
            tempBookControls.push(new FormControl(book.name))
          })
        }

        // Rebuild the form
        this.editForm = this.formBuilder.group({
          name: this.illustrator.name,
          books: tempBookControls
        })
      }
      else {
        this.router.navigateByUrl("/")
      }
    })
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
   * Update the illustrated book of the illustrator
   */
  updateIllustratedBooks() {
    // If book no longer in list remove it from the illustrated list
    for(var i: number = 0; i < this.illustrator.illustrated.length; ++i) {
      var illustratedBook: Book = this.illustrator.illustrated[i]
      var foundBook = this.bookControls().value.find((book: string) => {
        return book === illustratedBook.name
      })

      if(!foundBook) {
        illustratedBook.removeIllustrator(this.illustrator)
        this.illustrator.removeIllustrated(illustratedBook)
      }
    }
  }

  /**
   * Saves any changes to the illustrator
   * @param value The values used to update the illustrator
   */
  onSubmit(value: any) {
    var oldName: String = new String(this.illustrator.name)
    this.illustrator.name = value.name;
    this.updateIllustratedBooks()
    
    var illustratorId: Number = this.illustrators.updateIllustrator(this.illustrator);
    if(illustratorId >= 0) {
      window.alert(oldName + " successfully updated")
    }
    else {
      window.alert("There was an error saving this illustrator")
      this.router.navigateByUrl("illustrator/" + this.illustrator.id)
    }
    this.resetForm();
  }

  /**
   * Leaves the page without saving any changes
   */
  onCancel() {
    this.resetForm();
    var confirmation: Boolean = window.confirm("Are you sure you want to leave this page, all changes will be lost?")
    if(confirmation) {
      this.router.navigateByUrl("illustrator/" + this.illustrator.id)
    }
  }
}
