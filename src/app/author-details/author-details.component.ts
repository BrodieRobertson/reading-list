import { AuthorService } from './../services/author.service';
import { ActivatedRoute } from '@angular/router';
import { Author } from './../models/author';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.css']
})
export class AuthorDetailsComponent implements OnInit {
  author: Author

  constructor(private route: ActivatedRoute, private authors: AuthorService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      var tempAuthor: Author = this.authors.getAuthor(Number(params.get('authorId')))
      if(tempAuthor) {
        this.author = tempAuthor;
      }
      else {
        this.author = new Author();
      }
    })
  }

}
