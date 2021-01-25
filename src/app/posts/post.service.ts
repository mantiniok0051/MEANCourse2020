import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from "../../environments/environment";
import { Post } from './post.model';

const BACKEND_URL = environment.apiURL+'/posts/';


@Injectable({providedIn: 'root'})
export class PostServise{
  private PostList: Post[] = [];
  private PostUpdated = new Subject<{retrivedPosts: Post[], totalStoredPosts:number}>();

  constructor(private http : HttpClient, private router: Router){}

  //pedir al servidor la lista de post en la BD
  getPostList(postPerPage:number, currentPage:number){
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get<{message: string,
                   posts: any,
                   totalStoredPosts:number}>
                  (BACKEND_URL+queryParams)
    .pipe(map((postData) => {
          return {retrivedPosts: postData.posts.map(post => {
                  return { image: post.imagePath,
                           title: post.title,
                           content: post.content,
                           id: post._id,
                           creator: post.creator
                         };
                    }),
                totalStoredPosts: postData.totalStoredPosts
              };
      }))
    .subscribe(retrievedPostsData => {

      this.PostList = retrievedPostsData.retrivedPosts;
      this.PostUpdated.next({
                             retrivedPosts:[...this.PostList],
                             totalStoredPosts:retrievedPostsData.totalStoredPosts
                           });
    });
  }

  getPostUpdatedListener(){
    return this.PostUpdated.asObservable();
  }

  addPost(title:string, content:string, image:File, creator:string){
    const postData = new FormData();
    postData.append('title',title);
    postData.append('content',content);
    postData.append('image',image, title);

    this.http.post<{message: string, post: Post}>(
      BACKEND_URL, postData)
      .subscribe((responseData)=>{
        console.log(responseData);

        this.router.navigate(['/']);
    });
  }

  deletePost(target_id: string){
    return this.http.delete(BACKEND_URL+target_id);

  }

  getPost(target_id:string){
    //return {...this.PostList.find(p => p.id === target_id )};
    return this.http.get<{_id:string,
                          title:string,
                          content:string,
                          imagePath: string,
                          creator:string}>(BACKEND_URL+target_id);
  }

  updatePost(target_id: string, target_title: string, target_content: string, target_image: File | string, target_creator:string){
    let edited_post: Post | FormData;
    //let edited_post: Post = {id: target_id, title: target_title, content:target_content, imagePath};

    if (typeof target_image === "object") {
      edited_post = new FormData();
      edited_post.append("id", target_id);
      edited_post.append("title", target_title);
      edited_post.append("content", target_content);
      edited_post.append("image", target_image, target_title);
      edited_post.append("ceator",target_creator);
    } else{
      edited_post = {
        id: target_id,
        title: target_title,
        content:target_content,
        imagePath:target_image,
        creator:null};
    }
    this.http.put(BACKEND_URL+target_id, edited_post)
    .subscribe((response) => {
      this.router.navigate(['/']);
    });
  }
}
//OmbMe2Q8Kp5bG59D
