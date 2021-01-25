import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';


import { PostServise } from '../post.service';
import { Post } from '../post.model';
import { MIMETypeValitor } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  private ComponentTitle: string;
  public ComponentSubTitle: string;

  private mode = 'create';
  public loading = false;
  private target_id:string;
  private authListenerSubs:Subscription;
  public edit_post: Post;
  public CreatePostForm: FormGroup;
  public PostImgPreview: string;


  constructor(public postSvc:PostServise,
              public route: ActivatedRoute,
              private authSvc:AuthService) {
    this.ComponentTitle = 'PostCreateComponent';
    this.ComponentSubTitle = 'What\'s new?';
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  ngOnInit() {
    this.authListenerSubs = this.authSvc.getAuthStatusListener().subscribe(
      authStatus=>{
        this.loading = false;
      }
    );
    this.CreatePostForm = new FormGroup({
      'PostTitle': new FormControl(null, {validators:[Validators.required, Validators.minLength(3)]}),
      'PostContent': new FormControl(null, {validators:[Validators.required]}),
      'PostImage': new FormControl(null, {validators:[Validators.required], asyncValidators:[MIMETypeValitor]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if (paramMap.has('target_id')) {
        this.mode = 'edit';
        this.target_id = paramMap.get('target_id');
        this.loading = true;
        this.postSvc.getPost(this.target_id).subscribe(postData => {
          this.loading = false;
          this.edit_post = {id: postData._id,
                            title: postData.title,
                            content: postData.content,
                            imagePath: postData.imagePath,
                            creator:postData.creator};
                            console.log(this.edit_post);

          this.CreatePostForm.setValue({
                              PostTitle:this.edit_post.title,
                              PostContent:this.edit_post.content,
                              PostImage:this.edit_post.imagePath
                              }
                            );
        this.PostImgPreview = postData.imagePath;
        });
      }else{
        this.mode = 'create'
        this.target_id = null;
      }

      console.log('Current mode:' + this.mode);
    });
  }

  getComponentTitle() {
    return this.ComponentTitle;
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.CreatePostForm.patchValue({PostImage:file});
    this.CreatePostForm.get('PostImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = ()=>{
      this.PostImgPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.CreatePostForm.invalid) {
        return;
      }
    if (this.mode === 'create') {
      this.postSvc.addPost(
        this.CreatePostForm.value.PostTitle,
        this.CreatePostForm.value.PostContent,
        this.CreatePostForm.value.PostImage,
        'creator');
    }else{
      this.postSvc.updatePost(
        this.target_id,
        this.CreatePostForm.value.PostTitle,
        this.CreatePostForm.value.PostContent,
        this.CreatePostForm.value.PostImage,
        'creator');
    }
    this.CreatePostForm.reset();
  }
}
