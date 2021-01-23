import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent} from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LogInComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';

import { AuthGuard } from './auth/auth.guard';



const AppRoutes: Routes = [
  {path: '', component: PostListComponent },
  {path: 'create', component: PostCreateComponent, canActivate:[AuthGuard] },
  {path: 'edit/:target_id', component: PostCreateComponent, canActivate:[AuthGuard]  },
  {path: 'login', component: LogInComponent },
  {path: 'signup', component: SignUpComponent }
];

@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(AppRoutes) ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
