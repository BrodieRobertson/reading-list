import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { AuthorDetailsComponent } from './author-details/author-details.component';
import { IllustratorDetailsComponent } from './illustrator-details/illustrator-details.component';
import { EditAuthorComponent } from './edit-author/edit-author.component';
import { EditIllustratorComponent } from './edit-illustrator/edit-illustrator.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    BookListComponent,
    BookDetailsComponent,
    EditBookComponent,
    AuthorDetailsComponent,
    IllustratorDetailsComponent,
    EditAuthorComponent,
    EditIllustratorComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: BookListComponent },
      { path: 'book/:bookId', component: BookDetailsComponent },
      { path: 'author/:authorId', component: AuthorDetailsComponent },
      { path: 'illustrator/:illustratorId', component: IllustratorDetailsComponent },
      { path: 'new', component: EditBookComponent },
      { path: 'book/:bookId/edit', component: EditBookComponent },
      { path: 'author/:authorId/edit', component: EditAuthorComponent },
      { path: 'illustrator/:illustratorId/edit', component: EditIllustratorComponent },
      { path: '**', component: PageNotFoundComponent }
    ]),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
