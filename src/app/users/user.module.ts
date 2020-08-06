import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { UserShellComponent } from './user-shell/user-shell.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';

import { StoreModule } from '@ngrx/store';
import { userReducer } from './state/users.reducer';

const userRoutes: Routes = [
  { path: '', component: UserShellComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(userRoutes),
    StoreModule.forFeature('users', userReducer)
  ],
  declarations: [
    UserShellComponent,
    UserListComponent,
    UserEditComponent
  ]
})
export class UserModule { }
