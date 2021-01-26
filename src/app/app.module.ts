import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';




import { AppComponent } from './app.component';

/*============= Internal Componentns =============*/
import { HeaderComponent   } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { PostsModule } from "./posts/posts.module";
//import { AuthModule } from './auth/auth.module';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from "./angular-material.module";

/*============= Internal Services =============*/
import { PostServise } from './posts/post.service'; /*No esta listado ni en imports o providers*/
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';


@NgModule({
  declarations:[
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PostsModule,
    AngularMaterialModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule { }
//ng serve mean-course --disable-host-check true --host 192.168.100.8 --port 80
