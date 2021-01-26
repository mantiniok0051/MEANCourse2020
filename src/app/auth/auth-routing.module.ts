import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*============= Internal Componentns =============*/
import { LogInComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';

/*============= Route - Component =============*/
const AuthRoutes: Routes =[
  {path: 'login', component: LogInComponent },
  {path: 'signup', component: SignUpComponent}
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(AuthRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
