import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';


import { User } from '../user.model';
import { AuthService } from '../auth.service';




@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  public loading = true;
  public signUpError = false;
  private authListenerSubs:Subscription;

  constructor(public authSvc:AuthService) { }

  ngOnInit(): void {
    this.authListenerSubs = this.authSvc.getAuthStatusListener().subscribe(
      authStatus => {
        this.loading = false
        this.signUpError = false;
      },error=>{
        console.log(error);
          this.signUpError = true;
          this.loading = false
      }
    );
    this.loading = false;
  }

  onSignup(signupForm:NgForm){
    if (signupForm.invalid) {
      return;
    }
    this.loading = true;
    this.authSvc.createUser(signupForm.value.signupMail, signupForm.value.signupPwd);
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
