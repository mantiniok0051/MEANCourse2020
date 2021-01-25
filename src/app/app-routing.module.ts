import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent} from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from './auth/auth.guard';



const AppRoutes: Routes = [
  {path: '', component: PostListComponent },
  {path: 'create', component: PostCreateComponent, canActivate:[AuthGuard] },
  {path: 'edit/:target_id', component: PostCreateComponent, canActivate:[AuthGuard]  },
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(AppRoutes) ],
  exports: [RouterModule,AuthModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
