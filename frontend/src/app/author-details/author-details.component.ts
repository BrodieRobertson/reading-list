import { AuthorService } from './../services/author.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from './../models/author';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.scss']
})
export class AuthorDetailsComponent implements OnInit {
  author: Author

  constructor(private route: ActivatedRoute, private authors: AuthorService, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.authors.getAuthor(params.get('authorId')).subscribe((res) => {this.author = AuthorService.extractAuthor(res)})
      if(!this.author) {
        this.author = new Author();
      }
    })
  }

  /**
   * Switches to the edit form if the author can be edited
   */
  onEdit() {
    if(this.author.id === "-1") {
      window.alert("This author can not be edited")
    }
    else {
      this.router.navigateByUrl("author/" + this.author.id + "/edit")
    }
  }

  /**
   * Confirms if the author should be deleted if the author can be deleted
   */
  onDelete() {
    if(this.author.id === "-1") {
      window.alert("This author can not be deleted")
    }
    else {
      window.alert("Feature coming soon")
    }
  }
}
