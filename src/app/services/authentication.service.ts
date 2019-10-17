import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { apiUrl } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentTokenSubject: BehaviorSubject<any>
    public currentToken: Observable<any>
    constructor(private http: HttpClient) {
        this.currentTokenSubject = new BehaviorSubject<any>(localStorage.getItem("token"))
        this.currentToken = this.currentTokenSubject.asObservable()
    }

    public get token() {
        return this.currentTokenSubject.value
    }

    login(email, password) {
        return this.http.post<any>(`${apiUrl}/users/authenticate`, { email, password })
            .pipe(map(res => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('token', res.token);
                this.currentTokenSubject.next(res.token)
                return res;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('token');
        this.currentTokenSubject.next(null);
    }
}