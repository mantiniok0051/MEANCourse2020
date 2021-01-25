import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';



import { AuthData } from './auth-data.model';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiURL+'/users/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token:string;
  private tokenTimer:NodeJS.Timer;
  private userID:string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http:HttpClient, private router: Router){}


  getToken(){
      return this.token;
    }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated(){
    return this.isAuthenticated;
  }

  getUserID(){
  const authdt = this.getAuthData();
    if (!authdt) {
      return 'visitor';

    } else {
      return authdt.userID;
    }

  }

  createUser(email:string, password:string){
  const authData:AuthData = {
      email:email,
      password:password
    };

    console.log(authData);

    this.http.post(BACKEND_URL+'signup', authData).subscribe((response)=>{
               console.log(response);
               this.router.navigate(['/']);
             }, error =>{
               console.log(error);
               this.authStatusListener.next(false);
               this.router.navigate(['signup']);
             });
  }//End of createUser()

  loginUser(email:string, password:string){
    const authData:AuthData = {
      email:email,
      password:password
    };
    this.http.post<{token:string, expiresIn:number, userID:string}>(BACKEND_URL+'login', authData)
    .subscribe((response)=>{
      const token = response.token;
      this.token = token;
      if (token) {
        console.log(response);
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userID = response.userID;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.userID);
        console.log(response);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation) {
      console.log('No auth info stored');
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userID = authInformation.userID;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }

  logOut(){
    console.log('closing session');
    this.token = null;
    this.isAuthenticated = false;
    this.userID = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  private saveAuthData(token:string, expirationDate:Date, userID:string) {
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('userID',userID);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userID');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userID = localStorage.getItem('userID');
    if (!token || !expirationDate) {
      return;
    }
    return{
      token:token,
      expirationDate:new Date(expirationDate),
      userID:userID
    }
  }

  private setAuthTimer(duration:number) {
    console.log('Setting timer for: '+duration+' Milliseconds');
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration);
  }

}
//AuthService end
