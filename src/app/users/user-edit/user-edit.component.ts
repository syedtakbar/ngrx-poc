import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { User } from '../user';
import { UserService } from '../user.service';
import { GenericValidator } from '../../shared/generic-validator';
import { NumberValidators } from '../../shared/number.validator';

@Component({
  selector: 'pm-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit, OnDestroy {
  pageTitle = 'User Edit';
  errorMessage = '';
  userForm: FormGroup;

  user: User | null;
  sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private userService: UserService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      userName: {
        required: 'User name is required.',
        minlength: 'User name must be at least three characters.',
        maxlength: 'User name cannot exceed 50 characters.'
      },
      position: {
        required: 'Position is required.'
      },
      rating: {
        range: 'Rate the user between 1 (lowest) and 5 (highest).'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    // Define the form group
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      position: ['', Validators.required],
      rating: ['', NumberValidators.range(1, 5)],
      description: ''
    });

    // Watch for changes to the currently selected user
    this.sub = this.userService.selectedUserChanges$.subscribe(
      currentUser => this.displayUser(currentUser)
    );

    // Watch for value changes for validation
    this.userForm.valueChanges.subscribe(
      () => this.displayMessage = this.genericValidator.processMessages(this.userForm)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.userForm);
  }

  displayUser(user: User | null): void {
    // Set the local User property
    this.user = user;

    if (user) {
      // Reset the form back to pristine
      this.userForm.reset();

      // Display the appropriate page title
      if (user.id === 0) {
        this.pageTitle = 'Add User';
      } else {
        this.pageTitle = `Edit User: ${user.userName}`;
      }

      // Update the data on the form
      this.userForm.patchValue({
        userName: user.userName,
        position: user.position,
        rating: user.rating,
        description: user.description
      });
    }
  }

  cancelEdit(user: User): void {
    // Redisplay the currently selected user
    // replacing any edits made
    this.displayUser(user);
  }

  deleteUser(user: User): void {
    if (user && user.id) {
      if (confirm(`Really delete the user: ${user.userName}?`)) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => this.userService.changeSelectedUser(null),
          error: err => this.errorMessage = err
        });
      }
    } else {
      // No need to delete, it was never saved
      this.userService.changeSelectedUser(null);
    }
  }

  saveUser(originalUser: User): void {
    if (this.userForm.valid) {
      if (this.userForm.dirty) {
        // Copy over all of the original user properties
        // Then copy over the values from the form
        // This ensures values not on the form, such as the Id, are retained
        const user = { ...originalUser, ...this.userForm.value };

        if (user.id === 0) {
          this.userService.createUser(user).subscribe({
            next: p => this.userService.changeSelectedUser(p),
            error: err => this.errorMessage = err
          });
        } else {
          this.userService.updateUser(user).subscribe({
            next: p => this.userService.changeSelectedUser(p),
            error: err => this.errorMessage = err
          });
        }
      }
    }
  }

}
