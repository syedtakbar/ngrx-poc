import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl = 'api/users';
  private users: User[];

  private selectedUserSource = new BehaviorSubject<User | null>(null);
  selectedUserChanges$ = this.selectedUserSource.asObservable();

  constructor(private http: HttpClient) { }

  changeSelectedUser(selectedUser: User | null): void {
    this.selectedUserSource.next(selectedUser);
  }

  getUsers(): Observable<User[]> {
    if (this.users) {
      return of(this.users);
    }
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        tap(data => this.users = data),
        catchError(this.handleError)
      );
  }

  
  newUser(): User {
    return {
      id: 0,
      userName: '',
      position: '',
      description: '',
      rating: 0
    };
  }

  createUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    const newUser = { ...user, id: null };
    return this.http.post<User>(this.usersUrl, newUser, { headers })
      .pipe(
        tap(data => console.log('createUser: ' + JSON.stringify(data))),
        tap(data => {
          this.users.push(data);
        }),
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<User>(url, { headers })
      .pipe(
        tap(data => console.log('deleteUser: ' + id)),
        tap(data => {
          const foundIndex = this.users.findIndex(item => item.id === id);
          if (foundIndex > -1) {
            this.users.splice(foundIndex, 1);
          }
        }),
        catchError(this.handleError)
      );
  }

  updateUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${user.id}`;
    return this.http.put<User>(url, user, { headers })
      .pipe(
        tap(() => console.log('updateUser: ' + user.id)),
        // Update the item in the list
        // This is required because the selected user that was edited
        // was a copy of the item from the array.
        tap(() => {
          const foundIndex = this.users.findIndex(item => item.id === user.id);
          if (foundIndex > -1) {
            this.users[foundIndex] = user;
          }
        }),
        // Return the user on an update
        map(() => user),
        catchError(this.handleError)
      );
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
