import { PageEvent } from '@angular/material';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';



import { Post } from '../post.model';
import { PostServise } from '../post.service';

import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  public PostsList:Post[] = [];
  private PostUpdateSubscription: Subscription;
  private authListenerSubs:Subscription;
  public loading = false;

  public totalPosts=0;
  public postPerPage=3;
  public currentPage=1;
  public pageSizeOptions = [3, 6, 9];
  public userIsAuthenticated = false;
  public userID:string;

  constructor(public postSvc:PostServise, private authSvc:AuthService) { }

  ngOnInit(): any{
    this.loading = true;
    this.userID = this.authSvc.getUserID();

    this.postSvc.getPostList(this.postPerPage, this.currentPage);
    this.PostUpdateSubscription = this.postSvc.getPostUpdatedListener()
      .subscribe((retrievedPostsData: {retrivedPosts:Post[], totalStoredPosts:number})=>{
        this.totalPosts = retrievedPostsData.totalStoredPosts;
        this.PostsList = retrievedPostsData.retrivedPosts;
        this.loading = false;
      });
    this.userIsAuthenticated = this.authSvc.getIsAuthenticated();
    this.authListenerSubs = this.authSvc.getAuthStatusListener()
    .subscribe(isAuthenticated =>{
      console.log(isAuthenticated);
      this.userIsAuthenticated = isAuthenticated;
      this.userID = this.authSvc.getUserID();
      //console.log('AuthStatus: '+this.userIsAuthenticated);
    });
  }

  ngOnDestroy(){
    this.PostUpdateSubscription.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  onDelete(target_id:string){
    this.loading = true;
    this.postSvc.deletePost(target_id).subscribe(()=>{
                  this.postSvc.getPostList(this.postPerPage, this.currentPage);
                }, ()=>{
                  this.loading = false;
                });
  }

  onChangedPage(pageData: PageEvent){
    this.loading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postPerPage = pageData.pageSize;
    this.postSvc.getPostList(this.postPerPage, this.currentPage);
    this.PostUpdateSubscription = this.postSvc.getPostUpdatedListener()
      .subscribe((retrievedPostsData: {retrivedPosts:Post[], totalStoredPosts:number})=>{
        this.totalPosts = retrievedPostsData.totalStoredPosts;
        this.PostsList = retrievedPostsData.retrivedPosts;
        this.userIsAuthenticated = this.authSvc.getIsAuthenticated();
        this.loading = false;
      });
  }
}
