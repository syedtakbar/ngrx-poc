import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'pm-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  pageTitle = 'Users';
  errorMessage: string;

  displayCode: boolean;

  users: User[];

  // Used to highlight the selected user in the list
  selectedUser: User | null;
  sub: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.sub = this.userService.selectedUserChanges$.subscribe(
      currentUser => this.selectedUser = currentUser
    );

    this.userService.getUsers().subscribe({
      next: (users: User[]) => this.users = users,
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  checkChanged(): void {
    this.displayCode = !this.displayCode;
  }

  newUser(): void {
    this.userService.changeSelectedUser(this.userService.newUser());
  }

  userSelected(user: User): void {
    this.userService.changeSelectedUser(user);
  }

}
