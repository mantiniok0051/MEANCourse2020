import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule,
         MatCardModule,
         MatButtonModule,
         MatToolbarModule,
         MatExpansionModule} from '@angular/material';


import { AppComponent } from './app.component';

/*============= Internal Componentns =============*/
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { HeaderComponent   } from './header/header.component';
import { PostServise } from './posts/post.service';


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule
  ],
  providers: [
    PostServise
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
