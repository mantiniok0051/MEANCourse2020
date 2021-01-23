import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';



@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authSvc:AuthService, private router: Router) {

  }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot,)
              :boolean | Observable<boolean> | Promise<boolean> {
                const isAuthenticated = this.authSvc.getIsAuthenticated();
                if (!isAuthenticated) {
                  this.router.navigate(['login']);
                }
                return isAuthenticated;
              }
}
