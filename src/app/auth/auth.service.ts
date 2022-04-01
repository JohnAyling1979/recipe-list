import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, BehaviorSubject, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { environment } from "../../environments/environment";
import { Store } from "@ngrx/store";
import { AppStore } from "../store/app.reducer";
import * as AuthAction from "./store/auth.actions";

export interface AuthResponseData {
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
}


@Injectable({providedIn: 'root'})
export class AuthService {
	private signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;
	private signinUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;
	private tokenExpirationTimer: any;

	// user = new BehaviorSubject<User>(null);

	constructor(private http:HttpClient, private router: Router, private store: Store<AppStore>) {}

	autoLogin() {
		const userData = JSON.parse(localStorage.getItem('userData'));

		if (!userData) {
			return;
		}

		const loadedUser = new User(
			userData.email,
			userData.id,
			userData._token,
			new Date(userData.tokenExpirationDate)
		)

		if (loadedUser.token) {
			this.store.dispatch(new AuthAction.Login(loadedUser));

			const expirationDuration = loadedUser.tokenExpirationDate.getTime() - new Date().getTime();

			this.autoLogout(expirationDuration);
		}
	}

	autoLogout(expirationDuration: number) {
		this.tokenExpirationTimer = setTimeout(() => {
			this.logout();
		}, expirationDuration);
	}

	signup(email: string, password: string) {
		return this.http.post<AuthResponseData>(this.signupUrl, {
			email,
			password,
			returnSecureToken: true,
		}).pipe(catchError(this.handleError), tap(resData => {
			this.handleUser(resData);
		}));
	}

	login(email: string, password: string) {
		return this.http.post<AuthResponseData>(this.signinUrl, {
			email,
			password,
			returnSecureToken: true,
		}).pipe(catchError(this.handleError), tap(resData => {
			this.handleUser(resData);
		}));
	}

	logout() {
		this.store.dispatch(new AuthAction.Logout);
		localStorage.removeItem('userData');
		this.router.navigate(['/auth']);

		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer);
		}

		this.tokenExpirationTimer = null;
	}

	private handleUser(resData: AuthResponseData) {
		const expirationDate = new Date((new Date()).getTime() + +resData.expiresIn * 1000);
		const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);

		this.store.dispatch(new AuthAction.Login(user));
		this.autoLogout(+resData.expiresIn * 1000);
		localStorage.setItem('userData', JSON.stringify(user));
	}

	private handleError(errorRes: HttpErrorResponse) {
		const errorMap = {
			EMAIL_EXISTS: 'This email exists already',
			EMAIL_NOT_FOUND: 'There is no account with this email',
			INVALID_PASSWORD: 'The password you entered is incorrect'
		}

		const errorMessage = errorMap[errorRes?.error?.error?.message] ? errorMap[errorRes.error.error.message] : 'An unknown error has occurred';

		return throwError(errorMessage);
	}
}