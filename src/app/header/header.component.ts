import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userIsAuthenticated = false;
  private authListenerSubs:Subscription;

  constructor(private authSvc:AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authSvc.getIsAuthenticated();
    this.authListenerSubs = this.authSvc.getAuthStatusListener()
                                        .subscribe(isAuthenticated =>{
                                            this.userIsAuthenticated = isAuthenticated;
                                          });
  }

  onLogout(){
    this.authSvc.logOut();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();

  }
}
