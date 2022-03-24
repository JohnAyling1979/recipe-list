import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, BehaviorSubject, tap, throwError } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
}


@Injectable({providedIn: 'root'})
export class AuthService {
	private apiKey = 'AIzaSyC2COAURl3rWN06U5otc2C5-ed2it6h3rs';
	private signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
	private signinUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

	user = new BehaviorSubject<User>(null);

	constructor(private http:HttpClient) {}

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

	private handleUser(resData: AuthResponseData) {
		const expirationDate = new Date((new Date()).getTime() + +resData.expiresIn * 1000);
		const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);

		this.user.next(user);
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