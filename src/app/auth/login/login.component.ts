import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';


import { User } from '../user.model';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogInComponent implements OnInit, OnDestroy {
  public loading = false;
  private authListenerSubs:Subscription;

  constructor(public authSvc:AuthService) { }

  ngOnInit(): void {
    this.authListenerSubs = this.authSvc.getAuthStatusListener().subscribe(
      authStatus => {this.loading = false}
    );
    this.loading = false;
 }

  onLogin(loginForm:NgForm){
    if (loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authSvc.loginUser(loginForm.value.loginMail, loginForm.value.loginPwd);
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
